# Email OTP: verify on register, reset password by code

Approved 2026-10-26.

## Goal
- Registration requires confirming a 6-digit code emailed via Brevo before the account is usable.
- Login stays email + password.
- Forgot password switches from an emailed link to an emailed code.

## Code rules
- 6 digits (`crypto.randomInt`), stored only as SHA-256 hash on the `User`.
- Valid 10 minutes. 5 wrong attempts invalidates it. One slot per user (`otpPurpose`: `verify` | `reset`); issuing a new code replaces the old one.
- Resend cooldown 60s (`otpSentAt`); inside the cooldown no new email is sent (silently), plus the existing hourly `emailLimiter`.

## Backend
- `User`: add `emailVerified` (no default), `otpHash`, `otpPurpose`, `otpExpires`, `otpAttempts`, `otpSentAt` (all `select: false` except `emailVerified`). Remove `resetPasswordToken`/`resetPasswordExpires`.
- Only `emailVerified === false` counts as unverified, so pre-existing accounts (field absent) keep working with no migration.
- `POST /auth/register {name,email,password}` → creates unverified user (or, if the email belongs to an unverified user, updates its name/password), emails a code, returns `201 {needsVerification:true, email}`. Verified email → 409.
- `POST /auth/verify-email {email,code}` → marks verified, sends welcome email, returns `{token,user}`.
- `POST /auth/resend-code {email,purpose}` → generic 200 always (no account enumeration).
- `POST /auth/login` → unverified + correct password returns `403 {message, needsVerification:true, email}` and sends a fresh code (cooldown respected).
- `POST /auth/forgot-password {email}` → same generic response whether or not the account exists; emails a reset code if it does.
- `POST /auth/reset-password {email,code,password}` → sets password, marks email verified (code proves ownership), returns `{token,user}`. Replaces `/reset-password/:token`.
- Wrong/expired/missing code → `400 "Invalid or expired code"`; 5th wrong attempt clears the code.

## Frontend
- `components/ui/OtpInput.js`: 6 boxes, paste-friendly, `autocomplete="one-time-code"`.
- `components/site/VerifyEmailStep.js`: code entry + resend with 60s countdown; on success stores the session.
- `/register`: shows the verify step after submit → `/dashboard/new`.
- `/login`: on 403 `needsVerification` shows the verify step → `/dashboard`.
- `/forgot-password`: step 1 email, step 2 code + new password + confirm → `/dashboard`.
- Delete `/reset-password/[token]` (old links expire within 30 min anyway).
- `lib/api.js`: attach the response body to thrown errors as `err.data`.

## Tests
Update `backend/tests` (register helper verifies by planting a known code hash). Cover: verify success, wrong code, expired code, attempt limit, unverified login → 403, re-register unverified email, verified duplicate → 409, forgot same-response, reset by code single-use, legacy user without the field can log in.
