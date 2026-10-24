// Event-themed mouse cursors for invitation pages.
// Default: a small arrow in the theme colour with an event emblem tucked at its tail (precise pointing).
// Over links and buttons: the emblem alone, a little larger, centred on the pointer.
// Everything is drawn in a 24-unit box; a white outline keeps it visible on light and dark pages.

const EMBLEMS = {
  ring: (c, a) =>
    `<circle cx="12" cy="15" r="6.3" fill="none" stroke="#fff" stroke-width="4.4"/><circle cx="12" cy="15" r="6.3" fill="none" stroke="${c}" stroke-width="2.4"/>` +
    `<path d="M8.6 6.6 10.6 3.4h2.8l2 3.2L12 10.2Z" fill="${a}" stroke="#fff" stroke-width="1.1" stroke-linejoin="round"/>`,
  crescent: (c, a) =>
    `<path d="M14.5 2.8a9.4 9.4 0 1 0 6.9 15.4 7.6 7.6 0 1 1-6.9-15.4Z" fill="${c}" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/>` +
    `<path d="m18.4 5.2.8 1.9 2 .2-1.5 1.3.5 2-1.8-1.1-1.7 1.1.4-2-1.5-1.3 2-.2Z" fill="${a}" stroke="#fff" stroke-width=".7"/>`,
  flower: (c, a) =>
    [0, 72, 144, 216, 288].map((r) => `<ellipse cx="12" cy="6.6" rx="3.6" ry="5" fill="${c}" stroke="#fff" stroke-width="1.1" transform="rotate(${r} 12 12)"/>`).join("") +
    `<circle cx="12" cy="12" r="3" fill="${a}" stroke="#fff" stroke-width="1"/>`,
  heart: (c) =>
    `<path d="M12 21s-7.6-4.6-9.7-9.3C.8 8.3 3 4.3 6.9 4.3c2 0 3.5 1.1 5.1 3 1.6-1.9 3.1-3 5.1-3 3.9 0 6.1 4 4.6 7.4C19.6 16.4 12 21 12 21Z" fill="${c}" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/>`,
  balloon: (c, a) =>
    `<path d="M12 16.8c0 2 1.6 2.3 1 4.4" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M12 16.8c0 2 1.6 2.3 1 4.4" fill="none" stroke="${a}" stroke-width="1.2" stroke-linecap="round"/>` +
    `<path d="M12 2.4c4 0 6.6 3 6.6 6.8 0 4.1-3.4 7.3-6.6 7.6-3.2-.3-6.6-3.5-6.6-7.6 0-3.8 2.6-6.8 6.6-6.8Z" fill="${c}" stroke="#fff" stroke-width="1.3"/>` +
    `<path d="m10.9 16.6 1.1 1.4 1.1-1.4Z" fill="${c}"/><ellipse cx="9.6" cy="7" rx="1.3" ry="2" fill="#fff" opacity=".55"/>`,
  star: (c) =>
    `<path d="m12 2.6 2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 16.8l-5.8 3.3 1.4-6.4-4.9-4.4 6.5-.7Z" fill="${c}" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/>`,
  sparkle: (c, a) =>
    `<path d="M12 1.8c.7 5.3 2.9 7.5 8.2 8.2-5.3.7-7.5 2.9-8.2 8.2-.7-5.3-2.9-7.5-8.2-8.2 5.3-.7 7.5-2.9 8.2-8.2Z" fill="${c}" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/>` +
    `<path d="M19.4 15.2c.3 2.1 1.1 2.9 3.2 3.2-2.1.3-2.9 1.1-3.2 3.2-.3-2.1-1.1-2.9-3.2-3.2 2.1-.3 2.9-1.1 3.2-3.2Z" fill="${a}" stroke="#fff" stroke-width=".8"/>`,
  cap: (c, a) =>
    `<path d="M12 4.5 22.5 9.4 12 14.3 1.5 9.4Z" fill="${c}" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/>` +
    `<path d="M6 11.8v4.1c0 1.6 2.7 3 6 3s6-1.4 6-3v-4.1L12 14.6Z" fill="${c}" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/>` +
    `<path d="M21 10v5.4" stroke="${a}" stroke-width="1.6" stroke-linecap="round"/><circle cx="21" cy="16.4" r="1.4" fill="${a}"/>`,
};

const FOR_EVENT = {
  wedding: "ring",
  engagement: "ring",
  walima: "ring",
  nikah: "crescent",
  mehndi: "flower",
  anniversary: "heart",
  birthday: "balloon",
  "baby-shower": "star",
  party: "sparkle",
  graduation: "cap",
  corporate: "sparkle",
  other: "sparkle",
};

const uri = (svg, x, y, fallback) => `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${x} ${y}, ${fallback}`;

// CSS custom properties consumed by the `.inv-cursor` rules in globals.css.
export function cursorVars(eventType, theme) {
  const draw = EMBLEMS[FOR_EVENT[eventType] || "sparkle"];
  const c = theme.primary || "#7a2430";
  const a = theme.secondary || "#c9a24a";
  const arrow =
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">` +
    `<path d="M3 2.5v19.2l5.2-4.9 3.6 7.9 3.2-1.4-3.5-7.7 7.1-.2Z" fill="${c}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>` +
    `<g transform="translate(17 17) scale(.6)">${draw(c, a)}</g></svg>`;
  const hover =
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">` +
    `<circle cx="16" cy="16" r="15" fill="#fff" opacity=".32"/><g transform="translate(3 3) scale(1.083)">${draw(c, a)}</g></svg>`;
  return { "--inv-cursor": uri(arrow, 3, 3, "auto"), "--inv-cursor-hover": uri(hover, 16, 16, "pointer") };
}
