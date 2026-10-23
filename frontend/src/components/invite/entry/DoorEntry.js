"use client";

import { useEffect, useId, useRef, useState } from "react";
import { KeyRound } from "lucide-react";
import useOpenSequence from "./useOpenSequence";
import { noise } from "./textures";
import { mix, shade } from "@/lib/color";

/*
 * The door entrance is one scene in a fixed 400x860 coordinate space, scaled to cover the
 * screen (like a photo). Two SVG layers sandwich an HTML doorway:
 *   back SVG  : lit plaster wall, stone arch, steps, floor, light & leaf shadows
 *   doorway   : the hall + two 3D door leaves (HTML, so they can swing in perspective)
 *   front SVG : bougainvillea / marigolds, lanterns, pots (they hang over the doors)
 */
const W = 400;
const H = 860;
const DOOR = { x: 82, y: 262, w: 236, h: 378 }; // doorway opening (semicircular top, r = w/2)
// The part of the scene that must always be visible (arch top to the floor under the steps).
// It is fitted inside the screen; wall and floor are drawn far beyond it to fill any shape.
const SAFE = { x: 0, y: 70, w: 400, h: 760 };

export const DOORS = {
  "door-garden": {
    wall: "#efe2c9",
    stone: "#efe6d6",
    door: "#8fae9f",
    hardware: "#c9a24a",
    floor: "#e6d6bd",
    text: "#3b2f25",
    flowers: "bougainvillea",
  },
  "door-royal": {
    wall: "#6e2226",
    stone: "#d8b56a",
    door: "#5a3a2a",
    hardware: "#e9c46a",
    floor: "#3a1f18",
    text: "#f6e7c8",
    flowers: "marigold",
  },
};

// Deterministic pseudo-random so server and client agree.
const rnd = (i, s = 1) => {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------------- foliage ---------------- */

// Clusters of blooms: [cx, cy, spreadX, spreadY, count]. Laid out around the arch.
const CLUSTERS = [
  [70, 40, 95, 70, 70], [190, 25, 80, 40, 45], [330, 45, 90, 70, 70], [120, 120, 70, 55, 45], [290, 120, 70, 55, 45],
  [200, 215, 60, 26, 26], [150, 185, 40, 30, 18], [255, 185, 40, 30, 18],
  [48, 230, 26, 50, 22], [352, 230, 26, 50, 22], [40, 330, 20, 55, 18], [360, 330, 20, 55, 18],
  [36, 440, 16, 55, 12], [364, 440, 16, 55, 12], [34, 540, 12, 40, 7], [366, 540, 12, 40, 7],
];

function buildFoliage(seed) {
  const blooms = [];
  const leaves = [];
  CLUSTERS.forEach(([cx, cy, sx, sy, n], k) => {
    for (let i = 0; i < Math.round(n * 1.7); i++) {
      const a = rnd(i + k * 97, seed) * Math.PI * 2;
      const r = Math.sqrt(rnd(i + k * 53, seed + 1));
      const x = cx + Math.cos(a) * sx * r;
      const y = cy + Math.sin(a) * sy * r;
      blooms.push({ x, y, s: 3.4 + rnd(i + k * 31, seed + 2) * 3, rot: rnd(i + k, seed + 3) * 360, c: (i + k) % 4, back: rnd(i + k * 7, seed + 4) < 0.35 });
      if (i % 2 === 0 || i % 5 === 0) leaves.push({ x: x + (rnd(i, k + 9) - 0.5) * 14, y: y + (rnd(i, k + 11) - 0.5) * 12, s: 5 + rnd(i, k + 13) * 5, rot: rnd(i, k + 15) * 360 });
    }
  });
  return { blooms, leaves };
}

// A papery three-bract bougainvillea flower.
function Bloom({ b, id }) {
  return (
    <g transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${b.rot.toFixed(0)}) scale(${(b.s / 6).toFixed(2)})`}>
      {[0, 120, 240].map((a) => (
        <path key={a} d="M0 0 C -4.6 -3 -4.2 -8.4 0 -8.6 C 4.2 -8.4 4.6 -3 0 0Z" fill={`url(#${id}-b${b.c})`} transform={`rotate(${a})`} />
      ))}
      <circle r="0.9" fill="#fff6dc" />
    </g>
  );
}

function Leaf({ l, id }) {
  return (
    <g transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.rot.toFixed(0)}) scale(${(l.s / 8).toFixed(2)})`}>
      <path d="M-8 0 C -4 -4.4 4 -4.4 8 0 C 4 4.4 -4 4.4 -8 0Z" fill={`url(#${id}-leaf)`} />
      <path d="M-7 0 L7 0" stroke="#2f5426" strokeWidth=".5" opacity=".6" />
    </g>
  );
}

function Bougainvillea({ id, palette }) {
  const { blooms, leaves } = buildFoliage(1);
  return (
    <>
      <defs>
        {palette.map((c, i) => (
          <radialGradient key={i} id={`${id}-b${i}`} cx="50%" cy="80%" r="90%">
            <stop offset="0" stopColor={mix(c, "#ffffff", 0.45)} />
            <stop offset=".55" stopColor={c} />
            <stop offset="1" stopColor={shade(c, -0.3)} />
          </radialGradient>
        ))}
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f9a52" />
          <stop offset="1" stopColor="#2f5a2a" />
        </linearGradient>
        <filter id={`${id}-mass`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="22" result="d" />
          <feGaussianBlur in="d" stdDeviation="2.5" />
        </filter>
        <filter id={`${id}-soft`} x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation=".7" />
        </filter>
        <filter id={`${id}-depth`} x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="1.2" dy="2" stdDeviation="1.4" floodColor="#3b2410" floodOpacity=".35" />
        </filter>
      </defs>
      {/* leafy mass the flowers grow from */}
      <g filter={`url(#${id}-mass)`} fill="#2f5226" opacity=".55">
        {CLUSTERS.map(([cx, cy, sx, sy], k) => (
          <ellipse key={k} cx={cx} cy={cy} rx={sx * 0.8} ry={sy * 0.8} />
        ))}
      </g>
      {/* back layer: slightly blurred, darker = depth */}
      <g filter={`url(#${id}-soft)`} opacity=".85">
        {leaves.map((l, i) => i % 2 === 0 && <Leaf key={i} l={l} id={id} />)}
        {blooms.filter((b) => b.back).map((b, i) => <Bloom key={i} b={b} id={id} />)}
      </g>
      {/* front layer */}
      <g filter={`url(#${id}-depth)`}>
        {leaves.map((l, i) => i % 2 === 1 && <Leaf key={i} l={l} id={id} />)}
        {blooms.filter((b) => !b.back).map((b, i) => <Bloom key={i} b={b} id={id} />)}
      </g>
    </>
  );
}

function Marigolds({ id }) {
  const strand = (x, y0, n, k) =>
    Array.from({ length: n }, (_, i) => <circle key={`${k}-${i}`} cx={x + Math.sin(i * 0.9 + k) * 1.2} cy={y0 + i * 9} r="5.2" fill={`url(#${id}-m${(i + k) % 2})`} />);
  return (
    <>
      <defs>
        {["#f59e0b", "#ea580c"].map((c, i) => (
          <radialGradient key={i} id={`${id}-m${i}`} cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor={mix(c, "#fff3c4", 0.5)} />
            <stop offset="1" stopColor={shade(c, -0.2)} />
          </radialGradient>
        ))}
        <filter id={`${id}-depth`} x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.2" floodColor="#000" floodOpacity=".35" />
        </filter>
      </defs>
      <g filter={`url(#${id}-depth)`}>
        {Array.from({ length: 38 }, (_, i) => {
          const t = i / 37;
          return <circle key={`s${i}`} cx={30 + t * 340} cy={70 + Math.sin(t * Math.PI) * 70} r="6" fill={`url(#${id}-m${i % 2})`} />;
        })}
        {strand(44, 80, 30, 1)}
        {strand(356, 80, 30, 2)}
        {strand(110, 140, 12, 3)}
        {strand(290, 140, 12, 4)}
      </g>
    </>
  );
}

function Lantern({ x, y, hardware, id }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx="0" cy="22" r="46" fill={`url(#${id}-glow)`} style={{ animation: "glow-pulse 3.4s ease-in-out infinite" }} />
      <path d="M-10 -14 L0 -14 L0 -20" stroke="#24201c" strokeWidth="2" fill="none" />
      <path d="M-14 -16 Q-10 -22 -6 -16" stroke="#24201c" strokeWidth="2" fill="none" />
      <path d="M-8 -10 L8 -10 L13 -2 L-13 -2Z" fill="#24201c" />
      <rect x="-10" y="-2" width="20" height="36" rx="1.5" fill="#ffe4a8" stroke="#24201c" strokeWidth="2.4" />
      <path d="M0 -2 L0 34 M-10 16 L10 16" stroke="#24201c" strokeWidth="1.3" />
      <ellipse cx="0" cy="17" rx="4" ry="7" fill="#fff8de" />
      <path d="M-13 34 L13 34 L7 41 L-7 41Z" fill="#24201c" />
      <circle cx="0" cy="45" r="2.2" fill={hardware} />
    </g>
  );
}

function Pot({ x, palette, id, flowers }) {
  return (
    <g transform={`translate(${x} 640)`}>
      {Array.from({ length: 26 }, (_, i) => (
        <g key={i} transform={`translate(${(rnd(i, 71) - 0.5) * 46} ${-12 - rnd(i, 72) * 52}) rotate(${rnd(i, 73) * 360})`}>
          {flowers && i % 3 === 0 ? (
            <circle r="3.6" fill={`url(#${id}-b${i % palette.length})`} />
          ) : (
            <path d="M-6 0 C -3 -3.4 3 -3.4 6 0 C 3 3.4 -3 3.4 -6 0Z" fill={i % 2 ? "#3f6b34" : "#5f8f48"} />
          )}
        </g>
      ))}
      <path d="M-24 0 L24 0 L19 48 Q0 53 -19 48Z" fill="url(#potGrad)" />
      <rect x="-27" y="-6" width="54" height="9" rx="2" fill="#c97448" />
    </g>
  );
}

/* ---------------- hall behind the doors ---------------- */

function Hall({ accent }) {
  const chair = (x, y, s) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-4" y="-12" width="8" height="12" rx="1" fill="none" stroke="#c9a24a" strokeWidth="1.2" />
      <path d="M-2 -12 L-2 0 M0 -12 L0 0 M2 -12 L2 0" stroke="#c9a24a" strokeWidth=".6" />
      <rect x="-4.5" y="0" width="9" height="2" fill="#f6ead2" />
      <path d="M-4 2 L-4 9 M4 2 L4 9" stroke="#c9a24a" strokeWidth="1.1" />
    </g>
  );
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(#fff9ee, #f6e5c6 55%, #e7cc9f)" }}>
      <svg viewBox="0 0 100 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {[22, 50, 78].map((x) => (
          <path key={x} d={`M${x - 8} 74 L${x - 8} 44 Q${x} 30 ${x + 8} 44 L${x + 8} 74Z`} fill="#fffdf6" stroke="#ead8b4" strokeWidth=".8" />
        ))}
        <path d="M30 98 L30 66 Q50 42 70 66 L70 98" fill="none" stroke="#f3e2c2" strokeWidth="3" />
        {Array.from({ length: 30 }, (_, i) => {
          const t = i / 29;
          const a = Math.PI * (1 - t);
          return <circle key={i} cx={50 + 20 * Math.cos(a)} cy={68 - 22 * Math.sin(a) + (t < 0.15 || t > 0.85 ? 10 : 0)} r={2.2 + rnd(i, 31)} fill={i % 3 ? mix(accent, "#f3a6c0", 0.45) : "#fff4f6"} />;
        })}
        <path d="M0 98 L100 98 L100 160 L0 160Z" fill="#efdfc1" />
        <path d="M44 98 L56 98 L80 160 L20 160Z" fill="#fffaf2" />
        {[0, 1, 2, 3].map((r) => {
          const y = 106 + r * 14;
          const s = 0.55 + r * 0.22;
          const spread = 8 + r * 7;
          return (
            <g key={r}>
              {chair(50 - spread - 4 * s, y, s)}
              {chair(50 - spread - 14 * s, y, s)}
              {chair(50 + spread + 4 * s, y, s)}
              {chair(50 + spread + 14 * s, y, s)}
            </g>
          );
        })}
        <path d="M50 0 L50 14" stroke="#b08a3e" strokeWidth=".5" />
        <path d="M36 22 Q50 32 64 22 M41 18 Q50 25 59 18" fill="none" stroke="#b08a3e" strokeWidth="1" />
        {[36, 41, 46, 50, 54, 59, 64].map((x, i) => (
          <circle key={x} cx={x} cy={i % 2 ? 18 : 22} r="1.4" fill="#ffd27a" />
        ))}
      </svg>
      {Array.from({ length: 16 }, (_, i) => (
        <span key={i} className="absolute rounded-full" style={{ left: `${rnd(i, 51) * 100}%`, top: `${5 + rnd(i, 52) * 40}%`, width: 4, height: 4, background: "#fff2c4", boxShadow: "0 0 8px 3px rgba(255,220,140,.8)", animation: `twinkle ${2 + rnd(i, 53) * 2}s ease-in-out ${rnd(i, 54) * 2}s infinite` }} />
      ))}
    </div>
  );
}

/* ---------------- door leaf ---------------- */

function DoorLeaf({ side, color, hardware, phase }) {
  const left = side === "left";
  const grain = `repeating-linear-gradient(90deg, ${shade(color, -0.05)} 0 2px, ${shade(color, 0.03)} 2px 5px, ${shade(color, -0.02)} 5px 9px)`;
  const light = `linear-gradient(${left ? "100deg" : "80deg"}, rgba(255,255,255,.18), transparent 40%, rgba(0,0,0,.12) 100%)`;
  const bevel = `inset 2px 2px 2px ${shade(color, 0.32)}, inset -2px -2px 3px ${shade(color, -0.45)}, 0 0 0 3px ${shade(color, -0.04)}, 0 0 0 4px ${shade(color, -0.28)}`;
  const inner = left ? { left: "17%", right: "11%" } : { left: "11%", right: "17%" };
  return (
    <div
      className="absolute bottom-0 top-0 w-1/2"
      style={{
        [side]: 0,
        background: `${light}, ${noise(0.12, 0.7)}, ${grain}`,
        transformOrigin: `${side} center`,
        transition: "transform 2.1s cubic-bezier(.55,.05,.2,1), filter 2.1s ease",
        transform: phase >= 1 ? `rotateY(${left ? -104 : 104}deg)` : "none",
        filter: phase >= 1 ? "brightness(.7)" : "none",
        borderTopLeftRadius: left ? "100% 31%" : 0,
        borderTopRightRadius: left ? 0 : "100% 31%",
        boxShadow: left ? "inset -3px 0 3px rgba(0,0,0,.35)" : "inset 3px 0 3px rgba(0,0,0,.35)",
      }}
    >
      <div className="absolute" style={{ ...inner, top: "12%", height: "38%", borderTopLeftRadius: left ? "100% 42%" : 4, borderTopRightRadius: left ? 4 : "100% 42%", borderBottomLeftRadius: 4, borderBottomRightRadius: 4, boxShadow: bevel }} />
      <div className="absolute rounded-[4px]" style={{ ...inner, top: "56%", bottom: "7%", boxShadow: bevel }} />
      <div
        className="absolute rounded-full"
        style={{
          [left ? "right" : "left"]: "6%",
          top: "45%",
          width: "3.4%",
          height: "14%",
          background: `linear-gradient(90deg, ${shade(hardware, -0.35)}, ${mix(hardware, "#ffffff", 0.55)} 45%, ${hardware} 60%, ${shade(hardware, -0.25)})`,
          boxShadow: "2px 3px 4px rgba(0,0,0,.35)",
        }}
      />
    </div>
  );
}

/* ---------------- scene ---------------- */

// Fits the SAFE area inside the container (like object-fit: contain) and reports the mapping.
function useFit(ref) {
  const [box, setBox] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      const s = Math.min(width / SAFE.w, height / SAFE.h);
      setBox({ s, ox: (width - SAFE.w * s) / 2 - SAFE.x * s, oy: (height - SAFE.h * s) / 2 - SAFE.y * s });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return box;
}

export function DoorEntry({ styleId, theme = {}, onStart, onDone }) {
  const d = DOORS[styleId] || DOORS["door-garden"];
  const garden = d.flowers === "bougainvillea";
  const { phase, open } = useOpenSequence(DOOR_STEPS, 3300, { onStart, onDone });
  const root = useRef(null);
  const box = useFit(root);
  const id = useId().replace(/:/g, "");
  const doorColor = theme.doorColor || d.door;
  const accent = theme.primary || "#c2185b";
  const palette = ["#c2185b", "#e0457b", "#d81b60", "#f06292"].map((c, i) => (i === 3 ? c : mix(c, accent, 0.18)));

  const svgProps = { viewBox: `${SAFE.x} ${SAFE.y} ${SAFE.w} ${SAFE.h}`, preserveAspectRatio: "xMidYMid meet", className: "pointer-events-none absolute inset-0 h-full w-full", style: { overflow: "visible" }, "aria-hidden": true };
  const doorway = box && {
    left: box.ox + DOOR.x * box.s,
    top: box.oy + DOOR.y * box.s,
    width: DOOR.w * box.s,
    height: DOOR.h * box.s,
  };
  const origin = doorway ? `${doorway.left + doorway.width / 2}px ${doorway.top + doorway.height * 0.55}px` : "50% 55%";

  return (
    <button type="button" onClick={open} aria-label="Open the doors to the invitation" className="absolute inset-0 block h-full w-full cursor-pointer overflow-hidden text-left" style={{ background: d.wall, containerType: "size" }}>
      <div ref={root} className="absolute inset-0" style={{ transformOrigin: origin, transition: "transform 1.5s cubic-bezier(.65,0,.35,1)", transform: phase >= 2 ? "scale(3.2)" : "none" }}>
        {/* ---- back: wall, stone arch, steps ---- */}
        <svg {...svgProps}>
          <defs>
            <filter id={`${id}-plaster`} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="4" seed="7" result="n" />
              <feDiffuseLighting in="n" surfaceScale="1.6" lightingColor="#fff" result="lit">
                <feDistantLight azimuth="225" elevation="58" />
              </feDiffuseLighting>
              <feComposite in="lit" in2="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" />
            </filter>
            <filter id={`${id}-stone`} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="3" result="n" />
              <feDiffuseLighting in="n" surfaceScale="1" lightingColor="#fff" result="lit">
                <feDistantLight azimuth="225" elevation="65" />
              </feDiffuseLighting>
              <feComposite in="lit" in2="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" />
            </filter>
            <linearGradient id={`${id}-sun`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff6dc" stopOpacity=".75" />
              <stop offset=".6" stopColor="#fff6dc" stopOpacity="0" />
            </linearGradient>
            <radialGradient id={`${id}-vignette`} cx="50%" cy="45%" r="75%">
              <stop offset=".55" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#2a1608" stopOpacity=".45" />
            </radialGradient>
            <linearGradient id={`${id}-frame`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={shade(d.stone, -0.16)} />
              <stop offset=".3" stopColor={shade(d.stone, 0.06)} />
              <stop offset=".55" stopColor={shade(d.stone, 0.1)} />
              <stop offset="1" stopColor={shade(d.stone, -0.18)} />
            </linearGradient>
            <linearGradient id={`${id}-reveal`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={shade(d.stone, -0.38)} />
              <stop offset=".12" stopColor={shade(d.stone, -0.2)} />
              <stop offset=".88" stopColor={shade(d.stone, -0.2)} />
              <stop offset="1" stopColor={shade(d.stone, -0.4)} />
            </linearGradient>
            <radialGradient id={`${id}-soffit`} cx="50%" cy="62%" r="62%">
              <stop offset=".55" stopColor="#2a1a10" stopOpacity=".42" />
              <stop offset="1" stopColor="#2a1a10" stopOpacity=".05" />
            </radialGradient>
            <filter id={`${id}-blur6`}>
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#2a1608" floodOpacity=".35" />
            </filter>
          </defs>

          {/* lit plaster wall */}
          <rect x="-700" y="-700" width="1800" height="1400" fill={d.wall} filter={`url(#${id}-plaster)`} />
          {garden ? (
            <>
              <path d="M0 0 L260 0 L0 520Z" fill={`url(#${id}-sun)`} style={{ mixBlendMode: "screen" }} />
              {/* soft leaf shadows on the wall (behind the arch) */}
              <g filter={`url(#${id}-blur6)`} fill="#4a3216" opacity=".16" style={{ animation: "sway 9s ease-in-out infinite", transformOrigin: "0 0" }}>
                {Array.from({ length: 40 }, (_, i) => {
                  const x = rnd(i, 21) * W;
                  const y = 140 + rnd(i, 22) * 380;
                  return <ellipse key={i} cx={x} cy={y} rx={8 + rnd(i, 23) * 12} ry={3 + rnd(i, 24) * 4} transform={`rotate(${rnd(i, 25) * 180} ${x} ${y})`} />;
                })}
              </g>
            </>
          ) : (
            <rect x="-700" y="-700" width="1800" height="1400" fill="#000" opacity=".12" />
          )}

          {/* floor */}
          <rect x="-700" y="690" width="1800" height="900" fill={d.floor} filter={`url(#${id}-stone)`} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${200 + (i - 2.5) * 30} 690 L${200 + (i - 2.5) * 120} ${H}`} stroke={shade(d.floor, -0.22)} strokeWidth="1" opacity=".55" />
          ))}
          {[720, 760, 812].map((y) => (
            <path key={y} d={`M-700 ${y} L1100 ${y}`} stroke={shade(d.floor, -0.2)} strokeWidth="1" opacity=".45" />
          ))}

          {/* stone arch: outer molding, frame, deep reveal */}
          <g filter={`url(#${id}-shadow)`}>
            <path d={`M40 640 L40 ${DOOR.y + 4} A160 160 0 0 1 360 ${DOOR.y + 4} L360 640Z`} fill={`url(#${id}-frame)`} />
          </g>
          <path d={`M40 640 L40 ${DOOR.y + 4} A160 160 0 0 1 360 ${DOOR.y + 4} L360 640Z`} fill={d.stone} filter={`url(#${id}-stone)`} opacity=".55" />
          {/* carved molding: alternating highlight / shadow rings */}
          {[
            [44, 156, -0.32, 1.6],
            [48, 152, 0.18, 2],
            [54, 146, -0.22, 1.4],
            [58, 142, 0.14, 1.6],
          ].map(([x, r, t, sw]) => (
            <path key={r} d={`M${x} 640 L${x} ${DOOR.y + 4} A${r} ${r} 0 0 1 ${400 - x} ${DOOR.y + 4} L${400 - x} 640`} fill="none" stroke={shade(d.stone, t)} strokeWidth={sw} />
          ))}
          <path d={`M64 640 L64 ${DOOR.y + 2} A136 136 0 0 1 336 ${DOOR.y + 2} L336 640Z`} fill={`url(#${id}-reveal)`} />
          {/* the recess is in shade: darker towards the door */}
          <path d={`M64 640 L64 ${DOOR.y + 2} A136 136 0 0 1 336 ${DOOR.y + 2} L336 640Z`} fill={`url(#${id}-soffit)`} />
          <path d={`M${DOOR.x} 640 L${DOOR.x} ${DOOR.y + DOOR.w / 2} A${DOOR.w / 2} ${DOOR.w / 2} 0 0 1 ${DOOR.x + DOOR.w} ${DOOR.y + DOOR.w / 2} L${DOOR.x + DOOR.w} 640`} fill="none" stroke="#1a0f08" strokeWidth="14" opacity=".35" filter={`url(#${id}-blur6)`} />
          {/* keystone */}
          <path d={`M186 ${DOOR.y - 162} L214 ${DOOR.y - 162} L220 ${DOOR.y - 128} L180 ${DOOR.y - 128}Z`} fill={shade(d.stone, 0.06)} stroke={shade(d.stone, -0.25)} strokeWidth="1" />
          {/* doorway shadow */}
          <path d={`M${DOOR.x} 640 L${DOOR.x} ${DOOR.y + DOOR.w / 2} A${DOOR.w / 2} ${DOOR.w / 2} 0 0 1 ${DOOR.x + DOOR.w} ${DOOR.y + DOOR.w / 2} L${DOOR.x + DOOR.w} 640Z`} fill="#2a1a10" />

          {/* steps */}
          <rect x="26" y="638" width="348" height="18" rx="2" fill={shade(d.stone, 0.04)} filter={`url(#${id}-stone)`} />
          <rect x="26" y="654" width="348" height="4" fill={shade(d.stone, -0.25)} opacity=".6" />
          <rect x="6" y="658" width="388" height="22" rx="2" fill={shade(d.stone, -0.02)} filter={`url(#${id}-stone)`} />
          <rect x="6" y="678" width="388" height="6" fill={shade(d.stone, -0.3)} opacity=".55" />

          {/* petals on the floor */}
          {Array.from({ length: 22 }, (_, i) => (
            <ellipse key={i} cx={rnd(i, 61) * W} cy={700 + rnd(i, 62) * 150} rx="3.4" ry="2" fill={garden ? palette[i % 4] : i % 2 ? "#f59e0b" : "#ea580c"} opacity=".85" transform={`rotate(${rnd(i, 63) * 180} ${rnd(i, 61) * W} ${700 + rnd(i, 62) * 150})`} />
          ))}
          <rect x="-700" y="-700" width="1800" height="2300" fill={`url(#${id}-vignette)`} />
        </svg>

        {/* ---- doorway: hall + swinging doors ---- */}
        {doorway && (
          <div className="absolute overflow-hidden" style={{ ...doorway, borderRadius: "50% 50% 0 0 / 31% 31% 0 0", perspective: "1600px" }}>
            <Hall accent={accent} />
            <DoorLeaf side="left" color={doorColor} hardware={d.hardware} phase={phase} />
            <DoorLeaf side="right" color={doorColor} hardware={d.hardware} phase={phase} />
            <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 10px 14px rgba(0,0,0,.35), inset 6px 0 10px rgba(0,0,0,.25), inset -6px 0 10px rgba(0,0,0,.25)" }} />
          </div>
        )}

        {/* ---- front: foliage, lanterns, pots ---- */}
        <svg {...svgProps}>
          <defs>
            <radialGradient id={`${id}-glow`}>
              <stop offset="0" stopColor="#ffd98f" stopOpacity=".55" />
              <stop offset="1" stopColor="#ffd98f" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="potGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#9a4f2c" />
              <stop offset=".4" stopColor="#c97448" />
              <stop offset="1" stopColor="#8a4527" />
            </linearGradient>
          </defs>
          <Lantern x={20} y={410} hardware={d.hardware} id={id} />
          <Lantern x={380} y={410} hardware={d.hardware} id={id} />
          {garden ? <Bougainvillea id={id} palette={palette} /> : <Marigolds id={id} />}
          {garden && (
            <>
              <Pot x={34} palette={palette} id={id} flowers />
              <Pot x={366} palette={palette} id={id} flowers />
            </>
          )}
        </svg>

        {/* light flooding out of the opened doors */}
        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at ${origin.replace(" ", " ")}, rgba(255,246,222,1), rgba(255,246,222,0) 50%)`, opacity: phase >= 2 ? 1 : 0, transition: "opacity 1.2s ease .2s" }} />
      </div>

      {/* tap to open */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[3.5%] flex flex-col items-center gap-[1.2cqh] transition-opacity duration-500" style={{ opacity: phase ? 0 : 1, zIndex: 5 }}>
        <span className="grid place-items-center rounded-full" style={{ width: "clamp(30px, 14cqw, 56px)", height: "clamp(30px, 14cqw, 56px)", background: "rgba(28,26,61,.82)", boxShadow: `0 0 0 2px ${d.hardware}, 0 8px 22px rgba(0,0,0,.35)`, animation: phase ? "none" : "hint-bob 2.4s ease-in-out infinite" }}>
          <KeyRound color={d.hardware} style={{ width: "46%", height: "46%" }} strokeWidth={1.6} />
        </span>
        <span className="whitespace-nowrap font-semibold uppercase tracking-[0.35em]" style={{ fontSize: "clamp(8px, 3.6cqw, 14px)", color: d.text, fontFamily: "var(--font-display), serif", textShadow: garden ? "0 1px 8px rgba(255,255,255,.7)" : "0 1px 8px rgba(0,0,0,.6)" }}>
          Tap to open
        </span>
        <span className="whitespace-nowrap italic" style={{ fontSize: "clamp(9px, 4.2cqw, 17px)", color: d.text, fontFamily: "var(--font-display), serif", opacity: 0.85 }}>
          An invitation awaits
        </span>
      </div>
    </button>
  );
}

const DOOR_STEPS = [[2, 1700]];
