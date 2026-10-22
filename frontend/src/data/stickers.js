// Sticker library: hand-made vector art, crisp at any size.
const S = (body, vb = "0 0 100 100") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${body}</svg>`;

const petal = (cx, cy, r, color, rot) => `<ellipse cx="${cx}" cy="${cy - r}" rx="${r * 0.55}" ry="${r}" fill="${color}" transform="rotate(${rot} ${cx} ${cy})"/>`;
const flower = (cx, cy, r, color, center = "#fbbf24", petals = 6) =>
  Array.from({ length: petals }, (_, i) => petal(cx, cy, r, color, (360 / petals) * i)).join("") + `<circle cx="${cx}" cy="${cy}" r="${r * 0.38}" fill="${center}"/>`;
const leaf = (x, y, rot, color = "#65a30d", s = 1) =>
  `<path d="M0 0 C ${6 * s} ${-8 * s} ${18 * s} ${-8 * s} ${24 * s} 0 C ${18 * s} ${8 * s} ${6 * s} ${8 * s} 0 0Z" fill="${color}" transform="translate(${x} ${y}) rotate(${rot})"/>`;
const heartPath = "M50 88 C 20 66 4 50 4 30 A 22 22 0 0 1 50 20 A 22 22 0 0 1 96 30 C 96 50 80 66 50 88Z";
const star = (cx, cy, r, color) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return `<polygon points="${pts}" fill="${color}"/>`;
};

const GOLD_DEF =
  '<defs><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e3a1"/><stop offset=".35" stop-color="#d4a843"/><stop offset=".6" stop-color="#fff0c2"/><stop offset="1" stop-color="#9c7424"/></linearGradient></defs>';
const G = "url(#gold)";
// One half of a symmetric scroll flourish in a 200x60 box (flip = 1 left, -1 right).
const scroll = (f = 1) => {
  const X = (d) => 100 - d * f;
  return `<path d="M100 30 C ${X(18)} 10 ${X(40)} 10 ${X(46)} 26 C ${X(50)} 38 ${X(36)} 44 ${X(30)} 34 C ${X(26)} 27 ${X(34)} 22 ${X(38)} 28 M${X(46)} 26 C ${X(60)} 50 ${X(84)} 44 ${X(96)} 30" fill="none" stroke="${G}" stroke-width="2.6" stroke-linecap="round"/>`;
};
const roundLeaf = (x, y, r, c = "#7f9a7a") => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;

const SVG_STICKERS = [
  // ---- Floral ----
  { id: "rose-pink", name: "Pink blossom", category: "floral", svg: S(flower(50, 50, 22, "#f472b6", "#fde047", 8)) },
  { id: "blossom-white", name: "White blossom", category: "floral", svg: S(flower(50, 50, 22, "#fff1f2", "#f59e0b", 5) + `<circle cx="50" cy="50" r="40" fill="none"/>`) },
  { id: "blossom-red", name: "Red flower", category: "floral", svg: S(flower(50, 50, 24, "#e11d48", "#fde68a", 6)) },
  { id: "marigold", name: "Marigold", category: "floral", svg: S(flower(50, 50, 26, "#f97316", "#f59e0b", 12) + flower(50, 50, 16, "#fb923c", "#ea580c", 10)) },
  {
    id: "flower-bunch",
    name: "Flower bunch",
    category: "floral",
    svg: S(leaf(30, 70, -150) + leaf(70, 70, -30) + leaf(50, 80, -90) + flower(35, 45, 14, "#f9a8d4") + flower(65, 45, 14, "#c4b5fd") + flower(50, 30, 14, "#fda4af", "#fde047")),
  },
  {
    id: "floral-corner",
    name: "Floral corner",
    category: "floral",
    svg: S(`<path d="M2 98 Q 2 2 98 2" stroke="#65a30d" stroke-width="3" fill="none"/>` + leaf(10, 70, -60) + leaf(25, 35, -40) + leaf(55, 12, -10) + flower(15, 50, 10, "#f472b6") + flower(40, 20, 9, "#fda4af") + flower(10, 88, 8, "#f9a8d4") + flower(80, 8, 7, "#fbcfe8")),
  },
  {
    id: "floral-swag",
    name: "Floral garland",
    category: "floral",
    svg: S(`<path d="M2 20 Q 100 70 198 20" stroke="#65a30d" stroke-width="3" fill="none"/>` + [20, 60, 100, 140, 180].map((x, i) => flower(x, 20 + Math.sin((x / 200) * Math.PI) * 25, 10, ["#f472b6", "#fda4af", "#f9a8d4", "#fda4af", "#f472b6"][i])).join(""), "0 0 200 60"),
  },
  { id: "leaf-sprig", name: "Leaf sprig", category: "floral", svg: S(`<path d="M50 95 L50 10" stroke="#4d7c0f" stroke-width="3"/>` + [20, 38, 56, 74].map((y) => leaf(50, y, -140, "#65a30d", 1.2) + leaf(50, y, -40, "#84cc16", 1.2)).join("")) },
  { id: "tulip", name: "Tulip", category: "floral", svg: S(`<path d="M50 95 L50 50" stroke="#4d7c0f" stroke-width="4"/>${leaf(50, 80, -130, "#65a30d", 1.3)}<path d="M30 30 Q30 60 50 60 Q70 60 70 30 L60 42 L50 25 L40 42Z" fill="#ec4899"/>`) },
  { id: "lotus", name: "Lotus", category: "floral", svg: S(`<path d="M50 80 Q30 50 50 20 Q70 50 50 80Z" fill="#f9a8d4"/><path d="M50 80 Q15 65 18 38 Q42 50 50 80Z" fill="#f472b6"/><path d="M50 80 Q85 65 82 38 Q58 50 50 80Z" fill="#f472b6"/><path d="M20 82 Q50 92 80 82" stroke="#0d9488" stroke-width="4" fill="none"/>`) },
  // ---- Love ----
  { id: "heart-red", name: "Red heart", category: "love", svg: S(`<path d="${heartPath}" fill="#e11d48"/><ellipse cx="30" cy="32" rx="8" ry="5" fill="#fff" opacity=".35" transform="rotate(-30 30 32)"/>`) },
  { id: "heart-pink", name: "Pink heart", category: "love", svg: S(`<path d="${heartPath}" fill="#f472b6"/><ellipse cx="30" cy="32" rx="8" ry="5" fill="#fff" opacity=".35" transform="rotate(-30 30 32)"/>`) },
  { id: "heart-gold", name: "Gold heart", category: "love", svg: S(`<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fde68a"/><stop offset="1" stop-color="#b45309"/></linearGradient></defs><path d="${heartPath}" fill="url(#g)"/>`) },
  { id: "heart-outline", name: "Heart outline", category: "love", svg: S(`<path d="${heartPath}" fill="none" stroke="#be185d" stroke-width="5"/>`) },
  { id: "two-hearts", name: "Two hearts", category: "love", svg: S(`<g transform="translate(-8 4) scale(.7)"><path d="${heartPath}" fill="#f472b6"/></g><g transform="translate(38 20) scale(.62)"><path d="${heartPath}" fill="#e11d48"/></g>`) },
  { id: "heart-arrow", name: "Cupid arrow", category: "love", svg: S(`<g transform="translate(12 10) scale(.76)"><path d="${heartPath}" fill="#e11d48"/></g><path d="M8 82 L92 18" stroke="#92400e" stroke-width="4"/><path d="M92 18 L80 20 L88 30Z" fill="#92400e"/><path d="M8 82 L4 74 M8 82 L16 86" stroke="#f59e0b" stroke-width="4"/>`) },
  // ---- Wedding ----
  { id: "rings", name: "Wedding rings", category: "wedding", svg: S(`<circle cx="38" cy="58" r="22" fill="none" stroke="#d4a017" stroke-width="7"/><circle cx="62" cy="58" r="22" fill="none" stroke="#eab308" stroke-width="7"/><path d="M56 30 L62 20 L68 30 L62 36Z" fill="#a5f3fc" stroke="#67e8f9"/>`) },
  { id: "diamond-ring", name: "Diamond ring", category: "wedding", svg: S(`<circle cx="50" cy="64" r="26" fill="none" stroke="#d4a017" stroke-width="7"/><path d="M36 30 L44 18 L56 18 L64 30 L50 44Z" fill="#cffafe" stroke="#22d3ee" stroke-width="2"/><path d="M36 30 L64 30 M44 18 L50 30 L56 18" stroke="#22d3ee" stroke-width="1.5" fill="none"/>`) },
  { id: "dove", name: "Dove", category: "wedding", svg: S(`<path d="M20 60 Q30 35 55 40 Q70 20 88 22 Q75 35 72 48 Q78 60 60 70 Q40 78 20 60Z" fill="#fff" stroke="#cbd5e1" stroke-width="2"/><path d="M55 40 Q45 20 30 18 Q38 35 48 46Z" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/><circle cx="76" cy="30" r="2" fill="#334155"/><path d="M86 26 L94 28 L86 31Z" fill="#f59e0b"/>`) },
  { id: "wedding-cake", name: "Wedding cake", category: "wedding", svg: S(`<rect x="22" y="62" width="56" height="26" rx="4" fill="#fdf2f8" stroke="#f9a8d4" stroke-width="2"/><rect x="30" y="40" width="40" height="22" rx="4" fill="#fdf2f8" stroke="#f9a8d4" stroke-width="2"/><rect x="38" y="22" width="24" height="18" rx="4" fill="#fdf2f8" stroke="#f9a8d4" stroke-width="2"/><path d="M22 70 Q36 78 50 70 Q64 78 78 70 M30 48 Q40 54 50 48 Q60 54 70 48" stroke="#f472b6" stroke-width="2" fill="none"/><g transform="translate(40 4) scale(.2)"><path d="${heartPath}" fill="#e11d48"/></g>`) },
  { id: "champagne", name: "Champagne toast", category: "wedding", svg: S(`<path d="M28 15 L44 15 L40 45 Q36 52 36 60 L36 82 M28 86 L44 86" stroke="#a16207" stroke-width="3" fill="#fef3c7" transform="rotate(-12 36 50)"/><path d="M56 15 L72 15 L68 45 Q64 52 64 60 L64 82 M56 86 L72 86" stroke="#a16207" stroke-width="3" fill="#fef3c7" transform="rotate(12 64 50)"/>${star(50, 10, 6, "#fbbf24")}`) },
  { id: "bow", name: "Bow ribbon", category: "wedding", svg: S(`<path d="M50 50 Q20 20 10 40 Q8 60 50 50Z M50 50 Q80 20 90 40 Q92 60 50 50Z" fill="#f472b6" stroke="#be185d" stroke-width="2"/><path d="M50 50 L35 88 L44 84 L50 92 L52 52 M50 50 L65 88 L56 84" fill="#f472b6" stroke="#be185d" stroke-width="2"/><circle cx="50" cy="50" r="7" fill="#be185d"/>`) },
  // ---- Islamic / Eastern ----
  { id: "crescent", name: "Crescent & star", category: "islamic", svg: S(`<path d="M60 12 A40 40 0 1 0 60 88 A32 32 0 1 1 60 12Z" fill="#d4a017"/>${star(70, 40, 12, "#d4a017")}`) },
  { id: "lantern", name: "Lantern", category: "islamic", svg: S(`<path d="M50 4 L50 14" stroke="#a16207" stroke-width="3"/><path d="M38 14 L62 14 L66 24 L34 24Z" fill="#d4a017"/><path d="M34 24 Q24 50 38 80 L62 80 Q76 50 66 24Z" fill="#fde68a" stroke="#d4a017" stroke-width="3"/><path d="M50 24 L50 80 M40 26 Q34 52 42 78 M60 26 Q66 52 58 78" stroke="#d4a017" stroke-width="2" fill="none"/><path d="M38 80 L62 80 L56 92 L44 92Z" fill="#d4a017"/>`) },
  { id: "mosque", name: "Mosque", category: "islamic", svg: S(`<path d="M30 60 Q30 30 50 22 Q70 30 70 60Z" fill="#047857"/><rect x="24" y="60" width="52" height="30" fill="#065f46"/><rect x="10" y="30" width="8" height="60" fill="#047857"/><rect x="82" y="30" width="8" height="60" fill="#047857"/><path d="M10 30 L14 18 L18 30 M82 30 L86 18 L90 30" fill="#d4a017"/><path d="M44 90 L44 74 Q50 66 56 74 L56 90Z" fill="#d4a017"/><path d="M50 22 L50 12" stroke="#d4a017" stroke-width="2"/><circle cx="50" cy="10" r="3" fill="#d4a017"/>`) },
  { id: "arch", name: "Mughal arch", category: "islamic", svg: S(`<path d="M10 98 L10 45 Q10 20 50 4 Q90 20 90 45 L90 98" fill="none" stroke="#d4a017" stroke-width="4"/><path d="M20 98 L20 48 Q20 28 50 14 Q80 28 80 48 L80 98" fill="none" stroke="#d4a017" stroke-width="2"/>`) },
  { id: "mandala", name: "Mandala", category: "islamic", svg: S(Array.from({ length: 12 }, (_, i) => `<ellipse cx="50" cy="22" rx="7" ry="18" fill="none" stroke="#c2410c" stroke-width="2" transform="rotate(${i * 30} 50 50)"/>`).join("") + Array.from({ length: 8 }, (_, i) => `<circle cx="50" cy="30" r="5" fill="#f59e0b" transform="rotate(${i * 45} 50 50)"/>`).join("") + `<circle cx="50" cy="50" r="10" fill="#c2410c"/><circle cx="50" cy="50" r="4" fill="#fde68a"/>`) },
  { id: "bismillah", name: "Bismillah", category: "islamic", svg: S(`<text x="100" y="42" text-anchor="middle" font-family="Amiri, 'Noto Naskh Arabic', serif" font-size="30" fill="#047857">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</text>`, "0 0 200 60") },
  { id: "mehndi-hand", name: "Mehndi hand", category: "islamic", svg: S(`<path d="M30 95 L30 55 Q22 50 22 40 L22 28 Q22 22 27 22 Q32 22 32 28 L32 40 L34 14 Q34 8 39 8 Q44 8 44 14 L44 38 L46 10 Q46 4 51 4 Q56 4 56 10 L56 38 L58 16 Q58 10 63 10 Q68 10 68 16 L68 50 Q76 40 82 44 Q86 48 80 56 L66 80 L66 95Z" fill="#fde7d3" stroke="#9a3412" stroke-width="2"/><circle cx="48" cy="62" r="9" fill="none" stroke="#9a3412" stroke-width="2"/><circle cx="48" cy="62" r="3" fill="#9a3412"/><path d="M39 22 L39 32 M51 18 L51 30 M63 24 L63 34" stroke="#9a3412" stroke-width="2" stroke-dasharray="2 3"/>`) },
  { id: "diya", name: "Diya lamp", category: "islamic", svg: S(`<path d="M15 60 Q50 95 85 60Z" fill="#c2410c"/><path d="M15 60 L85 60" stroke="#9a3412" stroke-width="3"/><path d="M50 58 Q38 40 50 18 Q62 40 50 58Z" fill="#f59e0b"/><path d="M50 55 Q44 44 50 32 Q56 44 50 55Z" fill="#fde047"/>`) },
  // ---- Party & birthday ----
  { id: "balloons", name: "Balloons", category: "party", svg: S(`<path d="M30 55 Q35 75 50 95 M70 52 Q62 75 50 95 M50 45 L50 95" stroke="#64748b" stroke-width="1.5" fill="none"/><ellipse cx="30" cy="32" rx="16" ry="20" fill="#f43f5e"/><ellipse cx="70" cy="30" rx="16" ry="20" fill="#3b82f6"/><ellipse cx="50" cy="24" rx="16" ry="20" fill="#facc15"/><ellipse cx="45" cy="16" rx="4" ry="6" fill="#fff" opacity=".5"/>`) },
  { id: "balloon-heart", name: "Heart balloon", category: "party", svg: S(`<g transform="translate(15 0) scale(.7)"><path d="${heartPath}" fill="#ec4899"/></g><path d="M50 62 Q44 80 52 98" stroke="#64748b" stroke-width="1.5" fill="none"/>`) },
  { id: "party-hat", name: "Party hat", category: "party", svg: S(`<path d="M50 8 L80 88 L20 88Z" fill="#8b5cf6"/><path d="M38 40 L62 40 M30 62 L70 62" stroke="#facc15" stroke-width="6"/><circle cx="50" cy="8" r="7" fill="#f43f5e"/><path d="M16 88 Q50 98 84 88" stroke="#f472b6" stroke-width="6" fill="none"/>`) },
  { id: "birthday-cake", name: "Birthday cake", category: "party", svg: S(`<rect x="18" y="50" width="64" height="38" rx="6" fill="#fbcfe8"/><path d="M18 58 Q26 68 34 58 Q42 68 50 58 Q58 68 66 58 Q74 68 82 58 L82 50 L18 50Z" fill="#fff"/><rect x="30" y="30" width="5" height="20" fill="#38bdf8"/><rect x="48" y="30" width="5" height="20" fill="#facc15"/><rect x="66" y="30" width="5" height="20" fill="#a78bfa"/><path d="M32 30 Q28 22 32 16 Q36 22 32 30 M50 30 Q46 22 50 16 Q54 22 50 30 M68 30 Q64 22 68 16 Q72 22 68 30" fill="#f97316"/><rect x="12" y="86" width="76" height="6" rx="3" fill="#e5e7eb"/>`) },
  { id: "gift", name: "Gift box", category: "party", svg: S(`<rect x="16" y="40" width="68" height="50" rx="4" fill="#ec4899"/><rect x="12" y="30" width="76" height="14" rx="3" fill="#f472b6"/><rect x="45" y="30" width="10" height="60" fill="#facc15"/><path d="M50 30 Q30 8 24 20 Q22 30 50 30 Q70 8 76 20 Q78 30 50 30Z" fill="none" stroke="#facc15" stroke-width="5"/>`) },
  { id: "confetti", name: "Confetti", category: "party", svg: S(["#f43f5e", "#3b82f6", "#facc15", "#22c55e", "#a855f7", "#f97316"].flatMap((c, i) => [`<rect x="${10 + i * 14}" y="${10 + ((i * 37) % 70)}" width="7" height="12" fill="${c}" transform="rotate(${i * 40} ${14 + i * 14} ${16 + ((i * 37) % 70)})"/>`, `<circle cx="${18 + ((i * 29) % 70)}" cy="${30 + ((i * 23) % 60)}" r="4" fill="${c}"/>`]).join("")) },
  { id: "party-popper", name: "Party popper", category: "party", svg: S(`<path d="M10 90 L40 40 L60 60Z" fill="#f59e0b"/><path d="M22 70 L44 76 M30 56 L52 66" stroke="#f43f5e" stroke-width="4"/><path d="M60 30 Q70 20 66 8 M70 44 Q84 40 92 28 M48 22 Q48 12 40 6" stroke="#8b5cf6" stroke-width="3" fill="none"/>${star(82, 12, 6, "#facc15")}<circle cx="88" cy="54" r="4" fill="#22c55e"/><circle cx="30" cy="16" r="4" fill="#3b82f6"/>`) },
  { id: "teddy", name: "Teddy bear", category: "baby", svg: S(`<circle cx="26" cy="22" r="11" fill="#a16207"/><circle cx="74" cy="22" r="11" fill="#a16207"/><circle cx="50" cy="40" r="26" fill="#ca8a04"/><ellipse cx="50" cy="50" rx="11" ry="8" fill="#fde68a"/><circle cx="40" cy="36" r="3" fill="#1f2937"/><circle cx="60" cy="36" r="3" fill="#1f2937"/><ellipse cx="50" cy="46" rx="4" ry="3" fill="#1f2937"/><ellipse cx="50" cy="80" rx="24" ry="18" fill="#ca8a04"/><ellipse cx="50" cy="82" rx="12" ry="10" fill="#fde68a"/>`) },
  { id: "baby-bottle", name: "Baby bottle", category: "baby", svg: S(`<path d="M44 6 Q50 0 56 6 L58 18 L42 18Z" fill="#fbcfe8"/><rect x="36" y="18" width="28" height="8" rx="2" fill="#38bdf8"/><rect x="32" y="26" width="36" height="66" rx="10" fill="#e0f2fe" stroke="#38bdf8" stroke-width="3"/><path d="M40 44 L50 44 M40 58 L50 58 M40 72 L50 72" stroke="#38bdf8" stroke-width="3"/>`) },
  { id: "graduation-cap", name: "Graduation cap", category: "party", svg: S(`<path d="M50 20 L95 40 L50 60 L5 40Z" fill="#1f2937"/><path d="M25 50 L25 70 Q50 84 75 70 L75 50 L50 60Z" fill="#374151"/><path d="M50 40 L85 50 L85 76" stroke="#facc15" stroke-width="3" fill="none"/><circle cx="85" cy="80" r="5" fill="#facc15"/>`) },
  // ---- Celestial & decor ----
  { id: "star-gold", name: "Gold star", category: "decor", svg: S(star(50, 52, 44, "#facc15")) },
  { id: "sparkles", name: "Sparkles", category: "decor", svg: S(`<path d="M40 10 Q44 40 70 44 Q44 48 40 78 Q36 48 10 44 Q36 40 40 10Z" fill="#facc15"/><path d="M78 56 Q80 70 92 72 Q80 74 78 88 Q76 74 64 72 Q76 70 78 56Z" fill="#fde68a"/><path d="M80 8 Q81 18 90 19 Q81 20 80 30 Q79 20 70 19 Q79 18 80 8Z" fill="#fde68a"/>`) },
  { id: "moon", name: "Moon & stars", category: "decor", svg: S(`<path d="M55 10 A40 40 0 1 0 90 62 A32 32 0 0 1 55 10Z" fill="#fde68a"/>${star(80, 22, 8, "#facc15")}${star(70, 82, 5, "#facc15")}`) },
  { id: "butterfly", name: "Butterfly", category: "decor", svg: S(`<path d="M50 50 Q20 5 8 30 Q4 50 50 50Z" fill="#a78bfa"/><path d="M50 50 Q80 5 92 30 Q96 50 50 50Z" fill="#c4b5fd"/><path d="M50 52 Q24 90 14 72 Q10 58 50 52Z" fill="#f472b6"/><path d="M50 52 Q76 90 86 72 Q90 58 50 52Z" fill="#f9a8d4"/><rect x="47" y="30" width="6" height="44" rx="3" fill="#4c1d95"/><path d="M48 30 Q42 18 36 16 M52 30 Q58 18 64 16" stroke="#4c1d95" stroke-width="2" fill="none"/>`) },
  { id: "divider-ornate", name: "Ornate divider", category: "decor", svg: S(`<path d="M5 30 L80 30 M120 30 L195 30" stroke="#a16207" stroke-width="2"/><path d="M80 30 Q90 10 100 30 Q110 50 120 30 Q110 10 100 30 Q90 50 80 30Z" fill="none" stroke="#a16207" stroke-width="2"/><circle cx="100" cy="30" r="5" fill="#a16207"/><circle cx="60" cy="30" r="3" fill="#a16207"/><circle cx="140" cy="30" r="3" fill="#a16207"/>`, "0 0 200 60") },
  { id: "divider-hearts", name: "Hearts divider", category: "decor", svg: S(`<path d="M5 30 L80 30 M120 30 L195 30" stroke="#be185d" stroke-width="2"/><g transform="translate(86 14) scale(.28)"><path d="${heartPath}" fill="#be185d"/></g>`, "0 0 200 60") },
  { id: "frame-circle", name: "Floral ring frame", category: "decor", svg: S(`<circle cx="50" cy="50" r="40" fill="none" stroke="#d4a017" stroke-width="2"/>` + flower(22, 22, 8, "#f472b6") + flower(78, 78, 8, "#f9a8d4") + leaf(30, 14, 10) + leaf(14, 32, 80) + leaf(70, 86, 190) + leaf(86, 68, 260)) },
  { id: "frame-gold", name: "Gold frame", category: "decor", svg: S(`<rect x="6" y="6" width="88" height="88" rx="4" fill="none" stroke="#d4a017" stroke-width="3"/><rect x="12" y="12" width="76" height="76" fill="none" stroke="#d4a017" stroke-width="1"/>${[["6", "6"], ["94", "6"], ["6", "94"], ["94", "94"]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#d4a017"/>`).join("")}`) },
  { id: "bunting", name: "Bunting flags", category: "decor", svg: S(`<path d="M2 8 Q100 30 198 8" stroke="#64748b" stroke-width="2" fill="none"/>` + ["#f43f5e", "#facc15", "#3b82f6", "#22c55e", "#a855f7", "#f97316", "#ec4899"].map((c, i) => { const x = 14 + i * 28; const y = 8 + Math.sin(((x - 2) / 196) * Math.PI) * 12; return `<path d="M${x - 10} ${y} L${x + 10} ${y} L${x} ${y + 24}Z" fill="${c}"/>`; }).join(""), "0 0 200 50") },
  // ---- Gold ornaments ----
  { id: "gold-flourish", name: "Gold flourish", category: "gold", svg: S(GOLD_DEF + scroll(1) + scroll(-1) + `<circle cx="100" cy="30" r="4" fill="${G}"/><path d="M92 30 L100 22 L108 30 L100 38Z" fill="${G}"/>`, "0 0 200 60") },
  { id: "gold-corner", name: "Gold corner", category: "gold", svg: S(GOLD_DEF + `<path d="M6 94 L6 30 Q6 6 30 6 L94 6" fill="none" stroke="${G}" stroke-width="3"/><path d="M14 94 L14 34 Q14 14 34 14 L94 14" fill="none" stroke="${G}" stroke-width="1.2"/><path d="M6 30 C 20 32 30 24 30 6" fill="none" stroke="${G}" stroke-width="2"/><circle cx="22" cy="22" r="4" fill="${G}"/><path d="M40 6 q6 -4 12 0 M6 40 q-4 6 0 12" stroke="${G}" stroke-width="2" fill="none"/>`) },
  {
    id: "laurel-wreath",
    name: "Laurel wreath",
    category: "gold",
    svg: S(
      GOLD_DEF +
        Array.from({ length: 9 }, (_, i) => {
          const a = Math.PI * (0.62 + i * 0.1);
          const x = (50 + 36 * Math.cos(a)).toFixed(1);
          const y = (50 + 36 * Math.sin(a)).toFixed(1);
          const deg = ((a * 180) / Math.PI + 30).toFixed(0);
          return `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="8" fill="${G}" transform="rotate(${deg} ${x} ${y})"/><ellipse cx="${(100 - x).toFixed(1)}" cy="${y}" rx="3.6" ry="8" fill="${G}" transform="rotate(${-deg} ${(100 - x).toFixed(1)} ${y})"/>`;
        }).join("") +
        `<path d="M22 72 Q50 98 78 72" fill="none" stroke="${G}" stroke-width="2"/>`
    ),
  },
  { id: "gold-arch", name: "Gold arch frame", category: "gold", svg: S(GOLD_DEF + `<path d="M12 98 L12 42 Q12 4 50 4 Q88 4 88 42 L88 98" fill="none" stroke="${G}" stroke-width="3"/><path d="M18 98 L18 44 Q18 11 50 11 Q82 11 82 44 L82 98" fill="none" stroke="${G}" stroke-width="1"/><circle cx="50" cy="4" r="3.5" fill="${G}"/>`) },
  { id: "gold-crown", name: "Gold crown", category: "gold", svg: S(GOLD_DEF + `<path d="M14 74 L8 30 L32 50 L50 20 L68 50 L92 30 L86 74Z" fill="${G}"/><rect x="14" y="76" width="72" height="10" rx="3" fill="${G}"/><circle cx="8" cy="28" r="5" fill="${G}"/><circle cx="50" cy="18" r="5" fill="${G}"/><circle cx="92" cy="28" r="5" fill="${G}"/><circle cx="50" cy="58" r="5" fill="#b91c3c"/><circle cx="30" cy="62" r="3.5" fill="#1d4ed8"/><circle cx="70" cy="62" r="3.5" fill="#047857"/>`) },
  { id: "gold-oval-frame", name: "Monogram frame", category: "gold", svg: S(GOLD_DEF + `<ellipse cx="50" cy="50" rx="34" ry="44" fill="none" stroke="${G}" stroke-width="2.5"/><ellipse cx="50" cy="50" rx="29" ry="39" fill="none" stroke="${G}" stroke-width="0.8" stroke-dasharray="1 3"/>` + [[50, 6], [84, 50], [50, 94], [16, 50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${G}"/>`).join("")) },
  { id: "gold-sparkle", name: "Gold sparkle", category: "gold", svg: S(GOLD_DEF + `<path d="M50 4 Q54 44 96 50 Q54 56 50 96 Q46 56 4 50 Q46 44 50 4Z" fill="${G}"/><path d="M82 10 Q83 18 90 19 Q83 20 82 28 Q81 20 74 19 Q81 18 82 10Z" fill="${G}"/>`) },
  { id: "gold-divider-dots", name: "Gold dot divider", category: "gold", svg: S(GOLD_DEF + `<path d="M10 30 L80 30 M120 30 L190 30" stroke="${G}" stroke-width="1.5"/><path d="M88 30 L100 18 L112 30 L100 42Z" fill="none" stroke="${G}" stroke-width="2"/><circle cx="100" cy="30" r="4" fill="${G}"/><circle cx="84" cy="30" r="2" fill="${G}"/><circle cx="116" cy="30" r="2" fill="${G}"/>`, "0 0 200 60") },
  // ---- More florals ----
  {
    id: "peony",
    name: "Peony",
    category: "floral",
    svg: S(
      `<g fill="#f4b6c2">${Array.from({ length: 8 }, (_, i) => `<ellipse cx="50" cy="30" rx="14" ry="22" transform="rotate(${i * 45} 50 50)"/>`).join("")}</g>` +
        `<g fill="#ec8fa4">${Array.from({ length: 6 }, (_, i) => `<ellipse cx="50" cy="38" rx="10" ry="14" transform="rotate(${i * 60 + 20} 50 50)"/>`).join("")}</g>` +
        `<circle cx="50" cy="50" r="9" fill="#d96c86"/><circle cx="50" cy="50" r="4" fill="#f6d77a"/>`
    ),
  },
  { id: "rose-line", name: "Line-art rose", category: "floral", svg: S(`<g fill="none" stroke="#9f2f45" stroke-width="2.2" stroke-linecap="round"><path d="M50 40 q-6 -6 0 -10 q8 -2 8 6 q0 10 -12 10 q-12 0 -12 -14 q2 -14 16 -14 q18 0 18 18 q0 18 -20 18 q-18 0 -22 -14"/><path d="M48 60 L48 96" stroke="#4f5d3a"/></g>` + leaf(48, 80, -150, "#6b7f4f", 1) + leaf(48, 72, -30, "#6b7f4f", 1)) },
  { id: "eucalyptus", name: "Eucalyptus", category: "floral", svg: S(`<path d="M20 95 Q50 50 78 6" stroke="#5f7466" stroke-width="2" fill="none"/>` + [[28, 82, 7], [38, 68, 8], [30, 60, 6], [48, 54, 8], [42, 42, 6], [58, 38, 7], [52, 26, 6], [68, 22, 6], [74, 10, 5], [22, 72, 5]].map(([x, y, r]) => roundLeaf(x, y, r, "#9bb3a1")).join("")) },
  { id: "olive-branch", name: "Olive branch", category: "floral", svg: S(`<path d="M10 80 Q50 60 92 20" stroke="#5b6b3a" stroke-width="2" fill="none"/>` + [[20, 75, -20], [32, 68, 30], [42, 62, -30], [52, 54, 25], [62, 46, -35], [70, 38, 20], [80, 30, -30]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="3.4" fill="#7d8f55" transform="rotate(${r - 30} ${x} ${y})"/>`).join("") + `<circle cx="48" cy="66" r="3.4" fill="#3b4a2a"/><circle cx="68" cy="48" r="3" fill="#3b4a2a"/>`) },
  { id: "babys-breath", name: "Baby's breath", category: "floral", svg: S(`<g stroke="#8aa07a" stroke-width="1.2" fill="none"><path d="M50 98 L50 50 L30 22 M50 60 L72 30 M50 50 L54 14 M40 36 L22 40 M64 42 L84 46"/></g>` + [[30, 22], [72, 30], [54, 14], [22, 40], [84, 46], [36, 28], [62, 22], [26, 30], [78, 38], [46, 18], [58, 30]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#ffffff" stroke="#e5e7eb"/>`).join("")) },
  { id: "wisteria", name: "Hanging wisteria", category: "floral", svg: S(`<path d="M5 6 Q50 16 95 6" stroke="#6b7f4f" stroke-width="2" fill="none"/>` + [15, 35, 55, 75, 90].map((x, i) => Array.from({ length: 6 }, (_, k) => `<circle cx="${(x + Math.sin(k) * 2).toFixed(1)}" cy="${14 + k * 7 + i * 2}" r="${(4.2 - k * 0.5).toFixed(1)}" fill="${i % 2 ? "#b79ad6" : "#c9b2e6"}"/>`).join("")).join("")) },
  { id: "rose-bud", name: "Rose bud", category: "floral", svg: S(`<path d="M50 96 L50 52" stroke="#4d7c0f" stroke-width="3"/>` + leaf(50, 78, -140, "#65a30d", 1.1) + leaf(50, 70, -40, "#65a30d", 1) + `<path d="M36 40 Q36 18 50 12 Q64 18 64 40 Q57 54 50 54 Q43 54 36 40Z" fill="#c2213f"/><path d="M50 12 Q44 30 50 54 M36 40 Q48 34 64 40" stroke="#8f1630" stroke-width="1.5" fill="none"/><path d="M38 46 L32 54 L44 52 M62 46 L68 54 L56 52" fill="#4d7c0f"/>`) },
  // ---- Desi & wedding ----
  {
    id: "hanging-lanterns",
    name: "Hanging lanterns",
    category: "islamic",
    svg: S(
      GOLD_DEF +
        [[25, 30], [50, 50], [75, 24]]
          .map(
            ([x, l]) =>
              `<path d="M${x} 0 L${x} ${l}" stroke="${G}" stroke-width="1.2"/><path d="M${x - 6} ${l} L${x + 6} ${l} L${x + 9} ${l + 6} L${x - 9} ${l + 6}Z" fill="${G}"/><path d="M${x - 9} ${l + 6} Q${x - 13} ${l + 20} ${x - 6} ${l + 32} L${x + 6} ${l + 32} Q${x + 13} ${l + 20} ${x + 9} ${l + 6}Z" fill="#fde68a" stroke="${G}" stroke-width="1.5"/><path d="M${x - 6} ${l + 32} L${x + 6} ${l + 32} L${x} ${l + 38}Z" fill="${G}"/>`
          )
          .join("")
    ),
  },
  { id: "paisley", name: "Paisley", category: "islamic", svg: S(`<path d="M50 92 C 18 92 10 60 26 42 C 40 26 70 30 70 12 C 86 30 88 92 50 92Z" fill="#9f1d35"/><path d="M50 82 C 28 82 22 60 34 48 C 44 38 64 40 68 28 C 76 46 74 82 50 82Z" fill="#d9a441"/><circle cx="48" cy="62" r="8" fill="#9f1d35"/><circle cx="48" cy="62" r="3" fill="#fde68a"/>` + Array.from({ length: 7 }, (_, i) => `<circle cx="${30 + i * 5}" cy="${(76 - Math.sin(i / 2) * 6).toFixed(1)}" r="1.6" fill="#fff7ed"/>`).join("")) },
  { id: "jhumka", name: "Jhumka earring", category: "islamic", svg: S(GOLD_DEF + `<circle cx="50" cy="12" r="7" fill="none" stroke="${G}" stroke-width="3"/><circle cx="50" cy="30" r="9" fill="${G}"/><circle cx="50" cy="30" r="4" fill="#be123c"/><path d="M28 70 Q28 42 50 40 Q72 42 72 70Z" fill="${G}"/><path d="M28 70 L72 70" stroke="#9c7424" stroke-width="2"/>` + Array.from({ length: 9 }, (_, i) => `<line x1="${30 + i * 5}" y1="70" x2="${30 + i * 5}" y2="82" stroke="${G}" stroke-width="1.4"/><circle cx="${30 + i * 5}" cy="84" r="2.2" fill="${i % 2 ? "#be123c" : "#fff7ed"}"/>`).join("")) },
  { id: "toran", name: "Marigold toran", category: "islamic", svg: S(`<path d="M0 8 L200 8" stroke="#166534" stroke-width="3"/>` + Array.from({ length: 9 }, (_, i) => { const x = 12 + i * 22; return Array.from({ length: i % 2 ? 4 : 3 }, (_, k) => flower(x, 16 + k * 11, 5, k % 2 ? "#facc15" : "#f97316", "#c2410c", 8)).join("") + leaf(x - 2, 10, 30, "#16a34a", 0.6); }).join(""), "0 0 200 60") },
  { id: "dove-pair", name: "Pair of doves", category: "wedding", svg: S(`<g transform="translate(-6 6) scale(.62)"><path d="M20 60 Q30 35 55 40 Q70 20 88 22 Q75 35 72 48 Q78 60 60 70 Q40 78 20 60Z" fill="#fff" stroke="#cbd5e1" stroke-width="2"/><circle cx="76" cy="30" r="2" fill="#334155"/><path d="M86 26 L94 28 L86 31Z" fill="#f59e0b"/></g><g transform="translate(106 18) scale(-.62 .62)"><path d="M20 60 Q30 35 55 40 Q70 20 88 22 Q75 35 72 48 Q78 60 60 70 Q40 78 20 60Z" fill="#fff" stroke="#cbd5e1" stroke-width="2"/><circle cx="76" cy="30" r="2" fill="#334155"/><path d="M86 26 L94 28 L86 31Z" fill="#f59e0b"/></g><g transform="translate(40 10) scale(.2)"><path d="${heartPath}" fill="#e11d48"/></g>`) },
  { id: "love-letter", name: "Love letter", category: "love", svg: S(`<rect x="10" y="26" width="80" height="54" rx="5" fill="#fdf2f8" stroke="#be185d" stroke-width="2"/><path d="M10 30 L50 58 L90 30" fill="none" stroke="#be185d" stroke-width="2"/><g transform="translate(38 46) scale(.24)"><path d="${heartPath}" fill="#e11d48"/></g>`) },
  { id: "heart-wreath", name: "Heart wreath", category: "love", svg: S(`<path d="${heartPath}" fill="none" stroke="#7f9a7a" stroke-width="2"/>` + [[22, 22], [12, 38], [16, 56], [30, 70], [78, 22], [88, 38], [84, 56], [70, 70], [50, 84]].map(([x, y], i) => flower(x, y, 5, i % 2 ? "#f9a8d4" : "#fda4af", "#fde68a", 6)).join("")) },
  // ---- Baby ----
  { id: "rattle", name: "Rattle", category: "baby", svg: S(`<circle cx="38" cy="38" r="24" fill="#bae6fd" stroke="#38bdf8" stroke-width="3"/><circle cx="30" cy="30" r="5" fill="#fff"/><path d="M54 54 L84 84" stroke="#f9a8d4" stroke-width="9" stroke-linecap="round"/><circle cx="86" cy="86" r="8" fill="#f472b6"/><path d="M22 40 Q38 50 54 36" stroke="#0284c7" stroke-width="2" fill="none"/>`) },
  { id: "baby-feet", name: "Baby feet", category: "baby", svg: S([[30, 0], [64, 14]].map(([x, dy]) => `<ellipse cx="${x}" cy="${58 + dy}" rx="12" ry="20" fill="#f9a8d4"/>` + [0, 1, 2, 3, 4].map((k) => `<circle cx="${x - 10 + k * 5}" cy="${32 + dy + Math.abs(2 - k) * 1.5}" r="${(3.6 - k * 0.3).toFixed(1)}" fill="#f9a8d4"/>`).join("")).join("")) },
  { id: "onesie", name: "Onesie", category: "baby", svg: S(`<path d="M30 10 Q50 22 70 10 L92 26 L80 42 L72 36 L72 70 Q72 80 62 84 L58 94 L42 94 L38 84 Q28 80 28 70 L28 36 L20 42 L8 26Z" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2.5"/><g transform="translate(40 40) scale(.2)"><path d="${heartPath}" fill="#f472b6"/></g>`) },
  { id: "bundle-of-joy", name: "Bundle of joy", category: "baby", svg: S(`<path d="M20 30 Q50 10 80 30 L70 80 Q50 92 30 80Z" fill="#fce7f3" stroke="#f472b6" stroke-width="2.5"/><circle cx="50" cy="38" r="12" fill="#fde7d3"/><path d="M44 40 q2 2 4 0 M52 40 q2 2 4 0" stroke="#7c2d12" stroke-width="1.5" fill="none"/><path d="M30 56 Q50 66 70 56" stroke="#f472b6" stroke-width="2" fill="none"/>`) },
  // ---- Party ----
  { id: "disco-ball", name: "Disco ball", category: "party", svg: S(`<path d="M50 0 L50 18" stroke="#64748b" stroke-width="2"/><circle cx="50" cy="56" r="36" fill="#cbd5e1"/>` + Array.from({ length: 6 }, (_, r) => Array.from({ length: 6 }, (_, k) => `<rect x="${22 + k * 9.5}" y="${28 + r * 9.5}" width="8" height="8" fill="${(r + k) % 3 ? "#e2e8f0" : "#94a3b8"}" opacity=".9"/>`).join("")).join("") + `<circle cx="50" cy="56" r="36" fill="none" stroke="#64748b" stroke-width="2"/><path d="M34 34 l4 -8 l4 8 l-4 8z" fill="#fff"/>`) },
  { id: "champagne-bottle", name: "Champagne bottle", category: "party", svg: S(`<path d="M42 4 L58 4 L58 26 Q72 38 72 56 L72 92 Q72 96 68 96 L32 96 Q28 96 28 92 L28 56 Q28 38 42 26Z" fill="#14532d"/><path d="M42 4 L58 4 L58 22 L42 22Z" fill="#d4a017"/><rect x="28" y="56" width="44" height="22" fill="#fef3c7"/><text x="50" y="71" text-anchor="middle" font-family="serif" font-size="8" fill="#92400e">CHEERS</text>` + star(84, 12, 6, "#facc15") + star(14, 22, 4, "#facc15")) },
];

export const STICKER_CATEGORIES = [
  { id: "gold", label: "Gold" },
  { id: "floral", label: "Floral" },
  { id: "love", label: "Love" },
  { id: "wedding", label: "Wedding" },
  { id: "islamic", label: "Desi & Islamic" },
  { id: "party", label: "Party" },
  { id: "baby", label: "Baby" },
  { id: "decor", label: "Decor & Frames" },
];

export const STICKERS = SVG_STICKERS.map((s) => ({ ...s, src: `data:image/svg+xml;utf8,${encodeURIComponent(s.svg)}` }));

const byId = Object.fromEntries(STICKERS.map((s) => [s.id, s]));
export const getSticker = (id) => byId[id];
