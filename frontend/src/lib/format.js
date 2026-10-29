const toDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

export function formatDate(v, opts = { weekday: "long", day: "numeric", month: "long", year: "numeric" }) {
  const d = toDate(v);
  return d ? d.toLocaleDateString("en-GB", opts) : "";
}

export function formatTime(v) {
  const d = toDate(v);
  return d ? d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";
}

// "2026-11-21T19:00" style value for <input type="datetime-local"> (local time).
export function toInputDateTime(v) {
  const d = toDate(v);
  if (!d) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function toInputDate(v) {
  return toInputDateTime(v).slice(0, 10);
}

export const fromInputDate = (v) => (v ? new Date(v).toISOString() : "");

export function mapEmbedUrl(query) {
  return query ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed` : "";
}

// Initials for a monogram from the names on the cover: two names -> "A&A", otherwise the first letter.
export function monogramOf(title = "") {
  const parts = String(title).split(/\s*(?:&|\+|\band\b|\bweds\b|\bwith\b)\s*/i).map((x) => x.trim()).filter(Boolean);
  const initial = (x) => (x.match(/[\p{L}\p{N}]/u) || [""])[0].toUpperCase();
  return parts.length >= 2 ? `${initial(parts[0])}&${initial(parts[1])}` : initial(parts[0] || "");
}

// A pasted map link (Google Maps share link, etc.) rather than an address.
export const isLink = (v) => /^https?:\/\/\S+$/i.test(String(v || "").trim());

export function mapLink(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || "")}`;
}

export function googleCalendarLink({ title, date, details = "", location = "" }) {
  const d = toDate(date);
  if (!d) return null;
  const end = new Date(d.getTime() + 3 * 3600 * 1000);
  const fmt = (x) => x.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const p = new URLSearchParams({ action: "TEMPLATE", text: title, dates: `${fmt(d)}/${fmt(end)}`, details, location });
  return `https://calendar.google.com/calendar/render?${p}`;
}

export function videoEmbed(url) {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { type: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { type: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}` };
  if (/\.(mp4|webm|mov)(\?|$)/i.test(url) || url.includes("/video/upload/")) return { type: "video", src: url };
  return null;
}

export const phoneDigits = (p = "") => p.replace(/[^\d+]/g, "");
export const whatsappLink = (phone, text = "") => `https://wa.me/${phoneDigits(phone).replace(/^\+/, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export function timeAgo(v) {
  const d = toDate(v);
  if (!d) return "";
  const s = Math.round((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  const units = [["year", 31536000], ["month", 2592000], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [name, secs] of units) {
    const n = Math.floor(s / secs);
    if (n >= 1) return `${n} ${name}${n > 1 ? "s" : ""} ago`;
  }
  return "";
}
