"use client";

import { KeyRound } from "lucide-react";
import useOpenSequence from "./useOpenSequence";
import { noise, stucco, damask } from "./textures";
import { mix, shade } from "@/lib/color";

export const DOORS = {
  "door-garden": {
    wall: () => `${stucco()}, radial-gradient(ellipse at 25% 0%, #fff9ec 0%, #f6e8cf 40%, #e8d3b0 100%)`,
    frame: "#f1e6d2",
    door: "#86a99a",
    hardware: "#c9a24a",
    floor: "#e4d3b8",
    text: "#3b2f25",
    flowers: "bougainvillea",
  },
  "door-royal": {
    wall: () => `${damask("#f0c97a", "#2a0b0d")}, ${noise(0.2)}, radial-gradient(ellipse at 50% 10%, #7a2b2b 0%, #4a1517 60%, #2c0c0e 100%)`,
    frame: "#d8b56a",
    door: "#5a3a2a",
    hardware: "#e9c46a",
    floor: "#3a1f18",
    text: "#f6e7c8",
    flowers: "marigold",
  },
};

// Deterministic pseudo-random (same on server and client).
const rnd = (i, s = 1) => {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------------- flowers ---------------- */

// Bougainvillea: papery three-bract blooms over dark leaves, densest at the top of the box.
function Bougainvillea({ style, colors, seed = 1, count = 70, flip }) {
  const items = Array.from({ length: count }, (_, i) => {
    const y = Math.pow(rnd(i, seed), 1.6) * 100; // bias towards the top
    const x = rnd(i, seed + 7) * 100;
    return { x, y, r: 2.4 + rnd(i, seed + 3) * 2.6, c: colors[i % colors.length], a: rnd(i, seed + 5) * 360 };
  });
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute" style={{ ...style, transform: flip ? "scaleX(-1)" : undefined }} aria-hidden="true">
      {items.map((b, i) => (
        <ellipse key={`l${i}`} cx={b.x + 2.5} cy={b.y + 1.5} rx={b.r * 1.2} ry={b.r * 0.55} fill={i % 3 ? "#3f6b34" : "#5a8a44"} transform={`rotate(${b.a} ${b.x} ${b.y})`} />
      ))}
      {items.map((b, i) => (
        <g key={`b${i}`} transform={`translate(${b.x} ${b.y}) rotate(${b.a})`}>
          {[0, 120, 240].map((a) => (
            <path key={a} d={`M0 0 C ${-b.r * 0.7} ${-b.r * 0.5} ${-b.r * 0.6} ${-b.r * 1.3} 0 ${-b.r * 1.25} C ${b.r * 0.6} ${-b.r * 1.3} ${b.r * 0.7} ${-b.r * 0.5} 0 0Z`} fill={b.c} transform={`rotate(${a})`} />
          ))}
          <circle r={b.r * 0.16} fill="#fff6d8" />
        </g>
      ))}
    </svg>
  );
}

function MarigoldStrings({ style }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute" style={style} aria-hidden="true">
      <path d="M0 3 Q50 30 100 3" fill="none" stroke="#14532d" strokeWidth=".5" />
      {Array.from({ length: 34 }, (_, i) => {
        const t = i / 33;
        return <circle key={`s${i}`} cx={t * 100} cy={3 + Math.sin(t * Math.PI) * 26} r="1.9" fill={i % 3 ? "#f97316" : "#facc15"} />;
      })}
      {[6, 18, 82, 94].map((x, k) =>
        Array.from({ length: 16 }, (_, i) => <circle key={`h${k}-${i}`} cx={x} cy={4 + i * 3.4} r="1.6" fill={(i + k) % 3 ? "#f97316" : "#facc15"} />)
      )}
    </svg>
  );
}

function Pot({ style, colors, flip }) {
  return (
    <svg viewBox="0 0 60 90" className="pointer-events-none absolute" style={{ ...style, transform: flip ? "scaleX(-1)" : undefined }} aria-hidden="true">
      {Array.from({ length: 22 }, (_, i) => (
        <ellipse key={`l${i}`} cx={14 + rnd(i, 9) * 32} cy={12 + rnd(i, 4) * 40} rx="5" ry="2.4" fill={i % 2 ? "#3f6b34" : "#5a8a44"} transform={`rotate(${rnd(i, 2) * 180} ${14 + rnd(i, 9) * 32} ${12 + rnd(i, 4) * 40})`} />
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={`f${i}`} cx={14 + rnd(i, 11) * 32} cy={10 + rnd(i, 13) * 34} r="2.6" fill={colors[i % colors.length]} />
      ))}
      <path d="M12 56 L48 56 L44 86 Q30 90 16 86Z" fill="#b8643b" />
      <path d="M10 52 L50 52 L50 58 L10 58Z" fill="#c97448" />
      <path d="M16 62 L44 62" stroke="#9a4f2c" strokeWidth="1" opacity=".5" />
    </svg>
  );
}

function Lantern({ style, hardware }) {
  return (
    <div className="pointer-events-none absolute" style={style} aria-hidden="true">
      <div className="absolute left-1/2 top-[45%] h-[260%] w-[260%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,210,130,.55), rgba(255,210,130,0) 62%)", animation: "glow-pulse 3.4s ease-in-out infinite" }} />
      <svg viewBox="0 0 40 90" className="relative h-full w-full">
        <path d="M6 10 L20 10 L20 4" stroke="#2a2420" strokeWidth="2" fill="none" />
        <path d="M2 8 Q6 2 10 8" stroke="#2a2420" strokeWidth="2" fill="none" />
        <path d="M12 14 L28 14 L34 22 L6 22Z" fill="#2a2420" />
        <rect x="9" y="22" width="22" height="40" rx="2" fill="#ffe2a3" stroke="#2a2420" strokeWidth="2.5" />
        <path d="M20 22 L20 62 M9 42 L31 42" stroke="#2a2420" strokeWidth="1.4" />
        <ellipse cx="20" cy="44" rx="4.5" ry="8" fill="#fff7dc" />
        <path d="M6 62 L34 62 L27 70 L13 70Z" fill="#2a2420" />
        <circle cx="20" cy="74" r="2.5" fill={hardware} />
      </svg>
    </div>
  );
}

// Soft, swaying shadows of leaves falling across the wall (sunlight through foliage).
function LeafShadows() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full mix-blend-multiply" style={{ animation: "sway 9s ease-in-out infinite", transformOrigin: "0 0" }} aria-hidden="true">
      <defs>
        <filter id="leafBlur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
      </defs>
      <g filter="url(#leafBlur)" fill="rgba(70,50,20,.16)">
        {Array.from({ length: 46 }, (_, i) => {
          const x = rnd(i, 21) * 100;
          const y = Math.pow(rnd(i, 22), 0.9) * 75;
          return <ellipse key={i} cx={x} cy={y} rx={1.4 + rnd(i, 23) * 2.6} ry={0.6 + rnd(i, 24) * 0.9} transform={`rotate(${rnd(i, 25) * 180} ${x} ${y})`} />;
        })}
        <path d="M-5 20 Q30 35 60 10" stroke="rgba(70,50,20,.12)" strokeWidth="1.2" fill="none" />
        <path d="M55 -5 Q75 30 105 45" stroke="rgba(70,50,20,.12)" strokeWidth="1" fill="none" />
      </g>
    </svg>
  );
}

/* ---------------- the room behind the doors ---------------- */

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
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(#fff8ea, #f7e6c6 55%, #e9cfa3)" }}>
      <svg viewBox="0 0 100 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {/* back wall arched windows */}
        {[22, 50, 78].map((x) => (
          <path key={x} d={`M${x - 8} 70 L${x - 8} 40 Q${x} 26 ${x + 8} 40 L${x + 8} 70Z`} fill="#fffdf6" stroke="#ead8b4" strokeWidth=".8" />
        ))}
        {/* floral arch at the end of the aisle */}
        <path d="M30 96 L30 64 Q50 40 70 64 L70 96" fill="none" stroke="#f3e2c2" strokeWidth="3" />
        {Array.from({ length: 30 }, (_, i) => {
          const t = i / 29;
          const a = Math.PI * (1 - t);
          return <circle key={i} cx={50 + 20 * Math.cos(a)} cy={66 - 22 * Math.sin(a) + (t < 0.15 || t > 0.85 ? 10 : 0)} r={2.2 + rnd(i, 31)} fill={i % 3 ? mix(accent, "#f3a6c0", 0.45) : "#fff4f6"} />;
        })}
        {/* floor & aisle */}
        <path d="M0 96 L100 96 L100 160 L0 160Z" fill="#efdfc1" />
        <path d="M44 96 L56 96 L80 160 L20 160Z" fill="#fffaf2" />
        <path d="M44 96 L20 160 M56 96 L80 160" stroke="#e2c99c" strokeWidth=".5" />
        {/* petals on the aisle */}
        {Array.from({ length: 24 }, (_, i) => (
          <ellipse key={i} cx={30 + rnd(i, 41) * 40} cy={100 + rnd(i, 42) * 58} rx="1" ry=".55" fill={mix(accent, "#f08fb0", 0.5)} transform={`rotate(${rnd(i, 43) * 180} ${30 + rnd(i, 41) * 40} ${100 + rnd(i, 42) * 58})`} />
        ))}
        {/* chairs in perspective */}
        {[0, 1, 2, 3].map((r) => {
          const y = 104 + r * 14;
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
        {/* chandelier */}
        <path d="M50 0 L50 14" stroke="#b08a3e" strokeWidth=".5" />
        <path d="M36 22 Q50 32 64 22 M41 18 Q50 25 59 18" fill="none" stroke="#b08a3e" strokeWidth="1" />
        {[36, 41, 46, 50, 54, 59, 64].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={i % 2 ? 18 : 22} r="1.4" fill="#ffd27a" />
            <path d={`M${x} ${(i % 2 ? 18 : 22) + 2} L${x} ${(i % 2 ? 18 : 22) + 9}`} stroke="#fff3cf" strokeWidth=".5" strokeDasharray="1 1" />
          </g>
        ))}
      </svg>
      {/* fairy lights */}
      {Array.from({ length: 18 }, (_, i) => (
        <span key={i} className="absolute rounded-full" style={{ left: `${rnd(i, 51) * 100}%`, top: `${5 + rnd(i, 52) * 40}%`, width: 4, height: 4, background: "#fff2c4", boxShadow: "0 0 8px 3px rgba(255,220,140,.8)", animation: `twinkle ${2 + rnd(i, 53) * 2}s ease-in-out ${rnd(i, 54) * 2}s infinite` }} />
      ))}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 35%, rgba(255,250,235,.0) 30%, rgba(120,80,40,.25) 100%)" }} />
    </div>
  );
}

/* ---------------- door leaf ---------------- */

function DoorLeaf({ side, color, hardware, phase }) {
  const left = side === "left";
  const wood = `linear-gradient(90deg, ${shade(color, -0.16)} 0%, ${color} 12%, ${shade(color, 0.07)} 50%, ${color} 88%, ${shade(color, -0.18)} 100%)`;
  const bevel = `inset 2px 2px 2px ${shade(color, 0.3)}, inset -2px -2px 3px ${shade(color, -0.42)}, 0 0 0 3px ${shade(color, -0.06)}, 0 0 0 4px ${shade(color, -0.25)}`;
  const inner = left ? { left: "17%", right: "11%" } : { left: "11%", right: "17%" };
  return (
    <div
      className="absolute bottom-0 top-0 w-1/2"
      style={{
        [side]: 0,
        background: `${noise(0.14, 0.6)}, ${wood}`,
        transformOrigin: `${side} center`,
        transformStyle: "preserve-3d",
        transition: "transform 2.1s cubic-bezier(.55,.05,.2,1), filter 2.1s ease",
        transform: phase >= 1 ? `rotateY(${left ? -104 : 104}deg)` : "none",
        filter: phase >= 1 ? "brightness(.72)" : "none",
        borderTopLeftRadius: left ? "100% 30%" : 0,
        borderTopRightRadius: left ? 0 : "100% 30%",
        boxShadow: left ? "inset -3px 0 3px rgba(0,0,0,.4)" : "inset 3px 0 3px rgba(0,0,0,.4)",
      }}
    >
      {/* upper arched panel */}
      <div className="absolute" style={{ ...inner, top: "11%", height: "38%", borderTopLeftRadius: left ? "100% 42%" : 4, borderTopRightRadius: left ? 4 : "100% 42%", borderBottomLeftRadius: 4, borderBottomRightRadius: 4, boxShadow: bevel }} />
      {/* lower panel */}
      <div className="absolute rounded-[4px]" style={{ ...inner, top: "55%", bottom: "7%", boxShadow: bevel }} />
      {/* brass pull */}
      <div
        className="absolute rounded-full"
        style={{
          [left ? "right" : "left"]: "5%",
          top: "44%",
          width: "3.6%",
          height: "15%",
          background: `linear-gradient(90deg, ${shade(hardware, -0.35)}, ${mix(hardware, "#ffffff", 0.5)} 45%, ${hardware} 60%, ${shade(hardware, -0.25)})`,
          boxShadow: "2px 3px 4px rgba(0,0,0,.35)",
        }}
      />
      {/* sunlit sheen */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(115deg, rgba(255,255,255,.14), transparent 45%)", borderRadius: "inherit" }} />
    </div>
  );
}

/* ---------------- scene ---------------- */

export function DoorEntry({ styleId, theme = {}, onStart, onDone }) {
  const d = DOORS[styleId] || DOORS["door-garden"];
  const { phase, open } = useOpenSequence(DOOR_STEPS, 3300, { onStart, onDone });
  const doorColor = theme.sealColor && theme.entryStyle === styleId ? theme.sealColor : d.door;
  const accent = theme.primary || "#e2558f";
  const blooms = [mix(accent, "#e2558f", 0.55), mix(accent, "#f07aa8", 0.65), mix(accent, "#c73a76", 0.6), "#f4a3c4"];
  const archW = "min(74cqw, 41cqh)";
  const garden = d.flowers === "bougainvillea";

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Open the doors to the invitation"
      className="absolute inset-0 block h-full w-full cursor-pointer overflow-hidden text-left"
      style={{ containerType: "size", background: d.wall() }}
    >
      <div className="absolute inset-0" style={{ transformOrigin: "50% 50%", transition: "transform 1.5s cubic-bezier(.65,0,.35,1), opacity 1.5s", transform: phase >= 2 ? "scale(3.4)" : "none" }}>
        {/* warm light from the top-left + vignette */}
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 18% 8%, rgba(255,244,214,.55), transparent 55%), radial-gradient(ellipse at 50% 60%, transparent 50%, rgba(60,35,15,.28) 100%)" }} />

        {/* floor + steps */}
        <div className="absolute inset-x-0 bottom-0 h-[15%]" style={{ background: `${noise(0.18)}, linear-gradient(${shade(d.floor, 0.06)}, ${shade(d.floor, -0.12)})` }}>
          <div className="absolute inset-0 opacity-40" style={{ background: `repeating-linear-gradient(90deg, transparent 0 18%, ${shade(d.floor, -0.25)} 18% 18.4%)` }} />
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} className="absolute rounded-[50%]" style={{ left: `${rnd(i, 61) * 100}%`, top: `${20 + rnd(i, 62) * 70}%`, width: 7, height: 4, background: blooms[i % blooms.length], transform: `rotate(${rnd(i, 63) * 180}deg)`, opacity: 0.85 }} />
          ))}
        </div>
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: "15%", width: `calc(${archW} * 1.42)`, height: "2.2%", background: `linear-gradient(${shade(d.frame, 0.08)}, ${shade(d.frame, -0.14)})`, boxShadow: "0 6px 10px rgba(0,0,0,.22)", borderRadius: 3 }} />
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: "17.2%", width: `calc(${archW} * 1.24)`, height: "1.8%", background: `linear-gradient(${shade(d.frame, 0.1)}, ${shade(d.frame, -0.1)})`, boxShadow: "0 4px 8px rgba(0,0,0,.2)", borderRadius: 3 }} />

        {/* arch: outer molding, deep reveal, room, doors */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: "19%", width: archW, aspectRatio: "0.6" }}>
          <div className="absolute" style={{ inset: "-9% -14% 0 -14%", borderRadius: "50% 50% 0 0 / 31% 31% 0 0", background: `${noise(0.14)}, linear-gradient(90deg, ${shade(d.frame, -0.1)}, ${shade(d.frame, 0.06)} 25%, ${shade(d.frame, 0.1)} 50%, ${shade(d.frame, 0.04)} 75%, ${shade(d.frame, -0.12)})`, boxShadow: "0 20px 40px -18px rgba(0,0,0,.5), inset 0 0 0 1.5px rgba(255,255,255,.35)" }} />
          <div className="absolute" style={{ inset: "-4% -6% 0 -6%", borderRadius: "50% 50% 0 0 / 31% 31% 0 0", boxShadow: `inset 0 0 0 2px ${shade(d.frame, -0.18)}, 0 0 0 2px ${shade(d.frame, 0.12)}` }} />
          {/* keystone */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: "-11%", width: "13%", height: "8%", background: `linear-gradient(${shade(d.frame, 0.1)}, ${shade(d.frame, -0.1)})`, clipPath: "polygon(12% 0, 88% 0, 100% 100%, 0 100%)", boxShadow: "inset 0 -2px 3px rgba(0,0,0,.2)" }} />
          {/* deep reveal (jambs) */}
          <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: "50% 50% 0 0 / 31% 31% 0 0", boxShadow: "inset 10px 0 14px rgba(0,0,0,.28), inset -10px 0 14px rgba(0,0,0,.28), inset 0 14px 18px rgba(0,0,0,.25)" }}>
            <div className="absolute inset-[3%] overflow-hidden" style={{ borderRadius: "50% 50% 0 0 / 31% 31% 0 0", perspective: "1600px" }}>
              <Hall accent={accent} />
              <DoorLeaf side="left" color={doorColor} hardware={d.hardware} phase={phase} />
              <DoorLeaf side="right" color={doorColor} hardware={d.hardware} phase={phase} />
            </div>
          </div>
        </div>

        {garden && <LeafShadows />}

        {/* flowers framing the doorway */}
        {garden ? (
          <>
            <Bougainvillea colors={blooms} seed={1} count={90} style={{ left: "-8%", top: "-3%", width: "62%", height: "42%" }} />
            <Bougainvillea colors={blooms} seed={2} count={90} style={{ right: "-8%", top: "-4%", width: "60%", height: "40%" }} flip />
            <Bougainvillea colors={blooms} seed={3} count={50} style={{ left: "-6%", top: "30%", width: "24%", height: "34%" }} />
            <Bougainvillea colors={blooms} seed={4} count={50} style={{ right: "-6%", top: "28%", width: "24%", height: "36%" }} flip />
            <Pot colors={blooms} style={{ left: "2%", bottom: "12%", width: "17%" }} />
            <Pot colors={blooms} style={{ right: "2%", bottom: "12%", width: "17%" }} flip />
          </>
        ) : (
          <MarigoldStrings style={{ left: "-2%", top: "0", width: "104%", height: "48%" }} />
        )}

        <Lantern hardware={d.hardware} style={{ left: "5%", top: "40%", width: "9%", aspectRatio: "0.45" }} />
        <Lantern hardware={d.hardware} style={{ right: "5%", top: "40%", width: "9%", aspectRatio: "0.45" }} />

        {/* light spilling out of the opened doors */}
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 52%, rgba(255,246,222,1), rgba(255,246,222,0) 50%)", opacity: phase >= 2 ? 1 : 0, transition: "opacity 1.2s ease .2s" }} />
      </div>

      {/* tap to open */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[3.5%] flex flex-col items-center gap-[1cqh] transition-opacity duration-500" style={{ opacity: phase ? 0 : 1, zIndex: 5 }}>
        <span
          className="grid place-items-center rounded-full"
          style={{ width: "min(13cqw, 7.5cqh)", height: "min(13cqw, 7.5cqh)", background: "rgba(28,26,61,.82)", boxShadow: `0 0 0 2px ${d.hardware}, 0 8px 22px rgba(0,0,0,.35)`, animation: phase ? "none" : "hint-bob 2.4s ease-in-out infinite" }}
        >
          <KeyRound color={d.hardware} style={{ width: "48%", height: "48%" }} strokeWidth={1.6} />
        </span>
        <span className="text-[4.2cqw] font-semibold uppercase tracking-[0.32em] sm:text-[2.6cqw]" style={{ color: d.text, fontFamily: "var(--font-display), serif", textShadow: garden ? "0 1px 8px rgba(255,255,255,.6)" : "0 1px 8px rgba(0,0,0,.5)" }}>
          Tap to open
        </span>
        <span className="text-[3.6cqw] italic sm:text-[2.3cqw]" style={{ color: d.text, fontFamily: "var(--font-display), serif", opacity: 0.85 }}>
          An invitation awaits
        </span>
      </div>
    </button>
  );
}

const DOOR_STEPS = [[2, 1700]];
