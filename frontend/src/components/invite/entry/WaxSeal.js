"use client";

import { useId } from "react";
import { mix, shade } from "@/lib/color";

// Irregular wax-blob outline around (60,60).
const BLOB = (() => {
  const pts = Array.from({ length: 72 }, (_, i) => {
    const t = (i / 72) * Math.PI * 2;
    const r = 53 + 2.6 * Math.sin(7 * t) + 1.8 * Math.sin(12 * t + 1.3) + 1.2 * Math.sin(19 * t + 0.4);
    return `${(60 + r * Math.cos(t)).toFixed(2)},${(60 + r * Math.sin(t)).toFixed(2)}`;
  });
  return `M${pts.join(" L")}Z`;
})();

const HEART = "M60 82 C 42 70 33 61 33 49 A 13 13 0 0 1 60 43 A 13 13 0 0 1 87 49 C 87 61 78 70 60 82Z";

// Emblems drawn in the 120x120 seal box; filled shapes so the emboss reads well.
function Emblem({ icon }) {
  switch (icon) {
    case "dove":
      return (
        <>
          <path d="M34 66 Q42 48 60 52 Q70 36 86 36 Q76 46 75 56 Q79 66 66 74 Q48 82 34 66Z" />
          <path d="M60 52 Q52 36 40 34 Q45 48 54 58Z" />
          <path d="M34 66 L26 74 L38 72Z" />
        </>
      );
    case "heart":
      return <path d={HEART} />;
    case "butterfly":
      return (
        <>
          <path d="M60 60 Q40 32 30 46 Q26 60 60 60Z" />
          <path d="M60 60 Q80 32 90 46 Q94 60 60 60Z" />
          <path d="M60 62 Q42 84 35 74 Q32 64 60 62Z" />
          <path d="M60 62 Q78 84 85 74 Q88 64 60 62Z" />
          <rect x="58" y="44" width="4" height="30" rx="2" />
          <path d="M59 45 Q54 36 50 35 M61 45 Q66 36 70 35" fill="none" strokeWidth="1.6" stroke="currentColor" />
        </>
      );
    case "rose":
      return (
        <>
          <circle cx="60" cy="56" r="15" />
          <path d="M60 41 Q72 50 60 60 Q48 50 60 41Z" opacity=".55" />
          <path d="M60 71 L60 86" strokeWidth="3" stroke="currentColor" />
          <ellipse cx="52" cy="80" rx="7" ry="3" transform="rotate(-30 52 80)" />
          <ellipse cx="68" cy="78" rx="7" ry="3" transform="rotate(30 68 78)" />
        </>
      );
    case "crest":
      return (
        <>
          {Array.from({ length: 6 }, (_, i) => {
            const a = Math.PI * (0.6 + i * 0.11);
            const x = 60 + 26 * Math.cos(a);
            const y = 58 + 26 * Math.sin(a);
            const deg = (a * 180) / Math.PI + 30;
            return (
              <g key={i}>
                <ellipse cx={x} cy={y} rx="2.6" ry="6" transform={`rotate(${deg} ${x} ${y})`} />
                <ellipse cx={120 - x} cy={y} rx="2.6" ry="6" transform={`rotate(${-deg} ${120 - x} ${y})`} />
              </g>
            );
          })}
          <path d="M60 38 L64 50 L76 50 L66 57 L70 69 L60 62 L50 69 L54 57 L44 50 L56 50Z" />
        </>
      );
    default:
      return null;
  }
}

export default function WaxSeal({ color = "#7a2430", icon = "monogram", monogram = "", className = "", style }) {
  const uid = useId().replace(/:/g, "");
  const light = mix(color, "#ffffff", 0.28);
  const dark = shade(color, -0.42);
  const mid = shade(color, -0.12);
  const text = (monogram || "").trim().slice(0, 6);
  const fontSize = text.length <= 1 ? 40 : text.length <= 3 ? 30 : 22;

  if (icon === "monogram" && !text) icon = "heart";

  const emblem = (fill, dx, dy, opacity) =>
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
        <Emblem icon={icon} />
      </g>
    );

  return (
    <svg viewBox="0 0 120 120" className={className} style={style} role="img" aria-label="Wax seal">
      <defs>
        <radialGradient id={`w${uid}`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={color} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
        <radialGradient id={`p${uid}`} cx="64%" cy="68%" r="80%">
          <stop offset="0" stopColor={mix(color, "#ffffff", 0.12)} />
          <stop offset="1" stopColor={shade(color, -0.3)} />
        </radialGradient>
        <filter id={`s${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>
      <path d={BLOB} fill={`url(#w${uid})`} filter={`url(#s${uid})`} />
      {/* drips of wax at the rim */}
      <circle cx="104" cy="74" r="4" fill={mid} opacity=".9" />
      <circle cx="18" cy="44" r="3" fill={mid} opacity=".8" />
      {/* pressed centre */}
      <circle cx="60" cy="60" r="40" fill="none" stroke={light} strokeOpacity=".45" strokeWidth="2" />
      <circle cx="60" cy="60" r="38" fill={`url(#p${uid})`} />
      <circle cx="60" cy="60" r="38" fill="none" stroke={dark} strokeOpacity=".5" strokeWidth="1.2" />
      {/* embossed emblem: shadow, highlight, face */}
      {emblem(dark, 1, 1.2, 0.75)}
      {emblem(light, -0.8, -0.8, 0.7)}
      {emblem(mid, 0, 0, 1)}
      {/* specular highlight */}
      <ellipse cx="40" cy="30" rx="16" ry="7" fill="#fff" opacity=".22" transform="rotate(-28 40 30)" />
    </svg>
  );
}
