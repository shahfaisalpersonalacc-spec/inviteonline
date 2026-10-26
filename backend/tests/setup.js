const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.CLIENT_URL = 'http://localhost:3000';
delete process.env.BREVO_API_KEY;

let mongo;

async function start() {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
}

async function stop() {
  await mongoose.disconnect();
  await mongo.stop();
}

// The real code only exists in the email; tests plant a known one to simulate reading it.
const CODE = '123456';
async function plantCode(email, purpose, extra = {}) {
  const User = require('../src/models/User');
  const { sha256 } = require('../src/utils/tokens');
  await User.updateOne(
    { email: email.toLowerCase() },
    { otpHash: sha256(CODE), otpPurpose: purpose, otpExpires: new Date(Date.now() + 60000), otpAttempts: 0, ...extra }
  );
}

// Registers and verifies the email, returning a logged-in session.
async function register(request, app, overrides = {}) {
  const body = { name: 'Test User', email: `u${Date.now()}${Math.random()}@test.com`, password: 'password123', ...overrides };
  await request(app).post('/api/auth/register').send(body).expect(201);
  await plantCode(body.email, 'verify');
  const res = await request(app).post('/api/auth/verify-email').send({ email: body.email, code: CODE });
  return { ...res.body, credentials: body };
}

module.exports = { start, stop, register, plantCode, CODE };

// Minimal jest-style `expect` on top of node:assert so tests read naturally.
const assert = require('node:assert/strict');
function expect(actual) {
  const m = {
    toBe: (v) => assert.strictEqual(actual, v),
    toEqual: (v) => assert.deepStrictEqual(actual, v),
    toBeTruthy: () => assert.ok(actual),
    toBeUndefined: () => assert.strictEqual(actual, undefined),
    toMatch: (re) => assert.match(String(actual), re),
    toContain: (v) => assert.ok(actual.includes(v), `expected to contain ${v}`),
    toBeGreaterThan: (v) => assert.ok(actual > v, `${actual} > ${v}`),
  };
  m.not = { toBe: (v) => assert.notStrictEqual(actual, v) };
  return m;
}

module.exports.expect = expect;
