const { describe, test, before: beforeAll, after: afterAll } = require('node:test');
const request = require('supertest');
const { start, stop, register, expect } = require('./setup');
const app = require('../src/app');
const User = require('../src/models/User');
const { sha256 } = require('../src/utils/tokens');

beforeAll(start);
afterAll(stop);

describe('auth', () => {
  test('register, login and me', async () => {
    const { token, user, credentials } = await register(request, app);
    expect(token).toBeTruthy();
    expect(user.email).toBe(credentials.email.toLowerCase());

    const login = await request(app).post('/api/auth/login').send({ email: credentials.email, password: credentials.password });
    expect(login.status).toBe(200);

    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${login.body.token}`);
    expect(me.status).toBe(200);
    expect(me.body.user.password).toBeUndefined();
  });

  test('duplicate email is rejected', async () => {
    const { credentials } = await register(request, app);
    const res = await request(app).post('/api/auth/register').send(credentials);
    expect(res.status).toBe(409);
  });

  test('wrong password and missing token are 401', async () => {
    const { credentials } = await register(request, app);
    const res = await request(app).post('/api/auth/login').send({ email: credentials.email, password: 'nope-nope' });
    expect(res.status).toBe(401);
    expect((await request(app).get('/api/auth/me')).status).toBe(401);
  });

  test('forgot password gives the same answer for unknown emails', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({ email: 'nobody@test.com' });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/If an account exists/);
  });

  test('reset password with a valid token, then token is single-use', async () => {
    const { credentials } = await register(request, app);
    await request(app).post('/api/auth/forgot-password').send({ email: credentials.email }).expect(200);

    // The raw token only exists in the email; plant a known one to simulate clicking the link.
    const raw = 'a'.repeat(64);
    await User.updateOne({ email: credentials.email }, { resetPasswordToken: sha256(raw), resetPasswordExpires: new Date(Date.now() + 60000) });

    const reset = await request(app).post(`/api/auth/reset-password/${raw}`).send({ password: 'newpassword1' });
    expect(reset.status).toBe(200);

    const login = await request(app).post('/api/auth/login').send({ email: credentials.email, password: 'newpassword1' });
    expect(login.status).toBe(200);

    const again = await request(app).post(`/api/auth/reset-password/${raw}`).send({ password: 'another1234' });
    expect(again.status).toBe(400);
  });
});
