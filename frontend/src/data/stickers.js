// Sticker library. `svg` stickers are hand-made vector art (crisp at any size);
// `emoji` stickers use the device's colour emoji font.
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
  { id: "teddy", name: "Teddy bear", category: "party", svg: S(`<circle cx="26" cy="22" r="11" fill="#a16207"/><circle cx="74" cy="22" r="11" fill="#a16207"/><circle cx="50" cy="40" r="26" fill="#ca8a04"/><ellipse cx="50" cy="50" rx="11" ry="8" fill="#fde68a"/><circle cx="40" cy="36" r="3" fill="#1f2937"/><circle cx="60" cy="36" r="3" fill="#1f2937"/><ellipse cx="50" cy="46" rx="4" ry="3" fill="#1f2937"/><ellipse cx="50" cy="80" rx="24" ry="18" fill="#ca8a04"/><ellipse cx="50" cy="82" rx="12" ry="10" fill="#fde68a"/>`) },
  { id: "baby-bottle", name: "Baby bottle", category: "party", svg: S(`<path d="M44 6 Q50 0 56 6 L58 18 L42 18Z" fill="#fbcfe8"/><rect x="36" y="18" width="28" height="8" rx="2" fill="#38bdf8"/><rect x="32" y="26" width="36" height="66" rx="10" fill="#e0f2fe" stroke="#38bdf8" stroke-width="3"/><path d="M40 44 L50 44 M40 58 L50 58 M40 72 L50 72" stroke="#38bdf8" stroke-width="3"/>`) },
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
];

const EMOJI = {
  floral: "🌸🌺🌹🌷🌼🌻💐🪷🍃🌿",
  love: "❤️💖💕💞💗💝💘😍🥰💋",
  wedding: "💍👰🤵💒🥂🍾🎂🕊️👑💎",
  islamic: "🕌🌙⭐🤲📿🕋🪔🌟",
  party: "🎉🎊🎈🎁🎂🧁🍰🎵🎶🪩🥳🎀🍭🍕",
  decor: "✨💫⭐🌈🦋☀️🌙🔥🍀🕯️",
  baby: "👶🍼🧸🐣🦄🌈👣🚼",
};

export const STICKER_CATEGORIES = [
  { id: "floral", label: "Floral" },
  { id: "love", label: "Love" },
  { id: "wedding", label: "Wedding" },
  { id: "islamic", label: "Islamic & Desi" },
  { id: "party", label: "Party" },
  { id: "baby", label: "Baby" },
  { id: "decor", label: "Decor & Frames" },
];

const emojiStickers = Object.entries(EMOJI).flatMap(([category, str]) =>
  [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(str)].map(({ segment }, i) => ({
    id: `e-${category}-${i}`,
    name: segment,
    category,
    emoji: segment,
  }))
);

export const STICKERS = [...SVG_STICKERS.map((s) => ({ ...s, src: `data:image/svg+xml;utf8,${encodeURIComponent(s.svg)}` })), ...emojiStickers];

const byId = Object.fromEntries(STICKERS.map((s) => [s.id, s]));
export const getSticker = (id) => byId[id];
