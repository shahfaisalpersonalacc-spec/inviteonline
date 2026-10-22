// Theme presets — keep in sync with backend/src/utils/defaults.js THEMES.
export const THEMES = {
  blush: { label: "Blush Rose", primary: "#be185d", secondary: "#f9a8d4", background: "#fff7fb", surface: "#ffffff", text: "#3f3f46", fontHeading: "Great Vibes", fontBody: "Poppins", animation: "petals" },
  emerald: { label: "Emerald Nikah", primary: "#047857", secondary: "#d4af37", background: "#f0fdf4", surface: "#ffffff", text: "#1f2937", fontHeading: "Amiri", fontBody: "Lora", animation: "stars" },
  royal: { label: "Royal Purple", primary: "#4c1d95", secondary: "#d4af37", background: "#faf5ff", surface: "#ffffff", text: "#27272a", fontHeading: "Cinzel", fontBody: "Lora", animation: "stars" },
  marigold: { label: "Marigold Mehndi", primary: "#c2410c", secondary: "#facc15", background: "#fffbeb", surface: "#ffffff", text: "#3f2a14", fontHeading: "Pacifico", fontBody: "Poppins", animation: "petals" },
  "rose-gold": { label: "Rose Gold", primary: "#b76e79", secondary: "#e8c4a0", background: "#fdf6f0", surface: "#ffffff", text: "#4a3a3a", fontHeading: "Playfair Display", fontBody: "Lora", animation: "hearts" },
  candy: { label: "Candy Party", primary: "#db2777", secondary: "#38bdf8", background: "#fdf4ff", surface: "#ffffff", text: "#312e81", fontHeading: "Pacifico", fontBody: "Quicksand", animation: "confetti" },
  sky: { label: "Baby Sky", primary: "#0284c7", secondary: "#fbcfe8", background: "#f0f9ff", surface: "#ffffff", text: "#1e3a5f", fontHeading: "Dancing Script", fontBody: "Quicksand", animation: "hearts" },
  champagne: { label: "Champagne", primary: "#a16207", secondary: "#e7d3a8", background: "#fefaf2", surface: "#ffffff", text: "#3b3025", fontHeading: "Playfair Display", fontBody: "Lora", animation: "stars" },
  midnight: { label: "Midnight Gold", primary: "#facc15", secondary: "#a78bfa", background: "#0f172a", surface: "#1e293b", text: "#e2e8f0", fontHeading: "Cinzel", fontBody: "Poppins", animation: "confetti" },
  slate: { label: "Corporate Slate", primary: "#1d4ed8", secondary: "#94a3b8", background: "#f8fafc", surface: "#ffffff", text: "#0f172a", fontHeading: "Playfair Display", fontBody: "Inter", animation: "none" },
  sage: { label: "Sage Garden", primary: "#4d7c0f", secondary: "#d9c8a9", background: "#f7f9f2", surface: "#ffffff", text: "#2f3a22", fontHeading: "Parisienne", fontBody: "Cormorant Garamond", animation: "petals" },
  ruby: { label: "Ruby Shaadi", primary: "#9f1239", secondary: "#f59e0b", background: "#fff1f2", surface: "#ffffff", text: "#3f1d24", fontHeading: "Alex Brush", fontBody: "Montserrat", animation: "petals" },
};

// `weights: null` means the family only has one weight (request it without axis).
export const FONTS = [
  { name: "Great Vibes", kind: "script", weights: null },
  { name: "Dancing Script", kind: "script", weights: "400;700" },
  { name: "Pacifico", kind: "script", weights: null },
  { name: "Parisienne", kind: "script", weights: null },
  { name: "Alex Brush", kind: "script", weights: null },
  { name: "Sacramento", kind: "script", weights: null },
  { name: "Playfair Display", kind: "serif", weights: "400;600;700" },
  { name: "Cinzel", kind: "serif", weights: "400;600;700" },
  { name: "Cormorant Garamond", kind: "serif", weights: "400;600;700" },
  { name: "Lora", kind: "serif", weights: "400;600;700" },
  { name: "Amiri", kind: "serif", weights: "400;700" },
  { name: "Noto Nastaliq Urdu", kind: "serif", weights: "400;700" },
  { name: "Poppins", kind: "sans", weights: "300;400;600;700" },
  { name: "Montserrat", kind: "sans", weights: "300;400;600;700" },
  { name: "Quicksand", kind: "sans", weights: "400;600;700" },
  { name: "Inter", kind: "sans", weights: "400;600;700" },
];

export function googleFontsHref(names) {
  const families = [...new Set(names.filter(Boolean))]
    .map((n) => {
      const f = FONTS.find((x) => x.name === n);
      if (!f) return null;
      const fam = f.name.replace(/ /g, "+");
      return f.weights ? `family=${fam}:wght@${f.weights}` : `family=${fam}`;
    })
    .filter(Boolean);
  return families.length ? `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap` : null;
}

export const GRADIENTS = [
  "linear-gradient(160deg,#fff1f2 0%,#fce7f3 50%,#f5d0fe 100%)",
  "linear-gradient(160deg,#fefce8 0%,#fde68a 100%)",
  "linear-gradient(160deg,#ecfdf5 0%,#a7f3d0 100%)",
  "linear-gradient(160deg,#eff6ff 0%,#c7d2fe 100%)",
  "linear-gradient(160deg,#fdf4ff 0%,#fbcfe8 45%,#bae6fd 100%)",
  "linear-gradient(160deg,#fff7ed 0%,#fed7aa 100%)",
  "linear-gradient(160deg,#0f172a 0%,#312e81 100%)",
  "linear-gradient(160deg,#1c1917 0%,#78350f 100%)",
  "linear-gradient(160deg,#4c0519 0%,#9f1239 100%)",
  "radial-gradient(circle at 20% 0%,#fde68a 0%,transparent 40%),radial-gradient(circle at 100% 100%,#f9a8d4 0%,transparent 45%),#fffaf5",
];

const svgUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

export const PATTERNS = [
  { id: "dots", label: "Dots", css: (c) => `radial-gradient(${c}22 1.5px, transparent 1.6px) 0 0/18px 18px` },
  { id: "grid", label: "Grid", css: (c) => `linear-gradient(${c}14 1px,transparent 1px) 0 0/24px 24px, linear-gradient(90deg,${c}14 1px,transparent 1px) 0 0/24px 24px` },
  { id: "diagonal", label: "Lines", css: (c) => `repeating-linear-gradient(45deg, ${c}12 0 2px, transparent 2px 14px)` },
  {
    id: "hearts",
    label: "Hearts",
    css: (c) => `${svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><path d='M20 30s-9-6-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 12-9 12z' fill='${c}' fill-opacity='.12'/></svg>`)} 0 0/40px 40px`,
  },
  {
    id: "stars",
    label: "Stars",
    css: (c) => `${svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44'><path d='M22 10l3 7 7 .6-5.4 4.6 1.7 7L22 25.5 15.7 29.2l1.7-7L12 17.6l7-.6z' fill='${c}' fill-opacity='.12'/></svg>`)} 0 0/44px 44px`,
  },
  {
    id: "moroccan",
    label: "Moroccan",
    css: (c) => `${svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><path d='M24 2 L30 18 L46 24 L30 30 L24 46 L18 30 L2 24 L18 18 Z' fill='none' stroke='${c}' stroke-opacity='.14' stroke-width='1.5'/></svg>`)} 0 0/48px 48px`,
  },
  {
    id: "floral",
    label: "Floral",
    css: (c) => `${svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><g fill='${c}' fill-opacity='.1'><circle cx='28' cy='20' r='6'/><circle cx='20' cy='28' r='6'/><circle cx='36' cy='28' r='6'/><circle cx='28' cy='36' r='6'/></g><circle cx='28' cy='28' r='4' fill='${c}' fill-opacity='.18'/></svg>`)} 0 0/56px 56px`,
  },
];

export const ANIMATIONS = [
  { id: "none", label: "None" },
  { id: "petals", label: "Falling petals" },
  { id: "hearts", label: "Floating hearts" },
  { id: "confetti", label: "Confetti" },
  { id: "stars", label: "Twinkling stars" },
  { id: "snow", label: "Snow" },
];

// Resolves the CSS background for an invitation theme.
export function backgroundCss(theme) {
  const t = theme || {};
  switch (t.bgType) {
    case "gradient":
      return t.bgValue || GRADIENTS[0];
    case "pattern": {
      const p = PATTERNS.find((x) => x.id === t.bgValue) || PATTERNS[0];
      return `${p.css(t.primary || "#000000")}, ${t.background}`;
    }
    case "image":
      return t.bgValue ? `center/cover no-repeat url("${t.bgValue}") , ${t.background}` : t.background;
    default:
      return t.background;
  }
}
