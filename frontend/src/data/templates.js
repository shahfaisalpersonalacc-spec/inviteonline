// Page design templates. A template is a complete look for an invitation: colours and fonts
// (stored on `theme`, like a preset), the cover layout it starts with, and design rules the
// renderer reads from `theme.template`:
//   bands    plain | soft | alternate       how sections alternate behind the content
//   divider  none | torn | floral | wave | cloud | scallop | line   where two bands meet
//   decor    floral palette (data in decor/flora.js) or sky | balloons | geometric | deco | toran
//   heading  script | caps | serif          section heading style
//   foil     gold-foil names on the cover (set on the hero when the template is applied)
// `events` lists the occasions a template suits; the picker shows those first.

export const TEMPLATES = [
  {
    id: "blush-garden",
    label: "Blush Garden",
    tagline: "Watercolour roses and wisteria on soft ivory",
    events: ["birthday", "engagement", "baby-shower", "other", "wedding"],
    heroLayout: "floral",
    theme: {
      primary: "#a8764b", secondary: "#e7b9bb", background: "#fcf8f4", surface: "#fffdfa", text: "#5a4a45",
      fontHeading: "Pinyon Script", fontBody: "Cormorant Garamond", animation: "petals",
      entryStyle: "ivory-gatefold", sealColor: "#c9a24a", sealIcon: "monogram", bgType: "color", bgValue: "",
    },
    design: { bands: "plain", divider: "none", decor: "blush", heading: "script", foil: true },
  },
  {
    id: "bordeaux",
    label: "Bordeaux Romance",
    tagline: "Burgundy and cream bands with torn-paper edges",
    events: ["wedding", "walima", "engagement", "anniversary"],
    heroLayout: "photo-top",
    theme: {
      primary: "#5e1221", secondary: "#c99f72", background: "#f7efe6", surface: "#fffaf4", text: "#3b1b20",
      fontHeading: "Cormorant Garamond", fontBody: "Montserrat", animation: "petals",
      entryStyle: "burgundy-dove", sealColor: "#c9a24a", sealIcon: "dove", bgType: "color", bgValue: "",
    },
    design: { bands: "alternate", divider: "torn", decor: "bordeaux", heading: "serif" },
  },
  {
    id: "wine-peony",
    label: "Wine & Peony",
    tagline: "Deep wine with lush peonies where sections meet",
    events: ["wedding", "engagement", "walima"],
    heroLayout: "full",
    theme: {
      primary: "#6b1028", secondary: "#e9a5c0", background: "#fbf6f3", surface: "#ffffff", text: "#3a1620",
      fontHeading: "Pinyon Script", fontBody: "Cormorant Garamond", animation: "petals",
      entryStyle: "burgundy-dove", sealColor: "#a3313f", sealIcon: "rose", bgType: "color", bgValue: "",
    },
    design: { bands: "alternate", divider: "floral", decor: "peony", heading: "caps" },
  },
  {
    id: "ranunculus",
    label: "Ranunculus Meadow",
    tagline: "Olive script, coral ranunculus and a big date",
    events: ["wedding", "engagement", "anniversary", "birthday"],
    heroLayout: "floral",
    theme: {
      primary: "#5d6a35", secondary: "#ef8d6f", background: "#fbf9f2", surface: "#ffffff", text: "#4b5033",
      fontHeading: "Alex Brush", fontBody: "Cormorant Garamond", animation: "petals",
      entryStyle: "sage-botanical", sealColor: "#b8646e", sealIcon: "monogram", bgType: "color", bgValue: "",
    },
    design: { bands: "plain", divider: "none", decor: "ranunculus", heading: "script", heroDate: "stack" },
  },
  {
    id: "sage-linen",
    label: "Sage & Linen",
    tagline: "Torn-edge photos, sage tones and fine line icons",
    events: ["wedding", "engagement", "anniversary", "other"],
    heroLayout: "photo-top",
    theme: {
      primary: "#5f6f52", secondary: "#bfc9ad", background: "#f7f5ef", surface: "#fffefa", text: "#3d4237",
      fontHeading: "Pinyon Script", fontBody: "Lora", animation: "none",
      entryStyle: "linen-monogram", sealColor: "#5f6f52", sealIcon: "monogram", bgType: "color", bgValue: "",
    },
    design: { bands: "soft", divider: "torn", decor: null, heading: "serif" },
  },
  {
    id: "emerald-nikah",
    label: "Emerald Nikah",
    tagline: "Emerald and gold with geometric stars and arches",
    events: ["nikah", "walima", "wedding"],
    heroLayout: "arch",
    theme: {
      primary: "#0f4d3a", secondary: "#c9a24a", background: "#f8f4ea", surface: "#fffdf7", text: "#1f2e28",
      fontHeading: "Cinzel", fontBody: "Cormorant Garamond", animation: "stars",
      entryStyle: "door-royal", sealColor: "#c9a24a", sealIcon: "crest", bgType: "pattern", bgValue: "moroccan",
    },
    design: { bands: "alternate", divider: "scallop", decor: "geometric", heading: "caps" },
  },
  {
    id: "marigold-mehndi",
    label: "Marigold Mehndi",
    tagline: "A hanging marigold toran and festive colour",
    events: ["mehndi", "birthday", "party", "other"],
    heroLayout: "circle",
    theme: {
      primary: "#a8233f", secondary: "#f2a71b", background: "#fff7e8", surface: "#fffdf6", text: "#4a2712",
      fontHeading: "Dancing Script", fontBody: "Poppins", animation: "petals",
      entryStyle: "door-garden", sealColor: "#c2410c", sealIcon: "rose", bgType: "color", bgValue: "",
    },
    design: { bands: "soft", divider: "wave", decor: "marigold", heading: "script", toran: true },
  },
  {
    id: "little-star",
    label: "Little Star",
    tagline: "Clouds, stars and a sleepy moon in powder blue",
    events: ["baby-shower", "birthday"],
    heroLayout: "circle",
    theme: {
      primary: "#4a76a8", secondary: "#f2bfc4", background: "#f3f8fc", surface: "#ffffff", text: "#2e4058",
      fontHeading: "Dancing Script", fontBody: "Quicksand", animation: "stars",
      entryStyle: "linen-monogram", sealColor: "#4a76a8", sealIcon: "heart", bgType: "color", bgValue: "",
    },
    design: { bands: "soft", divider: "cloud", decor: "sky", heading: "script" },
  },
  {
    id: "confetti-pop",
    label: "Confetti Pop",
    tagline: "Balloons, confetti and bright playful colour",
    events: ["birthday", "party", "graduation"],
    heroLayout: "classic",
    theme: {
      primary: "#d63c74", secondary: "#ffc93c", background: "#fffaf3", surface: "#ffffff", text: "#2d2340",
      fontHeading: "Pacifico", fontBody: "Poppins", animation: "confetti",
      entryStyle: "midnight-gold", sealColor: "#d63c74", sealIcon: "heart", bgType: "color", bgValue: "",
    },
    design: { bands: "soft", divider: "wave", decor: "balloons", heading: "script" },
  },
  {
    id: "ivory-classic",
    label: "Ivory Classic",
    tagline: "Black, ivory and gold lines, quietly formal",
    events: ["corporate", "anniversary", "graduation", "party", "other"],
    heroLayout: "classic",
    theme: {
      primary: "#1f1f24", secondary: "#b8a27a", background: "#fbfaf6", surface: "#ffffff", text: "#2b2b2f",
      fontHeading: "Playfair Display", fontBody: "Montserrat", animation: "none",
      entryStyle: "linen-monogram", sealColor: "#1c1a3d", sealIcon: "crest", bgType: "color", bgValue: "",
    },
    design: { bands: "plain", divider: "line", decor: "deco", heading: "caps" },
  },
];

export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id) || null;

// Templates for an occasion first (in the template's own order), then the rest.
export function templatesFor(eventType) {
  const fits = TEMPLATES.filter((t) => t.events.includes(eventType));
  return [...fits, ...TEMPLATES.filter((t) => !t.events.includes(eventType))];
}

// The theme fields a template sets when chosen (mode and monogram stay the owner's).
export const templateTheme = (t) => ({ ...t.theme, template: t.id, preset: "custom" });
