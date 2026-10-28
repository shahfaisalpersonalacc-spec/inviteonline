"use client";

import { useId } from "react";

// Non-floral template decorations, drawn in SVG: clouds and stars (baby shower), balloons and
// confetti (birthday / party), gold geometric stars and a lantern (nikah), art-deco corner lines
// (classic), and a hanging marigold toran (mehndi). Colours come from the template.

const star5 = (cx, cy, r) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
  }).join(" ");

const cloud = (x, y, s) =>
  `M${x} ${y} a${14 * s} ${14 * s} 0 0 1 ${22 * s} ${-14 * s} a${20 * s} ${20 * s} 0 0 1 ${38 * s} ${-6 * s} a${15 * s} ${15 * s} 0 0 1 ${26 * s} ${12 * s} a${12 * s} ${12 * s} 0 0 1 ${4 * s} ${24 * s} Z`;

// ---------- baby shower: clouds, stars and a moon ----------
export function SkyCorner({ a = "#9cc3e6", b = "#f4c2c2", gold = "#e6c46f", className = "", style }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 300 300" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor={a} stopOpacity=".55" />
        </linearGradient>
      </defs>
      <path d="M200 40a46 46 0 1 0 54 64 38 38 0 1 1-54-64Z" fill={gold} opacity=".95" />
      <path d={cloud(10, 120, 2.1)} fill={`url(#${uid}-c)`} stroke={a} strokeOpacity=".45" strokeWidth="2" />
      <path d={cloud(120, 190, 1.4)} fill={`url(#${uid}-c)`} stroke={a} strokeOpacity=".4" strokeWidth="2" />
      <polygon points={star5(70, 40, 16)} fill={gold} />
      <polygon points={star5(140, 90, 10)} fill={b} />
      <polygon points={star5(30, 200, 9)} fill={gold} opacity=".85" />
      <polygon points={star5(250, 170, 12)} fill={b} opacity=".9" />
      <circle cx="110" cy="30" r="3" fill={gold} />
      <circle cx="270" cy="230" r="3" fill={a} />
      <circle cx="60" cy="250" r="2.5" fill={b} />
    </svg>
  );
}

// ---------- birthday / party: balloons with ribbons and confetti ----------
export function BalloonCorner({ colors = ["#e2457a", "#ffc93c", "#3cc6b5", "#7b6cf6"], className = "", style }) {
  const uid = useId().replace(/:/g, "");
  const balloons = [
    [80, 92, 46, colors[0], -8],
    [158, 70, 40, colors[1], 10],
    [118, 150, 38, colors[2], 0],
    [40, 170, 30, colors[3], -14],
  ];
  return (
    <svg viewBox="0 0 300 300" className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}-hl`} cx="35%" cy="30%" r="60%">
          <stop offset="0" stopColor="#fff" stopOpacity=".7" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {balloons.map(([x, y, r, c, rot], i) => (
        <g key={i} transform={`rotate(${rot} ${x} ${y})`}>
          <path d={`M${x} ${y + r * 1.15} q ${-10} ${30} ${6} ${60} q ${12} ${24} ${-4} ${50}`} stroke={c} strokeOpacity=".7" strokeWidth="2" fill="none" />
          <ellipse cx={x} cy={y} rx={r * 0.86} ry={r} fill={c} />
          <ellipse cx={x} cy={y} rx={r * 0.86} ry={r} fill={`url(#${uid}-hl)`} />
          <path d={`M${x - 5} ${y + r + 1} l5 8 5 -8Z`} fill={c} />
        </g>
      ))}
      {Array.from({ length: 16 }, (_, i) => {
        const x = 30 + ((i * 67) % 250);
        const y = 20 + ((i * 113) % 260);
        const c = colors[i % colors.length];
        return i % 3 ? (
          <rect key={`c${i}`} x={x} y={y} width="7" height="12" rx="2" fill={c} transform={`rotate(${i * 37} ${x + 3} ${y + 6})`} opacity=".9" />
        ) : (
          <circle key={`c${i}`} cx={x} cy={y} r="4" fill={c} opacity=".9" />
        );
      })}
    </svg>
  );
}

// ---------- nikah: interlaced eight-point stars and a hanging lantern ----------
export function GeometricCorner({ gold = "#c9a24a", deep = "#0f4d3a", className = "", style }) {
  const khatam = (cx, cy, r) => (
    <g>
      <rect x={cx - r * 0.7} y={cy - r * 0.7} width={r * 1.4} height={r * 1.4} fill="none" stroke={gold} strokeWidth="2" />
      <rect x={cx - r * 0.7} y={cy - r * 0.7} width={r * 1.4} height={r * 1.4} fill="none" stroke={gold} strokeWidth="2" transform={`rotate(45 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r * 0.32} fill={gold} opacity=".9" />
    </g>
  );
  return (
    <svg viewBox="0 0 300 300" className={className} style={style} aria-hidden="true">
      {khatam(48, 48, 40)}
      {khatam(128, 34, 22)}
      {khatam(34, 128, 22)}
      {khatam(100, 100, 16)}
      <g transform="translate(200 0)">
        <path d="M30 0v54" stroke={gold} strokeWidth="2" />
        <path d="M18 54h24l6 12H12Z" fill={gold} />
        <path d="M12 66q-10 34 6 64h24q16-30 6-64Z" fill={deep} opacity=".85" stroke={gold} strokeWidth="2.5" />
        <path d="M30 70v56M20 70q-6 30 4 56M40 70q6 30-4 56" stroke={gold} strokeWidth="1.4" fill="none" />
        <path d="M18 130h24l-6 12H24Z" fill={gold} />
        <circle cx="30" cy="98" r="7" fill="#ffd77a" opacity=".85" />
      </g>
    </svg>
  );
}

// ---------- classic: art-deco corner lines ----------
export function DecoCorner({ color = "#b8a27a", className = "", style }) {
  return (
    <svg viewBox="0 0 300 300" className={className} style={style} fill="none" stroke={color} aria-hidden="true">
      <path d="M20 280V20h260" strokeWidth="1.5" />
      <path d="M36 280V36h244" strokeWidth=".8" />
      <path d="M52 200V52h148" strokeWidth=".8" />
      <path d="M20 20l70 70" strokeWidth=".8" />
      <path d="M90 90m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0" strokeWidth="1.2" />
      <path d="M90 76v-24M76 90H52" strokeWidth=".8" />
    </svg>
  );
}

// ---------- crimson rose (Wedding Day Taplink design): flat layered roses and loose petals ----------
// One rose drawn in a 100×100 box: four rings of rounded petals, alternately in the rose colour and
// a dark shadow, with a swirl at the centre; exactly the rose of the design.
function TapRose({ x, y, size, color, turn = 0 }) {
  const ring = (rx, ry, angles, fill, opacity) => (
    <g fill={fill} opacity={opacity}>
      {angles.map((a) => (
        <ellipse key={a} cx="50" cy="50" rx={rx} ry={ry} transform={`rotate(${a} 50 50)`} />
      ))}
    </g>
  );
  return (
    <g transform={`translate(${x - size / 2} ${y - size / 2}) scale(${size / 100}) rotate(${turn} 50 50)`}>
      {ring(46, 30, [0, 45, 90, 135], color)}
      {ring(34, 22, [22, 67, 112, 157], "#000", 0.18)}
      {ring(30, 19, [10, 70, 130], color)}
      {ring(20, 13, [40, 100, 160], "#000", 0.22)}
      {ring(16, 10, [25, 95], color)}
      <path d="M50 50c6-4 10 2 6 6s-10 0-8-4 7-6 10-2 1 9-4 10-10-3-8-8 8-8 13-5" fill="none" stroke="#000" strokeOpacity=".45" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M50 50c-6 4-10-2-6-6s10 0 8 4-7 6-10 2-1-9 4-10 10 3 8 8" fill="none" stroke="#000" strokeOpacity=".35" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  );
}

function TapPetal({ x, y, size, turn, color = "#c21220" }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${turn}) scale(${size / 60})`}>
      <path d="M0 -28C14 -16 20 4 8 22c-4 6-12 6-16 0C-20 4-14 -16 0 -28Z" fill={color} />
      <path d="M0 -24c8 12 10 26 4 40" fill="none" stroke="#000" strokeOpacity=".25" strokeWidth="1.5" />
    </g>
  );
}

// A corner cluster: a large crimson rose, a cream one and a deep-red one, with a few loose petals.
// `seed` turns the roses a little so repeated corners don't look stamped.
export function CrimsonRoseCorner({ className = "", style, seed = 1 }) {
  const t = (n) => ((seed * 37 + n * 53) % 90) - 45;
  return (
    <svg viewBox="0 0 300 300" className={className} style={{ overflow: "visible", filter: "drop-shadow(0 10px 16px rgba(0,0,0,.35))", ...style }} aria-hidden="true">
      <TapRose x={88} y={78} size={170} color="#b3111c" turn={t(1)} />
      <TapRose x={208} y={44} size={96} color="#f2e7d8" turn={t(2)} />
      <TapRose x={48} y={206} size={110} color="#8a0c13" turn={t(3)} />
      <TapRose x={168} y={160} size={64} color="#f2e7d8" turn={t(4)} />
      <TapPetal x={258} y={128} size={34} turn={30 + t(5)} />
      <TapPetal x={120} y={248} size={30} turn={-50 + t(6)} />
      <TapPetal x={236} y={214} size={24} turn={110} />
    </svg>
  );
}

// ---------- mehndi: a hanging toran of marigold strings and mango leaves ----------
export function Toran({ className = "", style, colors = ["#f59e0b", "#fcd34d", "#f97316"], leaf = "#4f7f17" }) {
  const uid = useId().replace(/:/g, "");
  const strings = 9;
  return (
    <svg viewBox="0 0 600 150" preserveAspectRatio="xMidYMin slice" className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}-m`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fff3ac" />
          <stop offset=".6" stopColor={colors[0]} />
          <stop offset="1" stopColor={colors[2]} />
        </radialGradient>
      </defs>
      <path d="M0 10 Q300 40 600 10" stroke="#b45309" strokeWidth="3" fill="none" />
      {Array.from({ length: 16 }, (_, i) => {
        const x = 18 + i * 37.5;
        const y = 12 + 22 * Math.sin((Math.PI * x) / 600);
        return <path key={`l${i}`} d={`M${x} ${y} q-9 18 0 34 q9-16 0-34Z`} fill={leaf} opacity={i % 2 ? 0.95 : 0.8} />;
      })}
      {Array.from({ length: strings }, (_, i) => {
        const x = 35 + i * (530 / (strings - 1));
        const top = 14 + 22 * Math.sin((Math.PI * x) / 600);
        const len = i % 2 ? 4 : 6;
        return (
          <g key={i}>
            <path d={`M${x} ${top}v${len * 15}`} stroke="#b45309" strokeWidth="1.2" />
            {Array.from({ length: len }, (_, k) => (
              <circle key={k} cx={x} cy={top + 10 + k * 15} r="8" fill={k % 3 === 1 ? colors[1] : `url(#${uid}-m)`} stroke={colors[2]} strokeOpacity=".5" />
            ))}
            <path d={`M${x} ${top + len * 15 + 4} l-4 10 4 -3 4 3Z`} fill="#db2777" />
          </g>
        );
      })}
    </svg>
  );
}
