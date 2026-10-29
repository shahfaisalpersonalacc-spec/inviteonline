const { describe, test, before: beforeAll, after: afterAll } = require('node:test');
const request = require('supertest');
const { start, stop, register, expect } = require('./setup');
const app = require('../src/app');

beforeAll(start);
afterAll(stop);

const auth = (token) => ({ Authorization: `Bearer ${token}` });

async function createInvite(token, body = { title: 'Ali & Sara', eventType: 'wedding' }) {
  const res = await request(app).post('/api/invitations').set(auth(token)).send(body);
  expect(res.status).toBe(201);
  return res.body.invitation;
}

describe('invitations', () => {
  test('create gives default sections, theme and a slug', async () => {
    const { token } = await register(request, app);
    const inv = await createInvite(token);
    expect(inv.slug).toMatch(/^ali-and-sara/);
    expect(inv.sections.find((s) => s.type === 'hero')).toBeTruthy();
    expect(inv.theme.primary).toMatch(/^#/);
    expect(inv.passwordHash).toBeUndefined();
  });

  test('create from a design template keeps its theme and cover layout', async () => {
    const { token } = await register(request, app);
    const inv = await createInvite(token, {
      title: 'Lucia & Juan',
      eventType: 'wedding',
      mode: 'light',
      theme: { template: 'sage-linen', primary: '#5f6f52', fontHeading: 'Pinyon Script' },
      heroLayout: 'photo-top',
      heroFoil: false,
    });
    expect(inv.theme.template).toBe('sage-linen');
    expect(inv.theme.primary).toBe('#5f6f52');
    expect(inv.theme.fontHeading).toBe('Pinyon Script');
    expect(inv.theme.mode).toBe('light');
    expect(inv.sections.find((s) => s.type === 'hero').data.layout).toBe('photo-top');
    expect(inv.sections.find((s) => s.type === 'hero').data.foil).toBe(false);

    const bad = await request(app).post('/api/invitations').set(auth(token)).send({ title: 'X', heroLayout: 'nope' });
    expect(bad.status).toBe(400);
  });

  test('only the owner can read, edit and delete', async () => {
    const owner = await register(request, app);
    const other = await register(request, app);
    const inv = await createInvite(owner.token);

    expect((await request(app).get(`/api/invitations/${inv._id}`).set(auth(other.token))).status).toBe(404);
    expect((await request(app).put(`/api/invitations/${inv._id}`).set(auth(other.token)).send({ title: 'hacked' })).status).toBe(404);
    expect((await request(app).delete(`/api/invitations/${inv._id}`).set(auth(other.token))).status).toBe(404);

    const ok = await request(app).put(`/api/invitations/${inv._id}`).set(auth(owner.token)).send({ title: 'Updated', theme: { primary: '#123456' } });
    expect(ok.status).toBe(200);
    expect(ok.body.invitation.title).toBe('Updated');
    expect(ok.body.invitation.theme.primary).toBe('#123456');
    expect(ok.body.invitation.theme.fontBody).toBeTruthy(); // partial theme update keeps other fields
  });

  test('slug validation and uniqueness', async () => {
    const { token } = await register(request, app);
    const a = await createInvite(token, { title: 'Party A' });
    const b = await createInvite(token, { title: 'Party B' });
    expect((await request(app).put(`/api/invitations/${b._id}`).set(auth(token)).send({ slug: a.slug })).status).toBe(409);
    expect((await request(app).put(`/api/invitations/${b._id}`).set(auth(token)).send({ slug: 'Bad Slug!' })).status).toBe(400);
    expect((await request(app).put(`/api/invitations/${b._id}`).set(auth(token)).send({ slug: 'my-cool-party' })).status).toBe(200);
  });

  test('public page: published only, no owner data', async () => {
    const { token } = await register(request, app);
    const inv = await createInvite(token);
    const pub = await request(app).get(`/api/public/${inv.slug}`);
    expect(pub.status).toBe(200);
    expect(pub.body.invitation.owner).toBeUndefined();
    expect(pub.body.locked).toBe(false);

    await request(app).put(`/api/invitations/${inv._id}`).set(auth(token)).send({ published: false });
    expect((await request(app).get(`/api/public/${inv.slug}`)).status).toBe(404);
  });

  test('password protected page needs unlock token', async () => {
    const { token } = await register(request, app);
    const inv = await createInvite(token);
    await request(app).put(`/api/invitations/${inv._id}`).set(auth(token)).send({ password: 'secret' }).expect(200);

    const locked = await request(app).get(`/api/public/${inv.slug}`);
    expect(locked.body.locked).toBe(true);
    expect(locked.body.invitation.sections).toBeUndefined();

    expect((await request(app).post(`/api/public/${inv.slug}/unlock`).send({ password: 'wrong' })).status).toBe(401);
    const { body } = await request(app).post(`/api/public/${inv.slug}/unlock`).send({ password: 'secret' });
    const open = await request(app).get(`/api/public/${inv.slug}`).set('x-unlock-token', body.unlockToken);
    expect(open.body.locked).toBe(false);
    expect(open.body.invitation.sections.length).toBeGreaterThan(0);

    const rsvpLocked = await request(app).post(`/api/public/${inv.slug}/rsvp`).send({ name: 'G', status: 'yes' });
    expect(rsvpLocked.status).toBe(403);
  });

  test('guests RSVP and leave wishes; owner sees and exports them', async () => {
    const { token } = await register(request, app);
    const inv = await createInvite(token);

    await request(app).post(`/api/public/${inv.slug}/rsvp`).send({ name: 'Guest One', status: 'yes', guests: 3 }).expect(201);
    await request(app).post(`/api/public/${inv.slug}/rsvp`).send({ name: 'Guest Two', status: 'no', guests: 4, message: '=HYPERLINK("http://x","y")' }).expect(201);
    await request(app).post(`/api/public/${inv.slug}/wishes`).send({ name: 'Aunt', message: 'Congrats!' }).expect(201);

    const list = await request(app).get(`/api/invitations/${inv._id}/rsvps`).set(auth(token));
    expect(list.body.summary).toEqual({ yes: 1, no: 1, maybe: 0, totalGuests: 3 });

    const csv = await request(app).get(`/api/invitations/${inv._id}/rsvps?format=csv`).set(auth(token));
    expect(csv.headers['content-type']).toMatch(/text\/csv/);
    expect(csv.text).toContain('Guest One');
    expect(csv.text).toContain(`"'=HYPERLINK(""http://x"",""y"")"`); // a formula is exported as plain text

    const wishes = await request(app).get(`/api/public/${inv.slug}/wishes`);
    expect(wishes.body.wishes[0].message).toBe('Congrats!');

    const dash = await request(app).get('/api/invitations').set(auth(token));
    const row = dash.body.invitations.find((i) => i._id === inv._id);
    expect(row.rsvpCount).toBe(2);
    expect(row.wishCount).toBe(1);
  });

  test('new invitations show the chosen sections in order and use the details given', async () => {
    const { token } = await register(request, app);
    const inv = await createInvite(token, {
      title: 'Ali & Sara',
      eventType: 'wedding',
      details: {
        date: '2026-12-20T14:00:00.000Z',
        families: [{ title: "Bride's family", names: 'Mr. & Mrs. Khan' }],
        schedule: [{ time: '6:00 PM', title: 'Nikah' }, { time: '', title: '' }],
        venue: { name: 'Pearl Hall', address: 'Lahore' },
        contact: { name: 'Usman', phone: '9876543210' },
        closing: 'Thank you!',
      },
    });
    const on = inv.sections.filter((s) => s.enabled).map((s) => s.type);
    expect(on).toEqual(['hero', 'quote', 'scratch', 'countdown', 'families', 'schedule', 'venue', 'rsvp', 'wishes', 'contact', 'closing']);
    const data = (type) => inv.sections.find((s) => s.type === type).data;
    expect(data('hero').date).toBe('2026-12-20T14:00:00.000Z');
    expect(data('families').groups).toEqual([{ title: "Bride's family", names: 'Mr. & Mrs. Khan' }]);
    expect(data('schedule').items.length).toBe(1); // the empty row is dropped
    expect(data('venue').name).toBe('Pearl Hall');
    expect(data('contact').people[0].phone).toBe('9876543210');
    expect(data('closing').text).toBe('Thank you!');
  });

  test('non-couple occasions skip the verse and blessings', async () => {
    const { token } = await register(request, app);
    const inv = await createInvite(token, { title: "Zara's Birthday", eventType: 'birthday' });
    const on = inv.sections.filter((s) => s.enabled).map((s) => s.type);
    expect(on).toEqual(['hero', 'scratch', 'countdown', 'schedule', 'venue', 'rsvp', 'wishes', 'contact', 'closing']);
  });

  test('a new invitation can start with background music', async () => {
    const { token } = await register(request, app);
    const inv = await createInvite(token, { title: 'Ali & Sara', eventType: 'nikah', music: { url: '/music/noor.mp3', title: 'Noor', enabled: true } });
    expect(inv.music.url).toBe('/music/noor.mp3');
    expect(inv.music.enabled).toBe(true);
  });

  test('duplicate and delete', async () => {
    const { token } = await register(request, app);
    const inv = await createInvite(token);
    const sectionId = inv.sections[1].id;
    await request(app).put(`/api/invitations/${inv._id}`).set(auth(token))
      .send({ stickers: [{ id: 's1', stickerId: 'heart', sectionId, x: 10, y: 10, size: 10 }] }).expect(200);
    const dup = await request(app).post(`/api/invitations/${inv._id}/duplicate`).set(auth(token));
    expect(dup.status).toBe(201);
    expect(dup.body.invitation.slug).not.toBe(inv.slug);
    // the sticker stays on the same section, under that section's new id
    expect(dup.body.invitation.stickers[0].sectionId).toBe(dup.body.invitation.sections[1].id);
    await request(app).delete(`/api/invitations/${inv._id}`).set(auth(token)).expect(200);
    expect((await request(app).get(`/api/public/${inv.slug}`)).status).toBe(404);
  });
});
