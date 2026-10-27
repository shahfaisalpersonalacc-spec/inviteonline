import { luminance, mix } from "@/lib/color";

// Theme presets — keep in sync with backend/src/utils/defaults.js THEMES.
export const THEMES = {
  blush: { label: "Blush Romance", primary: "#9f2f45", secondary: "#e8b4b8", background: "#fffaf7", surface: "#ffffff", text: "#3d2b2f", fontHeading: "Great Vibes", fontBody: "Cormorant Garamond", animation: "petals", entryStyle: "linen-monogram", sealColor: "#7a2430", sealIcon: "monogram" },
  emerald: { label: "Emerald Nikah", primary: "#0f5c46", secondary: "#c9a24a", background: "#f5f8f3", surface: "#ffffff", text: "#1f2a24", fontHeading: "Cinzel", fontBody: "Cormorant Garamond", animation: "stars", entryStyle: "sage-botanical", sealColor: "#c9a24a", sealIcon: "crest" },
  royal: { label: "Royal Burgundy", primary: "#6b1e2a", secondary: "#c9a24a", background: "#fbf6f1", surface: "#ffffff", text: "#2e1a1e", fontHeading: "Cinzel", fontBody: "Cormorant Garamond", animation: "stars", entryStyle: "burgundy-dove", sealColor: "#c9a24a", sealIcon: "dove" },
  marigold: { label: "Marigold Mehndi", primary: "#b4471a", secondary: "#f2b33d", background: "#fffaf0", surface: "#ffffff", text: "#3f2a14", fontHeading: "Great Vibes", fontBody: "Poppins", animation: "petals", entryStyle: "door-garden", sealColor: "#b4471a", sealIcon: "rose" },
  "rose-gold": { label: "Rose Gold", primary: "#a8636e", secondary: "#e6c3a5", background: "#fdf7f3", surface: "#ffffff", text: "#4a3a3a", fontHeading: "Parisienne", fontBody: "Cormorant Garamond", animation: "hearts", entryStyle: "ivory-gatefold", sealColor: "#7c2b2b", sealIcon: "heart" },
  candy: { label: "Candy Party", primary: "#db2777", secondary: "#38bdf8", background: "#fdf4ff", surface: "#ffffff", text: "#312e81", fontHeading: "Pacifico", fontBody: "Quicksand", animation: "confetti", entryStyle: "door-garden", sealColor: "#db2777", sealIcon: "heart" },
  sky: { label: "Powder Blue", primary: "#2f6f9a", secondary: "#f3c6d3", background: "#f4f9fc", surface: "#ffffff", text: "#1e3a5f", fontHeading: "Dancing Script", fontBody: "Quicksand", animation: "hearts", entryStyle: "linen-monogram", sealColor: "#2f6f9a", sealIcon: "heart" },
  champagne: { label: "Champagne", primary: "#8a6a2f", secondary: "#e7d3a8", background: "#fdf9f1", surface: "#ffffff", text: "#3b3025", fontHeading: "Playfair Display", fontBody: "Cormorant Garamond", animation: "stars", entryStyle: "linen-monogram", sealColor: "#8a6a2f", sealIcon: "monogram" },
  midnight: { label: "Midnight Gold", primary: "#d9b25f", secondary: "#8b7cc8", background: "#11152b", surface: "#1b2140", text: "#e8e4d8", fontHeading: "Cinzel", fontBody: "Cormorant Garamond", animation: "stars", entryStyle: "midnight-gold", sealColor: "#c9a24a", sealIcon: "crest" },
  slate: { label: "Modern Ink", primary: "#1c1a3d", secondary: "#e8544a", background: "#f8f7f4", surface: "#ffffff", text: "#1c1a3d", fontHeading: "Playfair Display", fontBody: "Plus Jakarta Sans", animation: "none", entryStyle: "midnight-gold", sealColor: "#e8544a", sealIcon: "monogram" },
  sage: { label: "Sage Garden", primary: "#4f5d3a", secondary: "#c9b48a", background: "#f7f8f2", surface: "#ffffff", text: "#2f3a22", fontHeading: "Parisienne", fontBody: "Cormorant Garamond", animation: "petals", entryStyle: "sage-monogram", sealColor: "#b8646e", sealIcon: "monogram" },
  ruby: { label: "Ruby Shaadi", primary: "#8c1c2e", secondary: "#d9a441", background: "#fff8f5", surface: "#ffffff", text: "#3f1d24", fontHeading: "Great Vibes", fontBody: "Cormorant Garamond", animation: "petals", entryStyle: "burgundy-dove", sealColor: "#c9a24a", sealIcon: "dove" },
};

// Entry screens guests see first. Keep ids in sync with components/invite/entry/*.
export const ENTRY_STYLES = [
  { id: "burgundy-dove", label: "Burgundy & Gold", kind: "envelope", swatch: "#6b1e2a" },
  { id: "sage-monogram", label: "Sage Damask", kind: "envelope", swatch: "#9aa58a" },
  { id: "ivory-gatefold", label: "Ivory Rose Gatefold", kind: "gatefold", swatch: "#f3e9dc" },
  { id: "linen-monogram", label: "Classic Linen", kind: "envelope", swatch: "#ebe6dc" },
  { id: "sage-botanical", label: "Olive Botanical", kind: "envelope", swatch: "#7f8b6b" },
  { id: "midnight-gold", label: "Midnight & Gold", kind: "envelope", swatch: "#141a33" },
  // photographic doors (components/invite/entry/PhotoDoorEntry.js); older ids kept so saved invitations still work
  { id: "door-garden", label: "Lilac Vines Door", kind: "door", swatch: "#7a4a2c", photo: "/entrances/door-lilac-vines.webp" },
  { id: "door-castle", label: "Rose & Sage Door", kind: "door", swatch: "#a9c4b6", photo: "/entrances/door-rose-sage.webp" },
  { id: "door-emerald", label: "Emerald Ivy Door", kind: "door", swatch: "#2f5a35", photo: "/entrances/door-emerald-ivy.webp" },
  { id: "door-mural", label: "Moorish Garden Door", kind: "door", swatch: "#3f6e50", photo: "/entrances/door-moorish-garden.webp" },
  { id: "door-pastel", label: "Pink Rose Cottage", kind: "door", swatch: "#e9a094", photo: "/entrances/door-pink-cottage.webp" },
  { id: "door-royal", label: "Floral Palace Door", kind: "door", swatch: "#e8c9a8", photo: "/entrances/door-floral-palace.webp" },
  { id: "door-lattice", label: "Ivory Palace Door", kind: "door", swatch: "#efdcc0", photo: "/entrances/door-ivory-palace.webp" },
];

export const SEAL_ICONS = [
  { id: "monogram", label: "Monogram" },
  { id: "dove", label: "Dove" },
  { id: "heart", label: "Heart" },
  { id: "butterfly", label: "Butterfly" },
  { id: "rose", label: "Rose" },
  { id: "crest", label: "Laurel crest" },
];

export const SEAL_COLORS = ["#7a2430", "#a3313f", "#b8646e", "#c9a24a", "#1f3b5c", "#2f4a33", "#3a2a4f", "#1c1a3d"];

// `weights: null` means the family only has one weight (request it without axis).
export const FONTS = [
  { name: "Great Vibes", kind: "script", weights: null },
  { name: "Dancing Script", kind: "script", weights: "400;700" },
  { name: "Pacifico", kind: "script", weights: null },
  { name: "Parisienne", kind: "script", weights: null },
  { name: "Alex Brush", kind: "script", weights: null },
  { name: "Sacramento", kind: "script", weights: null },
  { name: "Pinyon Script", kind: "script", weights: null },
  { name: "Playfair Display", kind: "serif", weights: "400;600;700" },
  { name: "Cinzel", kind: "serif", weights: "400;600;700" },
  { name: "Cormorant Garamond", kind: "serif", weights: "ital,wght@0,400;0,600;0,700;1,400" },
  { name: "Lora", kind: "serif", weights: "400;600;700" },
  { name: "Amiri", kind: "serif", weights: "400;700" },
  { name: "Noto Nastaliq Urdu", kind: "serif", weights: "400;700" },
  { name: "Poppins", kind: "sans", weights: "300;400;600;700" },
  { name: "Montserrat", kind: "sans", weights: "300;400;600;700" },
  { name: "Quicksand", kind: "sans", weights: "400;600;700" },
  { name: "Inter", kind: "sans", weights: "400;600;700" },
  { name: "Plus Jakarta Sans", kind: "sans", weights: "400;600;700" },
];

export function googleFontsHref(names) {
  const families = [...new Set(names.filter(Boolean))]
    .map((n) => {
      const f = FONTS.find((x) => x.name === n);
      if (!f) return null;
      const fam = f.name.replace(/ /g, "+");
      if (!f.weights) return `family=${fam}`;
      return f.weights.includes("@") ? `family=${fam}:${f.weights}` : `family=${fam}:wght@${f.weights}`;
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

// Effective colours for an invitation. In dark mode every theme gets a deep, tinted
// background, raised card surfaces, light text and a primary lifted for contrast.
// Themes that are already dark (e.g. Midnight) are left as they are.
export function resolveTheme(t = {}) {
  if (t.mode !== "dark" || luminance(t.background || "#ffffff") < 0.3) return t;
  const base = t.primary || "#1c1a3d";
  return {
    ...t,
    background: mix(base, "#0d0c12", 0.88),
    surface: mix(base, "#1b1a24", 0.8),
    text: "#ece6dc",
    // glowing accent: the theme's metallic/secondary colour when it reads well on dark, else the lifted primary
    primary: luminance(t.secondary || "#000000") > 0.42 && luminance(t.secondary) < 0.88 ? t.secondary : luminance(base) < 0.55 ? mix(base, "#ffffff", 0.5) : base,
    secondary: luminance(base) < 0.55 ? mix(base, "#ffffff", 0.35) : base,
    // light gradient presets don't suit a dark page; patterns and photos still work
    bgType: t.bgType === "gradient" ? "color" : t.bgType,
  };
}
