// The site's public address and wording for search engines, link previews and AI assistants.
// Falls back to the live domain (not localhost) so the sitemap and robots never point search engines at a dev machine.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://inviteonline.in").replace(/\/$/, "");
export const SITE_NAME = "InviteOnline";
export const SITE_TITLE = "InviteOnline: Online Wedding Invitations, E-Invites & RSVP";
export const SITE_DESCRIPTION =
  "Create a beautiful online invitation for your wedding, nikah, mehndi, birthday or any event. Wax-seal envelope, photos, music, maps and RSVP on one link you share on WhatsApp. Free to start.";
export const KEYWORDS = [
  "online invitation",
  "wedding invitation online",
  "digital wedding card",
  "e-invite",
  "e-invitation",
  "WhatsApp invitation",
  "nikah invitation",
  "walima invitation",
  "mehndi invitation",
  "engagement invitation",
  "birthday invitation online",
  "baby shower invitation",
  "invitation website",
  "RSVP online",
  "wedding website",
];
