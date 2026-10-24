"use client";

import { useId } from "react";

// Hand-built SVG botanicals for the design templates: roses, peonies, ranunculus, blossoms,
// marigolds, leaves and sprigs. A light watercolour filter (turbulence-displaced edges) and
// layered translucent petals give them a painted look instead of flat clip-art.

// ---------- palettes ----------
export const FLORA = {
  blush: {
    flowers: [
      ["rose", { light: "#fbe1e0", mid: "#f0b3b8", dark: "#cf7f8a" }],
      ["rose", { light: "#fdeeea", mid: "#f6cfcd", dark: "#dc9ea2" }],
      ["blossom", { light: "#fffbf8", mid: "#f7e4e2", dark: "#e2b6ba", center: "#e3c27c" }],
      ["rose", { light: "#f7d0d4", mid: "#e89aa5", dark: "#c06574" }],
    ],
    leaves: ["#adbb9e", "#93a585", "#c8d2ba"],
    sprig: ["wisteria", "#cbb8e6", "#a28acb"],
  },
  bordeaux: {
    flowers: [
      ["rose", { light: "#b3263c", mid: "#83122a", dark: "#4c0714" }],
      ["rose", { light: "#fffaf3", mid: "#f1e5d8", dark: "#c9b49f" }],
      ["rose", { light: "#9e1b32", mid: "#6e0d20", dark: "#3d0510" }],
      ["blossom", { light: "#fffaf3", mid: "#efe2d3", dark: "#cdb8a2", center: "#c99a52" }],
    ],
    leaves: ["#56705a", "#3e5643", "#768f73"],
    sprig: ["eucalyptus", "#8fa39a", "#6c8279"],
  },
  peony: {
    flowers: [
      ["peony", { light: "#fde0ea", mid: "#f4a9c6", dark: "#c93a78" }],
      ["peony", { light: "#ee6a9c", mid: "#c81d5f", dark: "#7c0c3a" }],
      ["peony", { light: "#fffbf4", mid: "#f6e9da", dark: "#dcc6ab" }],
      ["rose", { light: "#a8213b", mid: "#7a1027", dark: "#420615" }],
    ],
    leaves: ["#62805a", "#4a6443", "#87a07c"],
    sprig: ["eucalyptus", "#9cae9f", "#738a7a"],
  },
  ranunculus: {
    flowers: [
      ["ranunculus", { light: "#ffd0c1", mid: "#f58c72", dark: "#d4513b" }],
      ["ranunculus", { light: "#ffdba3", mid: "#f6a43c", dark: "#d5741a" }],
      ["ranunculus", { light: "#ffffff", mid: "#f3efe6", dark: "#d6cebf" }],
      ["blossom", { light: "#ffffff", mid: "#f4efe6", dark: "#d8cfbf", center: "#9bb05a" }],
    ],
    leaves: ["#7f9d4c", "#61803a", "#a2bc72"],
    sprig: ["buds", "#8fae55", "#f6a43c"],
  },
  marigold: {
    flowers: [
      ["marigold", { light: "#ffd34f", mid: "#f59e0b", dark: "#c2410c" }],
      ["marigold", { light: "#fff3ac", mid: "#fcd34d", dark: "#d97706" }],
      ["rose", { light: "#f77fbd", mid: "#db2777", dark: "#8f1150" }],
      ["marigold", { light: "#ffb35c", mid: "#f97316", dark: "#b23c09" }],
    ],
    leaves: ["#4f7f17", "#3f6612", "#71a326"],
    sprig: ["buds", "#5b8c1c", "#f59e0b"],
  },
};

// ---------- deterministic randomness ----------
const seeded = (seed) => {
  let s = seed % 233280 || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

// ---------- petal shapes (drawn pointing up from the origin) ----------
const petal = (w, h) => `M0 0 C${-w} ${-h * 0.3} ${-w * 1.02} ${-h * 0.92} 0 ${-h} C${w * 1.02} ${-h * 0.92} ${w} ${-h * 0.3} 0 0Z`;
const ruffled = (w, h) =>
  `M0 0 C${-w} ${-h * 0.28} ${-w * 1.1} ${-h * 0.86} ${-w * 0.52} ${-h * 0.98} Q${-w * 0.26} ${-h * 1.1} 0 ${-h * 0.96} Q${w * 0.26} ${-h * 1.1} ${w * 0.52} ${-h * 0.98} C${w * 1.1} ${-h * 0.86} ${w} ${-h * 0.28} 0 0Z`;

function Rose({ x, y, r, c, rot = 0, g }) {
  const ring = (n, w, h, fill, off, op = 1) =>
    Array.from({ length: n }, (_, k) => (
      <path key={`${w}-${k}`} d={petal(w, h)} transform={`rotate(${(360 / n) * k + off})`} fill={fill} stroke={c.dark} strokeOpacity=".28" strokeWidth={r * 0.02} opacity={op} />
    ));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {ring(5, r * 0.6, r, `url(#${g}-l)`, 0)}
      {ring(5, r * 0.5, r * 0.74, `url(#${g}-m)`, 36, 0.95)}
      <circle r={r * 0.4} fill={`url(#${g}-m)`} />
      {ring(4, r * 0.32, r * 0.44, c.mid, 18, 0.9)}
      <path
        d={`M${-r * 0.24} ${r * 0.06} C${-r * 0.26} ${-r * 0.28} ${r * 0.28} ${-r * 0.3} ${r * 0.24} ${r * 0.03} C${r * 0.2} ${r * 0.22} ${-r * 0.1} ${r * 0.24} ${-r * 0.1} ${r * 0.02} C${-r * 0.1} ${-r * 0.1} ${r * 0.09} ${-r * 0.1} ${r * 0.07} ${r * 0.02}`}
        fill="none"
        stroke={c.dark}
        strokeWidth={r * 0.045}
        strokeLinecap="round"
        opacity=".75"
      />
    </g>
  );
}

function Peony({ x, y, r, c, rot = 0, g }) {
  const ring = (n, w, h, fill, off, op = 1) =>
    Array.from({ length: n }, (_, k) => (
      <path key={`${w}-${k}`} d={ruffled(w, h)} transform={`rotate(${(360 / n) * k + off})`} fill={fill} stroke={c.dark} strokeOpacity=".22" strokeWidth={r * 0.018} opacity={op} />
    ));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {ring(9, r * 0.48, r, `url(#${g}-l)`, 0)}
      {ring(8, r * 0.42, r * 0.78, `url(#${g}-l)`, 20, 0.95)}
      {ring(7, r * 0.36, r * 0.56, `url(#${g}-m)`, 8, 0.95)}
      {ring(6, r * 0.27, r * 0.36, c.mid, 30, 0.9)}
      <circle r={r * 0.14} fill={c.dark} opacity=".55" />
      {Array.from({ length: 6 }, (_, k) => (
        <circle key={k} cx={Math.cos(k) * r * 0.09} cy={Math.sin(k) * r * 0.09} r={r * 0.045} fill="#f3d27a" opacity=".85" />
      ))}
    </g>
  );
}

function Ranunculus({ x, y, r, c, rot = 0, g }) {
  // many layers of short cupped petals, tightening towards a small green heart
  const rings = [
    [13, r * 0.34, r, `url(#${g}-l)`, 0],
    [12, r * 0.31, r * 0.84, `url(#${g}-m)`, 14],
    [11, r * 0.28, r * 0.68, `url(#${g}-l)`, 6],
    [9, r * 0.25, r * 0.52, `url(#${g}-m)`, 20],
    [8, r * 0.21, r * 0.37, `url(#${g}-l)`, 10],
    [6, r * 0.16, r * 0.24, c.mid, 28],
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {rings.map(([n, w, h, fill, off], ri) =>
        Array.from({ length: n }, (_, k) => (
          <path key={`${ri}-${k}`} d={petal(w, h)} transform={`rotate(${(360 / n) * k + off})`} fill={fill} stroke={c.dark} strokeOpacity=".3" strokeWidth={r * 0.018} />
        ))
      )}
      <circle r={r * 0.1} fill="#7d9445" />
      <circle r={r * 0.045} fill="#4f6129" />
    </g>
  );
}

function Blossom({ x, y, r, c, rot = 0, g }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {Array.from({ length: 5 }, (_, k) => (
        <ellipse key={k} cy={-r * 0.5} rx={r * 0.38} ry={r * 0.52} transform={`rotate(${k * 72})`} fill={`url(#${g}-l)`} stroke={c.dark} strokeOpacity=".35" strokeWidth={r * 0.03} />
      ))}
      <circle r={r * 0.2} fill={c.center || "#e3c27c"} />
      {Array.from({ length: 7 }, (_, k) => (
        <circle key={`s${k}`} cx={Math.cos(k * 0.9) * r * 0.28} cy={Math.sin(k * 0.9) * r * 0.28} r={r * 0.045} fill={c.dark} opacity=".7" />
      ))}
    </g>
  );
}

function Marigold({ x, y, r, c, rot = 0, g }) {
  const ring = (n, len, w, fill, off) =>
    Array.from({ length: n }, (_, k) => (
      <path key={`${len}-${k}`} d={ruffled(w, len)} transform={`rotate(${(360 / n) * k + off})`} fill={fill} stroke={c.dark} strokeOpacity=".35" strokeWidth={r * 0.02} />
    ));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {ring(18, r, r * 0.2, `url(#${g}-l)`, 0)}
      {ring(15, r * 0.76, r * 0.18, `url(#${g}-m)`, 10)}
      {ring(12, r * 0.52, r * 0.16, `url(#${g}-l)`, 4)}
      {ring(9, r * 0.3, r * 0.13, c.mid, 18)}
      <circle r={r * 0.12} fill={c.dark} />
    </g>
  );
}

const FLOWER = { rose: Rose, peony: Peony, ranunculus: Ranunculus, blossom: Blossom, marigold: Marigold };

function Leaf({ x, y, len, rot, color }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 C${len * 0.3} ${-len * 0.2} ${len * 0.72} ${-len * 0.2} ${len} 0 C${len * 0.72} ${len * 0.18} ${len * 0.3} ${len * 0.2} 0 0Z`} fill={color} opacity=".92" />
      <path d={`M0 0 Q${len * 0.5} ${-len * 0.03} ${len * 0.95} 0`} stroke="#ffffff" strokeOpacity=".35" strokeWidth={len * 0.014} fill="none" />
    </g>
  );
}

function Sprig({ x, y, len, rot, kind, a, b }) {
  const n = 7;
  const pts = Array.from({ length: n }, (_, i) => (i + 1) / (n + 1));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 Q${len * 0.5} ${-len * 0.12} ${len} ${len * 0.04}`} stroke={kind === "wisteria" ? "#8c9a7c" : a} strokeWidth={len * 0.012} fill="none" />
      {pts.map((t, i) => {
        const px = len * t;
        const py = -len * 0.12 * 4 * t * (1 - t) * 0.5;
        const s = 1 - t * 0.55;
        if (kind === "wisteria")
          return (
            <g key={i}>
              <ellipse cx={px} cy={py + len * 0.05 * s} rx={len * 0.045 * s} ry={len * 0.06 * s} fill={i % 2 ? a : b} opacity=".85" />
              <ellipse cx={px + len * 0.03} cy={py - len * 0.05 * s} rx={len * 0.04 * s} ry={len * 0.055 * s} fill={i % 2 ? b : a} opacity=".8" />
            </g>
          );
        if (kind === "eucalyptus")
          return (
            <g key={i}>
              <circle cx={px} cy={py - len * 0.07 * s} r={len * 0.065 * s} fill={a} opacity=".9" />
              <circle cx={px + len * 0.04} cy={py + len * 0.07 * s} r={len * 0.06 * s} fill={b} opacity=".9" />
            </g>
          );
        return (
          <g key={i}>
            <path d={`M${px} ${py} q${len * 0.05} ${-len * 0.09} ${len * 0.12} ${-len * 0.1}`} stroke={a} strokeWidth={len * 0.01} fill="none" />
            <circle cx={px + len * 0.12} cy={py - len * 0.1} r={len * 0.028 * s + 1} fill={b} />
          </g>
        );
      })}
    </g>
  );
}

// Gradient + watercolour filter definitions shared by one SVG.
function Defs({ uid, palette }) {
  return (
    <defs>
      <filter id={`${uid}-wc`} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      {palette.flowers.map(([, c], i) => (
        <g key={i}>
          <radialGradient id={`${uid}-f${i}-l`} cx="50%" cy="85%" r="95%">
            <stop offset="0" stopColor={c.mid} />
            <stop offset="0.65" stopColor={c.light} />
            <stop offset="1" stopColor={c.light} stopOpacity=".92" />
          </radialGradient>
          <radialGradient id={`${uid}-f${i}-m`} cx="50%" cy="50%" r="70%">
            <stop offset="0" stopColor={c.dark} />
            <stop offset="1" stopColor={c.mid} />
          </radialGradient>
        </g>
      ))}
    </defs>
  );
}

// Slots of a corner bouquet in a 300×300 box, flowers bunched in the top-left corner.
const CORNER = {
  leaves: [
    [36, 36, 215, -4], [36, 36, 215, 94], [50, 44, 190, 22], [44, 50, 190, 68], [30, 30, 235, 45], [80, 70, 150, 8], [70, 80, 150, 82], [96, 96, 120, 45],
  ],
  sprigs: [[84, 40, 200, 4], [40, 84, 200, 86]],
  flowers: [
    [0, 74, 74, 64, 0], [1, 176, 44, 44, 30], [1, 44, 176, 44, -20], [3, 148, 132, 32, 10], [2, 246, 30, 24, 0], [2, 30, 246, 24, 40], [3, 228, 96, 19, 0], [3, 96, 228, 19, 0], [2, 190, 150, 15, 0],
  ],
};

// Slots of a horizontal garland in a 600×170 box, centred.
const GARLAND = {
  leaves: [
    [300, 90, 230, 178], [300, 90, 230, 2], [300, 85, 200, 196], [300, 85, 200, -16], [260, 95, 150, 160], [340, 95, 150, 20],
  ],
  sprigs: [[250, 80, 230, 186], [350, 80, 230, -6]],
  flowers: [
    [0, 300, 88, 58, 0], [1, 222, 98, 42, 20], [1, 378, 98, 42, -10], [2, 160, 100, 30, 0], [2, 440, 100, 30, 0], [3, 260, 52, 22, 0], [3, 340, 130, 22, 0], [2, 108, 96, 18, 0], [2, 492, 96, 18, 0],
  ],
};

function Arrangement({ layout, palette, uid, seed }) {
  const rand = seeded(seed);
  const [kind, a, b] = palette.sprig;
  return (
    <g filter={`url(#${uid}-wc)`}>
      {layout.leaves.map(([x, y, len, rot], i) => (
        <Leaf key={`l${i}`} x={x} y={y} len={len * (0.92 + rand() * 0.16)} rot={rot + (rand() - 0.5) * 8} color={palette.leaves[i % palette.leaves.length]} />
      ))}
      {layout.sprigs.map(([x, y, len, rot], i) => (
        <Sprig key={`s${i}`} x={x} y={y} len={len} rot={rot} kind={kind} a={a} b={b} />
      ))}
      {layout.flowers.map(([slot, x, y, r, rot], i) => {
        const [type, c] = palette.flowers[slot % palette.flowers.length];
        const F = FLOWER[type];
        return <F key={`f${i}`} x={x} y={y} r={r} c={c} rot={rot + rand() * 40} g={`${uid}-f${slot % palette.flowers.length}`} />;
      })}
    </g>
  );
}

// A bouquet tucked into a corner. Flip with CSS (scale) for other corners.
export function FloralCorner({ name = "blush", className = "", style, seed = 3 }) {
  const uid = useId().replace(/:/g, "");
  const palette = FLORA[name] || FLORA.blush;
  return (
    <svg viewBox="0 0 300 300" className={className} style={style} aria-hidden="true">
      <Defs uid={uid} palette={palette} />
      <Arrangement layout={CORNER} palette={palette} uid={uid} seed={seed} />
    </svg>
  );
}

// A horizontal spray, used where two sections meet and along the cover.
export function FloralGarland({ name = "blush", className = "", style, seed = 5 }) {
  const uid = useId().replace(/:/g, "");
  const palette = FLORA[name] || FLORA.blush;
  return (
    <svg viewBox="0 0 600 170" className={className} style={style} aria-hidden="true">
      <Defs uid={uid} palette={palette} />
      <Arrangement layout={GARLAND} palette={palette} uid={uid} seed={seed} />
    </svg>
  );
}
