const { describe, test, before: beforeAll, after: afterAll } = require('node:test');
const request = require('supertest');
const { start, stop, register, plantCode, CODE, expect } = require('./setup');
const app = require('../src/app');
const User = require('../src/models/User');

beforeAll(start);
afterAll(stop);

const newCredentials = () => ({ name: 'Test User', email: `u${Date.now()}${Math.random()}@test.com`, password: 'password123' });

describe('auth', () => {
  test('register, verify, login and me', async () => {
    const { token, user, credentials } = await register(request, app);
    expect(token).toBeTruthy();
    expect(user.email).toBe(credentials.email.toLowerCase());

    const login = await request(app).post('/api/auth/login').send({ email: credentials.email, password: credentials.password });
    expect(login.status).toBe(200);

    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${login.body.token}`);
    expect(me.status).toBe(200);
    expect(me.body.user.password).toBeUndefined();
  });

  test('register does not log in until the email is verified', async () => {
    const creds = newCredentials();
    const reg = await request(app).post('/api/auth/register').send(creds);
    expect(reg.status).toBe(201);
    expect(reg.body.needsVerification).toBe(true);
    expect(reg.body.token).toBeUndefined();

    const login = await request(app).post('/api/auth/login').send({ email: creds.email, password: creds.password });
    expect(login.status).toBe(403);
    expect(login.body.needsVerification).toBe(true);
    expect(login.body.token).toBeUndefined();
  });

  test('wrong and expired codes are rejected', async () => {
    const creds = newCredentials();
    await request(app).post('/api/auth/register').send(creds).expect(201);
    await plantCode(creds.email, 'verify');

    const wrong = await request(app).post('/api/auth/verify-email').send({ email: creds.email, code: '000000' });
    expect(wrong.status).toBe(400);

    await plantCode(creds.email, 'verify', { otpExpires: new Date(Date.now() - 1000) });
    const expired = await request(app).post('/api/auth/verify-email').send({ email: creds.email, code: CODE });
    expect(expired.status).toBe(400);
  });

  test('5 wrong attempts invalidate the code', async () => {
    const creds = newCredentials();
    await request(app).post('/api/auth/register').send(creds).expect(201);
    await plantCode(creds.email, 'verify');

    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/auth/verify-email').send({ email: creds.email, code: '000000' }).expect(400);
    }
    const right = await request(app).post('/api/auth/verify-email').send({ email: creds.email, code: CODE });
    expect(right.status).toBe(400);
  });

  test('re-registering an unverified email takes over the pending signup', async () => {
    const creds = newCredentials();
    await request(app).post('/api/auth/register').send(creds).expect(201);
    await request(app).post('/api/auth/register').send({ ...creds, name: 'New Name', password: 'different123' }).expect(201);

    await plantCode(creds.email, 'verify');
    const verify = await request(app).post('/api/auth/verify-email').send({ email: creds.email, code: CODE });
    expect(verify.status).toBe(200);
    expect(verify.body.user.name).toBe('New Name');
    await request(app).post('/api/auth/login').send({ email: creds.email, password: 'different123' }).expect(200);
  });

  test('duplicate verified email is rejected', async () => {
    const { credentials } = await register(request, app);
    const res = await request(app).post('/api/auth/register').send(credentials);
    expect(res.status).toBe(409);
  });

  test('accounts created before verification existed can still log in', async () => {
    const { credentials } = await register(request, app);
    await User.collection.updateOne({ email: credentials.email.toLowerCase() }, { $unset: { emailVerified: '' } });
    await request(app).post('/api/auth/login').send({ email: credentials.email, password: credentials.password }).expect(200);
  });

  test('wrong password and missing token are 401', async () => {
    const { credentials } = await register(request, app);
    const res = await request(app).post('/api/auth/login').send({ email: credentials.email, password: 'nope-nope' });
    expect(res.status).toBe(401);
    expect((await request(app).get('/api/auth/me')).status).toBe(401);
  });

  test('forgot password and resend give the same answer for unknown emails', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({ email: 'nobody@test.com' });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/If an account exists/);

    const resend = await request(app).post('/api/auth/resend-code').send({ email: 'nobody@test.com', purpose: 'reset' });
    expect(resend.status).toBe(200);
  });

  test('reset password with a valid code, then the code is single-use', async () => {
    const { credentials } = await register(request, app);
    await request(app).post('/api/auth/forgot-password').send({ email: credentials.email }).expect(200);
    await plantCode(credentials.email, 'reset');

    const reset = await request(app).post('/api/auth/reset-password').send({ email: credentials.email, code: CODE, password: 'newpassword1' });
    expect(reset.status).toBe(200);
    expect(reset.body.token).toBeTruthy();

    await request(app).post('/api/auth/login').send({ email: credentials.email, password: 'newpassword1' }).expect(200);

    const again = await request(app).post('/api/auth/reset-password').send({ email: credentials.email, code: CODE, password: 'another1234' });
    expect(again.status).toBe(400);
  });

  test('changing the password from the profile needs the current password and an emailed code', async () => {
    const { token, credentials } = await register(request, app);
    const auth = { Authorization: `Bearer ${token}` };
    const change = (body) => request(app).put('/api/auth/profile').set(auth).send({ currentPassword: credentials.password, newPassword: 'changed1234', ...body });

    expect((await request(app).post('/api/auth/password-code').set(auth).send({ currentPassword: 'wrong-pass' })).status).toBe(400);
    expect((await request(app).post('/api/auth/password-code').set(auth).send({ currentPassword: credentials.password })).status).toBe(200);

    expect((await change({})).status).toBe(400); // no code
    await plantCode(credentials.email, 'change');
    expect((await change({ code: '000000' })).status).toBe(400); // wrong code
    const done = await change({ code: CODE });
    expect(done.status).toBe(200);
    expect(done.body.token).toBeTruthy(); // this session continues with a fresh token...

    // ...while older sessions end
    expect((await request(app).get('/api/auth/me').set(auth)).status).toBe(401);
    await request(app).post('/api/auth/login').send({ email: credentials.email, password: 'changed1234' }).expect(200);
    const again = await request(app).put('/api/auth/profile').set({ Authorization: `Bearer ${done.body.token}` })
      .send({ currentPassword: 'changed1234', newPassword: 'again12345', code: CODE });
    expect(again.status).toBe(400); // code is single-use
  });

  test('a wrong code does not save other profile changes', async () => {
    const { token, credentials } = await register(request, app);
    const auth = { Authorization: `Bearer ${token}` };
    await plantCode(credentials.email, 'change');
    const res = await request(app).put('/api/auth/profile').set(auth).send({ name: 'Changed Name', currentPassword: credentials.password, newPassword: 'changed1234', code: '000000' });
    expect(res.status).toBe(400);
    expect((await request(app).get('/api/auth/me').set(auth)).body.user.name).toBe('Test User');
  });

  test('a profile photo can be set, kept across a name change, and removed', async () => {
    const { token } = await register(request, app);
    const auth = { Authorization: `Bearer ${token}` };
    const put = (body) => request(app).put('/api/auth/profile').set(auth).send(body);
    const url = 'https://res.cloudinary.com/demo/image/upload/me.jpg';

    expect((await put({ avatar: 'javascript:alert(1)' })).status).toBe(400);
    expect((await put({ avatar: url })).body.user.avatar).toBe(url);
    expect((await put({ name: 'New Name' })).body.user.avatar).toBe(url);
    expect((await request(app).get('/api/auth/me').set(auth)).body.user.avatar).toBe(url);
    expect((await put({ avatar: '' })).body.user.avatar).toBe('');
  });

  test('parallel wrong guesses still use up the code', async () => {
    const creds = newCredentials();
    await request(app).post('/api/auth/register').send(creds).expect(201);
    await plantCode(creds.email, 'reset');
    await Promise.all(Array.from({ length: 12 }, () => request(app).post('/api/auth/reset-password').send({ email: creds.email, code: '000000', password: 'newpassword1' })));
    const res = await request(app).post('/api/auth/reset-password').send({ email: creds.email, code: CODE, password: 'newpassword1' });
    expect(res.status).toBe(400); // locked out after 5 attempts
  });

  test('form mistakes come back as plain sentences', async () => {
    const msg = async (body) => (await request(app).post('/api/auth/register').send(body)).body.message;
    expect(await msg({})).toBe('Name is required');
    expect(await msg({ name: 'Al', email: 'not-an-email', password: 'password123' })).toBe('Please enter a valid email address');
    expect(await msg({ name: 'Al', email: 'a@b.com', password: 'short' })).toBe('Password must be at least 8 characters');
    expect(await msg({ name: 'A', email: 'a@b.com', password: 'password123' })).toBe('Name must be at least 2 characters');
  });

  test('a verify code cannot be used to reset the password', async () => {
    const creds = newCredentials();
    await request(app).post('/api/auth/register').send(creds).expect(201);
    await plantCode(creds.email, 'verify');
    const res = await request(app).post('/api/auth/reset-password').send({ email: creds.email, code: CODE, password: 'newpassword1' });
    expect(res.status).toBe(400);
  });
});
