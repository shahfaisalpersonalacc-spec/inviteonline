"use client";

import { useId } from "react";
import { mix, shade } from "@/lib/color";

// Soft, irregular wax-pool outline around (60,60): a few slow wobbles, smoothed into curves.
const BLOB = (() => {
  const n = 36;
  const pts = Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    const r = 52.5 + 1.9 * Math.sin(3 * t + 0.6) + 1.3 * Math.sin(5 * t + 2.1) + 0.9 * Math.sin(8 * t + 0.3);
    return [60 + r * Math.cos(t), 60 + r * Math.sin(t)];
  });
  const f = (v) => v.toFixed(2);
  // Catmull-Rom through the points, as cubic Béziers
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return `${d}Z`;
})();

// Beads around the stamped rim (rounded, so the server and browser render the same numbers)
const BEADS = Array.from({ length: 40 }, (_, i) => {
  const t = (i / 40) * Math.PI * 2;
  return [Math.round((60 + 33 * Math.cos(t)) * 100) / 100, Math.round((60 + 33 * Math.sin(t)) * 100) / 100];
});

const HEART = "M60 82 C44 71 37 63 37 52 C37 45 42 40 48.5 40 C53.5 40 57.5 43 60 47.5 C62.5 43 66.5 40 71.5 40 C78 40 83 45 83 52 C83 63 76 71 60 82Z";
const DOVE_WING = "M57 62 C53 52 46 43 36 38 C40 38 44 39 47 40 C44 37 42 35 40 33 C51 35 61 43 66 57Z";
const BUTTERFLY_HALF = "M58.6 57 C54 44 45 37 38 38 C32 39 31 47 35 52 C39 57 48 59 58.6 59.5Z M58.6 61.5 C51 61.5 44 64 42 70 C40.5 75.5 45.5 79 50.5 75.5 C54.5 72.5 57.5 67 58.6 63.5Z";
const LEAF = "M0 0 C3 -2.8 7.5 -2.8 10.5 0 C7.5 2.8 3 2.8 0 0Z";

// One laurel branch (left side, growing upwards); the right one is its mirror image.
// Each step has a pair of leaves angled forward along the stem, one either side.
const LAUREL = (() => {
  const leaves = [];
  for (let i = 0; i < 5; i++) {
    const a = Math.PI * (0.66 + i * 0.115);
    const x = 60 + 24.5 * Math.cos(a);
    const y = 59 + 24.5 * Math.sin(a);
    const deg = (a * 180) / Math.PI + 90;
    leaves.push([x, y, deg - 32], [x, y, deg + 32]);
  }
  return leaves;
})();

// Emblems drawn in the 120x120 seal box as filled shapes, so the emboss reads well.
// `lines` are the fine engraved details, drawn only on the top face.
function Emblem({ icon, lines }) {
  switch (icon) {
    case "dove":
      return (
        <>
          {/* far wing, body, near wing, tail */}
          <path d="M62 58 C62 49 65 41 71 35 C73 44 72 52 68 58Z" />
          <path d="M33 72 L42 68 C48 65 54 64 60 63 C66 62 70 57 73 52 C75 49 78 47.5 81 48 C83.5 48.4 85 50 85.4 51.8 L90.5 53.6 L85.2 55.4 C84.4 59.5 81 63.5 76.5 67 C69 73 59 76.5 49 76 C44 75.8 40 76.5 35.5 79.5 L37.5 74.2Z" />
          <path d={DOVE_WING} />
          {lines && (
            <g fill="none" stroke={lines} strokeWidth=".9" strokeLinecap="round" opacity=".7">
              <path d="M44 40 C51 44 57 50 61 58 M41 36 C48 39 54 44 58 50" />
              <path d="M44 72 C50 70.5 56 70.5 62 68.5" />
              <circle cx="80.2" cy="51.6" r=".9" fill={lines} stroke="none" />
            </g>
          )}
        </>
      );
    case "heart":
      return (
        <>
          <path d={HEART} />
          {lines && <path d="M47 46 C44 48 43 52 44.5 56" fill="none" stroke={lines} strokeWidth="1.1" strokeLinecap="round" opacity=".5" />}
        </>
      );
    case "butterfly":
      return (
        <>
          <path d={BUTTERFLY_HALF} />
          <path d={BUTTERFLY_HALF} transform="matrix(-1 0 0 1 120 0)" />
          <ellipse cx="60" cy="61" rx="1.9" ry="12" />
          <circle cx="60" cy="48" r="2.2" />
          <path d="M59.2 47 C57.5 42 55 38.5 51.5 37 M60.8 47 C62.5 42 65 38.5 68.5 37" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="51.3" cy="36.9" r="1.5" />
          <circle cx="68.7" cy="36.9" r="1.5" />
          {lines && (
            <g fill="none" stroke={lines} strokeWidth=".8" strokeLinecap="round" opacity=".6">
              <path d="M57 56 C51 50 45 45 39 43 M56 58 C50 56 43 53 37 50 M56.5 63.5 C52 66 48 69 46 73" />
              <path d="M63 56 C69 50 75 45 81 43 M64 58 C70 56 77 53 83 50 M63.5 63.5 C68 66 72 69 74 73" />
            </g>
          )}
        </>
      );
    case "rose":
      return (
        <>
          {/* bloom, stem, two leaves */}
          <path d="M60 33 C66 33 71 35.5 74 39.5 C78 41 80.5 45 80 50 C79.5 57 73 62.5 60 62.5 C47 62.5 40.5 57 40 50 C39.5 45 42 41 46 39.5 C49 35.5 54 33 60 33Z" />
          <path d="M59 62 C59.5 70 59.8 78 60.5 87" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M59.6 74 C54 70 47 70.5 43.5 75 C49 78.5 55.5 78 59.6 74Z" />
          <path d="M60.2 69 C65 64.5 72 64.5 76 68.5 C71 72.5 64.5 72.5 60.2 69Z" />
          {lines && (
            <g fill="none" stroke={lines} strokeWidth="1" strokeLinecap="round" opacity=".7">
              <path d="M60 46 C56 45 54.5 48.5 57 50.5 C60 53 65 50.5 64 46 C63 41.5 56.5 40.5 53 44 C49.5 47.5 50.5 54 56 56" />
              <path d="M46 40 C44.5 46 46.5 52.5 52 56.5 M74 40 C75.5 46 73.5 52.5 68 56.5" />
              <path d="M42 51.5 C46 58 53 60.5 60 60.5 C67 60.5 74 58 78 51.5" />
            </g>
          )}
        </>
      );
    case "crest":
      return (
        <>
          {["left", "right"].map((side) => (
            <g key={side} transform={side === "right" ? "matrix(-1 0 0 1 120 0)" : undefined}>
              <path d="M52 82 C43 78.5 37 71 35.5 61 C34.8 54 36.5 47 40.5 41" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              {LAUREL.map(([x, y, deg], i) => (
                <path key={i} d={LEAF} transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${deg.toFixed(1)})`} />
              ))}
            </g>
          ))}
          <path d="M60 45 L63.2 54.4 L73 54.4 L65.1 60.2 L68.1 69.6 L60 63.8 L51.9 69.6 L54.9 60.2 L47 54.4 L56.8 54.4Z" />
          <path d="M52.5 82 C56 80.6 64 80.6 67.5 82 L66 85 C62.5 84 57.5 84 54 85Z" />
        </>
      );
    default:
      return null;
  }
}

export default function WaxSeal({ color = "#7a2430", icon = "monogram", monogram = "", className = "", style }) {
  const uid = useId().replace(/:/g, "");
  const light = mix(color, "#ffffff", 0.3);
  const dark = shade(color, -0.45);
  const face = mix(color, "#ffffff", 0.06);
  const text = (monogram || "").trim().slice(0, 6);
  const fontSize = text.length <= 1 ? 40 : text.length <= 3 ? 30 : 22;

  if (icon === "monogram" && !text) icon = "heart";

  // raised emblem: dark shadow below right, light edge above left, then the face with its engraved lines
  const emblem = (fill, dx, dy, opacity, lines) =>
    icon === "monogram" ? (
      <text
        x={60 + dx}
        y={60 + dy}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontFamily: "var(--font-great-vibes), 'Great Vibes', cursive" }}
        fontSize={fontSize}
        fill={fill}
        opacity={opacity}
      >
        {text}
      </text>
    ) : (
      <g fill={fill} color={fill} opacity={opacity} transform={`translate(${dx} ${dy})`}>
        <Emblem icon={icon} lines={lines} />
      </g>
    );

  return (
    <svg viewBox="0 0 120 120" className={className} style={style} role="img" aria-label="Wax seal">
      <defs>
        <radialGradient id={`w${uid}`} cx="36%" cy="30%" r="80%">
          <stop offset="0" stopColor={light} />
          <stop offset="0.5" stopColor={color} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
        {/* pressed-in centre: shaded at the top left, catching light at the bottom right */}
        <linearGradient id={`p${uid}`} x1="0.2" y1="0.1" x2="0.8" y2="0.9">
          <stop offset="0" stopColor={shade(color, -0.3)} />
          <stop offset="1" stopColor={mix(color, "#ffffff", 0.1)} />
        </linearGradient>
        {/* raised lip around the press */}
        <linearGradient id={`l${uid}`} x1="0.15" y1="0.1" x2="0.85" y2="0.9">
          <stop offset="0" stopColor={light} />
          <stop offset="0.5" stopColor={color} stopOpacity="0" />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <radialGradient id={`g${uid}`}>
          <stop offset="0" stopColor="#fff" stopOpacity=".38" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id={`s${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>
      <path d={BLOB} fill={`url(#w${uid})`} filter={`url(#s${uid})`} />
      {/* thin rolled edge of the wax */}
      <path d={BLOB} fill="none" stroke={light} strokeOpacity=".35" strokeWidth="1.2" transform="translate(60 60) scale(.965) translate(-60 -60)" />
      {/* raised lip, then the pressed centre with its inner wall */}
      <circle cx="60" cy="60" r="41" fill="none" stroke={`url(#l${uid})`} strokeWidth="5" opacity=".75" />
      <circle cx="60" cy="60" r="38" fill={`url(#p${uid})`} />
      <circle cx="60" cy="60" r="38" fill="none" stroke={dark} strokeOpacity=".45" strokeWidth="1.4" transform="translate(.6 .6)" />
      {/* beaded ring */}
      {BEADS.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r=".85" fill={dark} opacity=".6" transform="translate(.35 .4)" />
          <circle cx={x} cy={y} r=".8" fill={face} />
        </g>
      ))}
      {emblem(dark, 0.9, 1.1, 0.7)}
      {emblem(light, -0.7, -0.7, 0.75)}
      {emblem(face, 0, 0, 1, dark)}
      {/* soft sheen on the wax */}
      <ellipse cx="42" cy="34" rx="20" ry="11" fill={`url(#g${uid})`} transform="rotate(-30 42 34)" />
    </svg>
  );
}
