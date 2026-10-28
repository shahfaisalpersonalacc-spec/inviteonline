// Sends transactional email through Brevo's REST API (no SDK needed).
// Docs: https://developers.brevo.com/reference/sendtransacemail
async function sendEmail({ to, toName, subject, html }) {
  const { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME } = process.env;

  if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL) {
    console.warn(`[email] Brevo not configured — would send "${subject}" to ${to}`);
    return { skipped: true };
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME || 'InviteOnline' },
      to: [{ email: to, ...(toName ? { name: toName } : {}) }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo send failed (${res.status}): ${body}`);
  }
  return res.json();
}

const layout = (inner) => `
<div style="font-family:Arial,Helvetica,sans-serif;background:#fdf2f8;padding:32px 12px">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;color:#1f2937">
    <h1 style="margin:0 0 16px;font-size:22px;color:#be185d">InviteOnline</h1>
    ${inner}
    <p style="margin-top:32px;font-size:12px;color:#9ca3af">You received this email because of activity on your InviteOnline account.</p>
  </div>
</div>`;

const OTP_INTRO = {
  verify: 'Use this code to confirm your email and finish creating your account.',
  reset: 'Use this code to reset your password.',
  change: 'Use this code to confirm the change of your password.',
};

// purpose: 'verify' | 'reset' | 'change'
const otpEmail = (name, code, purpose) =>
  layout(`
    <p>Hi ${escapeHtml(name)},</p>
    <p>${OTP_INTRO[purpose] || OTP_INTRO.verify} It is valid for 10 minutes.</p>
    <p style="text-align:center;margin:28px 0;font-size:32px;font-weight:bold;letter-spacing:8px;color:#be185d">${code}</p>
    <p style="font-size:13px;color:#6b7280">If you didn't request this, you can safely ignore this email.</p>`);

const welcomeEmail = (name, url) =>
  layout(`
    <p>Hi ${escapeHtml(name)}, welcome to InviteOnline! 🎉</p>
    <p>Create beautiful invitation pages, share the link anywhere and collect RSVPs in one place.</p>
    <p style="text-align:center;margin:28px 0">
      <a href="${url}" style="background:#db2777;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold">Create my first invitation</a>
    </p>`);

function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

module.exports = { sendEmail, otpEmail, welcomeEmail };
