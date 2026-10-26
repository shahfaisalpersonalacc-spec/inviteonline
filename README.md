# InviteOnline

Create beautiful online invitation pages (weddings, nikah, mehndi, birthdays, parties…), share one link anywhere, and collect RSVPs and wishes.

- **frontend/**: Next.js 16 (App Router, JavaScript, Tailwind CSS 4), port 3000
- **backend/**: Node.js + Express 5 REST API, MongoDB (Mongoose 9), port 5000
- **Email**: Brevo (welcome email and password reset)
- **Uploads**: Cloudinary (photos and music)

## Features

- Register, log in, forgot/reset password by email (Brevo), and profile/password change
- Dashboard with views, RSVPs and wishes per invitation, plus duplicate, delete and share
- **Entrance screens** guests tap to open, each with a "Preview opening" button in the editor:
  - Six wax-sealed envelopes (burgundy, sage damask, linen, olive botanical, midnight, ivory gatefold with ribbon)
  - Two arched door scenes (garden, royal)
  - The seal colour, emblem (monogram, dove, heart, butterfly, rose, crest) and monogram are customisable
- **Scratch-to-reveal**: a gold-foil card guests scratch with a finger to reveal the date
- **Wedding sections**: verse/quote (with Arabic), families, love-story timeline, gifts with copy buttons, FAQ, and a closing note. Hero layouts include an arched photo frame, a round photo, a full background photo, or classic text with gold-foil names
- Editor with a live phone/desktop preview, autosave, and separate Edit/Preview modes on mobile
  - **14 section types**: hero/cover, couple/hosts, story, multiple events, countdown, programme, venue + Google Map, photo gallery with lightbox, video (YouTube, Vimeo or MP4), dress code, RSVP form, guestbook wishes, contact (call/WhatsApp), text note
  - **12 themes**: custom colours, 16 Google fonts, and plain, gradient, pattern or image backgrounds
  - **Animations**: falling petals, hearts, confetti, stars, snow
  - **77 vector stickers** in gold, floral, love, wedding, desi & Islamic, party, baby and decor categories. Drag, resize, rotate, flip, layer, duplicate.
  - **Settings**: custom link (`/i/your-name`), publish/draft, optional password, background music, link-preview image and description
- Public page `/i/<slug>`
  - No login needed
  - Envelope "Open invitation" intro that starts the music
  - Share sheet: WhatsApp, Facebook, X, Telegram, Email, SMS, copy link, downloadable QR code
  - Server-rendered link previews (Open Graph)
- Guest management: RSVP summary (attending, maybe, declined, total headcount), search and filter, CSV export, wish moderation

Only the owner can edit an invitation. Anyone with the link can view it, unless the owner sets a password.

## Setup

Requires Node.js 20+.

### 1. Accounts you need
- **MongoDB Atlas**: create a free cluster and a database user, and allow your IP. Copy the connection string.
- **Brevo**:
  - Create an API key under *SMTP & API → API Keys*.
  - Add and verify a sender email under *Senders, Domains & Dedicated IPs*. Emails won't send from an unverified sender.
- **Cloudinary**: copy the cloud name, API key and API secret from the dashboard.

### 2. Backend
```bash
cd backend
cp .env.example .env      # then fill in the values
npm install
npm run dev               # http://localhost:5000/api/health
# No Atlas yet? `npm run dev:local` runs a local MongoDB (data in backend/.localdb)
```
If the Brevo keys are missing, emails are logged to the console instead of sent. If the Cloudinary keys are missing, uploads return a clear error, but you can still paste image URLs.

### 3. Frontend
```bash
cd frontend
cp .env.example .env.local   # NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SITE_URL
npm install
npm run dev                  # http://localhost:3000
```

### Tests
```bash
cd backend && npm test    # uses an in-memory MongoDB; no Atlas needed
```

## Environment variables

| backend/.env | Purpose |
|---|---|
| `MONGODB_URI` | Atlas connection string |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Login token signing |
| `CLIENT_URL` | Frontend URL, used for CORS and email links. Comma-separate multiple URLs. |
| `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME` | Email |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Uploads |

| frontend/.env.local | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | e.g. `https://api.yourdomain.com/api` |
| `NEXT_PUBLIC_SITE_URL` | e.g. `https://yourdomain.com`; used in share links and QR codes |

## Deploying
- **Backend**: Render, Railway or a VPS. Run `npm start`, set the env vars, and set `CLIENT_URL` to your frontend domain.
- **Frontend**: Vercel or a VPS. Run `npm run build && npm start` and set both `NEXT_PUBLIC_*` vars.
- Auth uses a bearer token, not cookies, so the frontend and backend can live on different domains.

## API overview
- `POST /api/auth/register | verify-email | resend-code | login | forgot-password | reset-password` (email codes sent via Brevo)
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `GET|POST /api/invitations`
- `GET|PUT|DELETE /api/invitations/:id`
- `POST /api/invitations/:id/duplicate`
- `GET /api/invitations/:id/rsvps[?format=csv]`
- `GET /api/invitations/:id/wishes`
- `POST /api/uploads/image | audio`
- Public:
  - `GET /api/public/:slug`
  - `POST /api/public/:slug/unlock | rsvp | wishes | view`
  - `GET /api/public/:slug/wishes`
