# InviteOnline — Design Spec (2026-10-21)

Users build a shareable digital invitation landing page and share its public link anywhere.
Anyone with the link can view the page; only the owner can edit it.

## Stack
- `frontend/` — Next.js (App Router, JavaScript, Tailwind CSS), port 3000.
- `backend/` — Node.js + Express REST API, port 5000.
- MongoDB Atlas via Mongoose. Cloudinary for images/audio. Brevo transactional email API.
- Auth: JWT bearer token (stored client-side in localStorage), bcrypt password hashing.

## Data models
- **User**: name, email (unique, lowercase), passwordHash, resetPasswordToken (sha256 hash), resetPasswordExpires.
- **Invitation**: owner(User), title, slug (unique, lowercase, `[a-z0-9-]`, 3–60 chars), eventType,
  theme {preset, primary, secondary, background, text, fontHeading, fontBody, bgType(color|gradient|pattern|image), bgValue},
  coverImage, sections[] {id, type, enabled, order, data(Mixed)}, stickers[] {id, stickerId, x%, y%, size, rotation, zIndex},
  music {url, title, autoplay}, published (bool), passwordHash (optional), views, timestamps.
- **Rsvp**: invitation, name, phone, email, status (yes|no|maybe), guests (1–20), message, timestamps.
- **Wish**: invitation, name, message (≤500), timestamps.

Section types: hero, hosts, story, event, countdown, schedule, venue, gallery, dresscode, contact, rsvp, wishes, note.

## API (prefix `/api`)
- `POST auth/register`, `POST auth/login`, `GET auth/me`, `POST auth/forgot-password`, `POST auth/reset-password/:token`, `PUT auth/profile`.
- `GET/POST invitations`, `GET/PUT/DELETE invitations/:id` (owner only), `POST invitations/:id/duplicate`, `GET invitations/slug-available/:slug`.
- `GET invitations/:id/rsvps` (+ `?format=csv`), `DELETE invitations/:id/rsvps/:rsvpId`, `GET invitations/:id/wishes`, `DELETE invitations/:id/wishes/:wishId`.
- `POST uploads/image`, `POST uploads/audio` (auth, Cloudinary, size/type limits).
- Public: `GET public/:slug` (published only; returns `{locked:true}` meta if password set and no valid unlock token),
  `POST public/:slug/unlock` → short-lived unlock token, `POST public/:slug/rsvp`, `GET/POST public/:slug/wishes`, `POST public/:slug/view`.

## Frontend routes
`/`, `/login`, `/register`, `/forgot-password`, `/reset-password/[token]`, `/dashboard`, `/dashboard/new`,
`/dashboard/edit/[id]`, `/dashboard/[id]/guests`, `/dashboard/profile`, `/i/[slug]` (public, SSR metadata for OG previews).

Editor: section list (enable/reorder/edit forms), theme picker, sticker library (~80 SVG/emoji stickers in categories)
with drag/resize/rotate on live preview, settings (slug, publish, password, music, cover). Debounced autosave.
Desktop: side panel + preview. Mobile: tabbed panel/preview.

Public page: envelope "Open invitation" intro → music starts; sections render by theme; stickers overlay positioned in %;
share bar (WhatsApp, Facebook, X, copy link, QR code); password gate when set.

## Security
Owner check on every mutating invitation route; public routes expose only published data and never passwordHash/owner email.
helmet, CORS restricted to `CLIENT_URL`, express-rate-limit on auth/rsvp/wish, zod validation, reset tokens hashed + 30-min
expiry + uniform response for unknown emails. Secrets only via `.env` (documented in `.env.example`).

## Verification
Backend: node:test + supertest with mongodb-memory-server (Jest dropped: its VM sandbox breaks the MongoDB 7 driver handshake) (auth, ownership, public visibility, RSVP).
Frontend: `next build` passes; manual run.
