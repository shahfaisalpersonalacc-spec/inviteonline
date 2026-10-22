# InviteOnline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full-stack invitation landing-page builder (Next.js frontend + Express backend) per `docs/superpowers/specs/2026-10-21-inviteonline-design.md`.

**Architecture:** Separate `frontend/` (Next.js App Router, Tailwind) and `backend/` (Express, Mongoose) apps talking over REST with a JWT bearer token. Invitations are documents with ordered `sections[]` and absolutely-positioned (percent) `stickers[]`; one shared renderer draws both the editor preview and the public page.

**Tech Stack:** Next.js + React + Tailwind CSS, Express 4, Mongoose 8, bcryptjs, jsonwebtoken, zod, multer + cloudinary, Brevo REST API (fetch), helmet, cors, express-rate-limit, node:test + supertest + mongodb-memory-server, qrcode.react.

## Global Constraints
- JavaScript only (no TypeScript). Node 20.
- Secrets only from `.env`; ship `.env.example` with names only. Never read real `.env` files.
- Backend port 5000, frontend port 3000. API prefix `/api`.
- Public page URL: `${CLIENT_URL}/i/<slug>`.
- Both the marketing site and public pages must be responsive from 320px width up.

---

### Task 1: Backend foundation + auth (with Brevo email)
**Files:** `backend/package.json`, `.env.example`, `src/app.js`, `src/server.js`, `src/config/db.js`, `src/models/User.js`,
`src/middleware/{auth,error,validate,rateLimit}.js`, `src/utils/{email,tokens}.js`, `src/routes/auth.routes.js`, `src/controllers/auth.controller.js`, `tests/auth.test.js`.
**Produces:** `requireAuth` sets `req.user` ({_id,name,email}); `app` exported from `src/app.js` (no listen) for tests;
`sendEmail({to, subject, html})` (no-op + console log when `BREVO_API_KEY` missing).
Responses: `{ token, user }` for register/login; `{ user }` for me; errors `{ message }` with proper status.
- [ ] Write auth tests (register → login → me; wrong password 401; forgot-password returns 200 for unknown email; reset with valid token changes password).
- [ ] Implement; run `npm test` → PASS.

### Task 2: Invitations, RSVPs, wishes, uploads, public API
**Files:** `src/models/{Invitation,Rsvp,Wish}.js`, `src/utils/{defaults,slug}.js`, `src/routes/{invitation,public,upload}.routes.js`, controllers, `src/config/cloudinary.js`, `tests/invitation.test.js`.
**Produces:** endpoints listed in spec. `buildDefaultSections(eventType)` returns ordered sections with sensible demo data.
Public serialization omits `owner`, `passwordHash`; adds `hasPassword`. Unlock token = JWT `{inv:id, scope:'unlock'}` 12h, sent as header `x-unlock-token`.
- [ ] Tests: owner can CRUD; other user gets 404 on edit; unpublished slug → 404 publicly; password page locked until unlock; RSVP stored and listed for owner; CSV export.
- [ ] Implement; `npm test` → PASS.

### Task 3: Frontend foundation + marketing + auth pages
**Files:** `frontend/` scaffold, `src/lib/{api,auth-context}.js`, `src/components/ui/*`, `src/components/site/{Navbar,Footer}.js`, `src/app/{page,layout}.js`, auth pages.
**Produces:** `api(path, {method, body, token?})` wrapper throwing `Error(message)`; `useAuth()` → `{user, token, login, register, logout, loading}`.
- [ ] `npm run build` → PASS.

### Task 4: Sticker library, themes, invitation renderer, public page
**Files:** `src/data/{stickers,themes,eventTypes}.js`, `src/components/invite/{InvitationRenderer,StickerLayer,sections/*,Envelope,ShareBar,PasswordGate,MusicPlayer}.js`, `src/app/i/[slug]/{page,PublicInvitation}.js`.
**Produces:** `<InvitationRenderer invitation editable={false} onStickerChange />`.
- [ ] `npm run build` → PASS.

### Task 5: Dashboard + editor + guests
**Files:** `src/app/dashboard/{layout,page}.js`, `new/page.js`, `edit/[id]/page.js`, `[id]/guests/page.js`, `profile/page.js`, `src/components/editor/*`.
- [ ] Editor autosave (800ms debounce) via `PUT /api/invitations/:id`; sticker drag/resize/rotate with pointer events.
- [ ] `npm run build` → PASS; manual run against backend.

### Task 6: README + final verification
- [ ] README with setup (Atlas, Cloudinary, Brevo sender verification), scripts, deploy notes.
- [ ] Backend tests PASS, frontend build PASS, both servers boot.
