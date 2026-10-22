// Paper textures as CSS background images (inline SVG data URIs, no external files).
const url = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

// Fine paper grain / felt noise.
export const noise = (opacity = 0.35, freq = 0.85) =>
  url(
    `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='${opacity}'/></svg>`
  );

// Soft mottled clouds (for velvety / damask paper).
export const mottle = (opacity = 0.22) =>
  url(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='m'><feTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#m)' opacity='${opacity}'/></svg>`
  );

// Woven linen.
export const linen = (color = "#000000", opacity = 0.05) =>
  `repeating-linear-gradient(0deg, ${hexA(color, opacity)} 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, ${hexA(color, opacity * 0.8)} 0 1px, transparent 1px 4px)`;

function hexA(hex, a) {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

// Embossed damask flowers: a light highlight and a dark shadow copy offset by 1px.
export const damask = (light = "#ffffff", dark = "#000000") => {
  const motif = (fill, dx, dy, o) =>
    `<g transform='translate(${dx} ${dy})' fill='none' stroke='${fill}' stroke-opacity='${o}' stroke-width='1.6'><path d='M60 20 C70 32 70 44 60 54 C50 44 50 32 60 20Z'/><path d='M60 54 C74 50 86 56 92 70 C78 74 66 68 60 54Z'/><path d='M60 54 C46 50 34 56 28 70 C42 74 54 68 60 54Z'/><circle cx='60' cy='66' r='5'/><path d='M60 72 C60 86 52 96 40 100 M60 72 C60 86 68 96 80 100'/><path d='M0 0 C10 10 10 20 0 30 M120 0 C110 10 110 20 120 30 M0 120 C10 110 10 100 0 90 M120 120 C110 110 110 100 120 90'/></g>`;
  return url(`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>${motif(dark, 1, 1, 0.22)}${motif(light, 0, 0, 0.35)}</svg>`);
};

// Embossed leafy branches (olive botanical).
export const botanical = (light = "#ffffff", dark = "#000000") => {
  const branch = (fill, dx, dy, o) =>
    `<g transform='translate(${dx} ${dy})' stroke='${fill}' stroke-opacity='${o}' fill='${fill}' fill-opacity='${o * 0.55}' stroke-width='1.2'><path d='M10 150 C50 110 80 80 140 20' fill='none'/>${[
      [30, 128, -40],
      [48, 110, 20],
      [62, 96, -45],
      [80, 80, 15],
      [96, 64, -50],
      [112, 50, 10],
      [126, 34, -55],
    ]
      .map(([x, y, r]) => `<ellipse cx='${x}' cy='${y}' rx='11' ry='4.5' transform='rotate(${r} ${x} ${y})'/>`)
      .join("")}</g>`;
  return url(`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>${branch(dark, 1.2, 1.2, 0.3)}${branch(light, 0, 0, 0.32)}</svg>`);
};

// Printed rose vines (ivory gatefold).
export const roseVine = () => {
  const rose = (x, y, s = 1) =>
    `<g transform='translate(${x} ${y}) scale(${s})'><circle r='7' fill='#8b2a2f'/><path d='M-4 -1 q4 -5 8 0 q-4 4 -8 0Z M-2 2 q2 -3 4 0' fill='none' stroke='#5e1a1e' stroke-width='1'/></g>`;
  const leafP = (x, y, r) => `<ellipse cx='${x}' cy='${y}' rx='6' ry='2.6' fill='#5b6b3a' transform='rotate(${r} ${x} ${y})'/>`;
  return url(
    `<svg xmlns='http://www.w3.org/2000/svg' width='90' height='140'><path d='M45 0 C20 30 70 50 45 70 C20 90 70 110 45 140' fill='none' stroke='#6b4a2a' stroke-width='1.2'/>${rose(30, 22)}${rose(60, 58, 0.8)}${rose(28, 98, 0.9)}${rose(62, 128, 0.7)}${leafP(40, 34, -30)}${leafP(52, 44, 30)}${leafP(36, 70, 20)}${leafP(56, 84, -40)}${leafP(38, 112, -20)}${leafP(54, 118, 40)}</svg>`
  );
};

// Gold pinstripe frame + stars (midnight).
export const starField = () =>
  url(
    `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>${[
      [20, 30, 1.2],
      [90, 18, 0.8],
      [120, 80, 1.4],
      [50, 100, 0.9],
      [10, 120, 0.7],
      [76, 60, 0.6],
    ]
      .map(([x, y, r]) => `<circle cx='${x}' cy='${y}' r='${r}' fill='#e9d59a' opacity='.8'/>`)
      .join("")}</svg>`
  );

// Warm stucco for door scenes.
export const stucco = () =>
  url(
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='s'><feTurbulence type='fractalNoise' baseFrequency='0.045' numOctaves='5' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0.16 0'/></filter><rect width='100%' height='100%' filter='url(#s)'/></svg>`
  );
