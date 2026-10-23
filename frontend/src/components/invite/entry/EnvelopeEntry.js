"use client";

import WaxSeal from "./WaxSeal";
import useOpenSequence from "./useOpenSequence";
import { noise, mottle, linen, damask, botanical, roseVine, starField } from "./textures";
import { shade } from "@/lib/color";
import { formatDate } from "@/lib/format";

export const ENVELOPES = {
  "burgundy-dove": { paper: "#6b1e2a", liner: "#3a0d15", tex: () => [noise(0.3), mottle(0.2)], ink: "#f3d9a4", cardInk: "#6b1e2a", seal: ["#c9a24a", "dove"] },
  "sage-monogram": { paper: "#9aa58a", liner: "#5b664d", tex: () => [damask("#eef2e4", "#3a4430"), mottle(0.28), noise(0.22)], ink: "#f5f2ea", cardInk: "#4f5d3a", seal: ["#b8646e", "monogram"] },
  "linen-monogram": { paper: "#ebe6dc", liner: "#7a2430", tex: () => [linen("#5a4a3a", 0.05), noise(0.2)], ink: "#7a2430", cardInk: "#7a2430", seal: ["#7a2430", "monogram"] },
  "sage-botanical": { paper: "#7f8b6b", liner: "#4b5540", tex: () => [botanical("#cdd5bb", "#353e2a"), noise(0.22)], ink: "#f1ead2", cardInk: "#4b5540", seal: ["#c9a24a", "butterfly"] },
  "midnight-gold": { paper: "#141a33", liner: "#0a0e1f", tex: () => [starField(), noise(0.22)], ink: "#e9d59a", cardInk: "#1c1a3d", seal: ["#c9a24a", "crest"], trim: "#c9a24a" },
  "ivory-gatefold": { paper: "#f3e9dc", liner: "#e9dcc8", tex: () => [roseVine(), noise(0.16)], ink: "#7c2b2b", cardInk: "#7c2b2b", seal: ["#7c2b2b", "heart"] },
};

const bg = (style, tone = 0) => `${style.tex().join(", ")}, ${shade(style.paper, tone)}`;

// Seal that splits in two and falls away when opened.
function BreakingSeal({ phase, color, icon, monogram, size = "min(34cqw, 21cqh)", top = "56%" }) {
  const half = (side) => ({
    position: "absolute",
    inset: 0,
    clipPath: side === "l" ? "polygon(0 0, 53% 0, 47% 100%, 0 100%)" : "polygon(53% 0, 100% 0, 100% 100%, 47% 100%)",
    transition: "transform .7s cubic-bezier(.5,0,.75,0), opacity .7s ease",
    transform: phase >= 1 ? `translate(${side === "l" ? "-22%" : "22%"}, 40%) rotate(${side === "l" ? -28 : 28}deg)` : "none",
    opacity: phase >= 1 ? 0 : 1,
  });
  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: "50%", top, width: size, aspectRatio: "1", animation: phase === 0 ? "seal-breathe 3s ease-in-out infinite" : undefined, transform: "translate(-50%, -50%)", zIndex: 6 }}
    >
      <div style={half("l")}>
        <WaxSeal color={color} icon={icon} monogram={monogram} className="h-full w-full" />
      </div>
      <div style={half("r")}>
        <WaxSeal color={color} icon={icon} monogram={monogram} className="h-full w-full" />
      </div>
    </div>
  );
}

// Gold corner flourish, drawn for the top-left corner and mirrored for the others.
function CornerFlourish({ style, gold }) {
  return (
    <svg viewBox="0 0 40 40" className="pointer-events-none absolute" style={{ width: "13cqw", height: "13cqw", ...style }} fill="none" stroke={gold} strokeWidth="1.1" strokeLinecap="round" aria-hidden="true">
      <path d="M2 30 C2 14 14 2 30 2" />
      <path d="M8 30 C8 18 18 8 30 8" opacity=".6" />
      <path d="M2 30 C6 26 10 26 12 30 C10 34 6 34 2 30Z" fill={gold} fillOpacity=".25" />
      <path d="M30 2 C26 6 26 10 30 12 C34 10 34 6 30 2Z" fill={gold} fillOpacity=".25" />
      <circle cx="14" cy="14" r="1.6" fill={gold} />
    </svg>
  );
}

// The invitation card revealed inside the envelope / gatefold. A fixed 3:4 portrait card that fits
// both the width and the height of any screen; every size inside is relative to the card (cqw).
function InnerCard({ title = "", subtitle, date, monogram, ink, phase }) {
  const gold = "#b8923a";
  const nameSize = title.length > 24 ? "7.4cqw" : title.length > 15 ? "9cqw" : "11cqw";
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: "min(84cqw, 63cqh)",
        aspectRatio: "3 / 4",
        transform: `translate(-50%, -50%)${phase >= 4 ? " scale(1.04)" : ""}`,
        transition: "transform 1s cubic-bezier(.2,.8,.2,1)",
        zIndex: 1,
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-[3px]"
        style={{ containerType: "inline-size", background: `${noise(0.07)}, linear-gradient(170deg, #fffdf8, #f7eedf)`, boxShadow: "0 30px 60px -22px rgba(0,0,0,.6)", color: "#4a3a32" }}
      >
        {/* double gold frame */}
        <div className="pointer-events-none absolute" style={{ inset: "3.5cqw", border: `1px solid ${gold}99` }} />
        <div className="pointer-events-none absolute" style={{ inset: "5cqw", border: `1px solid ${gold}55` }} />
        <CornerFlourish gold={gold} style={{ left: "2cqw", top: "2cqw" }} />
        <CornerFlourish gold={gold} style={{ right: "2cqw", top: "2cqw", transform: "scaleX(-1)" }} />
        <CornerFlourish gold={gold} style={{ left: "2cqw", bottom: "2cqw", transform: "scaleY(-1)" }} />
        <CornerFlourish gold={gold} style={{ right: "2cqw", bottom: "2cqw", transform: "scale(-1,-1)" }} />

        <div className="absolute flex flex-col items-center justify-center text-center" style={{ inset: "10cqw 9cqw" }}>
          {monogram && (
            <div className="grid shrink-0 place-items-center rounded-full" style={{ width: "22cqw", height: "22cqw", boxShadow: `inset 0 0 0 1px ${gold}aa, inset 0 0 0 4px #fffdf8, inset 0 0 0 5px ${gold}55` }}>
              <span className="foil-text leading-none" style={{ fontSize: monogram.length > 3 ? "6.5cqw" : "8.5cqw", fontFamily: "var(--font-great-vibes), cursive" }}>
                {monogram}
              </span>
            </div>
          )}
          <span className="font-semibold uppercase" style={{ marginTop: "5cqw", fontSize: "2.9cqw", letterSpacing: "0.38em", opacity: 0.7, fontFamily: "var(--font-display), serif" }}>
            You are invited
          </span>
          <h2 className="w-full break-words" style={{ marginTop: "2.5cqw", fontSize: nameSize, lineHeight: 1.12, color: ink, fontFamily: "var(--font-great-vibes), cursive", textWrap: "balance" }}>
            {title}
          </h2>
          <svg viewBox="0 0 200 24" style={{ width: "38cqw", marginTop: "2.5cqw" }} fill="none" stroke={gold} strokeWidth="1.2" aria-hidden="true">
            <path d="M100 12 C92 2 80 2 76 9 C73 15 80 19 84 14 M100 12 C108 2 120 2 124 9 C127 15 120 19 116 14 M76 12 L12 12 M124 12 L188 12" />
            <path d="M100 6 L104 12 L100 18 L96 12Z" fill={gold} />
          </svg>
          {subtitle && (
            <span className="italic" style={{ marginTop: "2.5cqw", fontSize: "4.2cqw", lineHeight: 1.35, opacity: 0.85, fontFamily: "var(--font-display), serif", textWrap: "balance" }}>
              {subtitle}
            </span>
          )}
          {date && (
            <span className="flex w-full items-center justify-center gap-[3cqw]" style={{ marginTop: "4cqw" }}>
              <span className="h-px flex-1" style={{ background: `${gold}99` }} />
              <span className="whitespace-nowrap font-semibold uppercase" style={{ fontSize: "3.5cqw", letterSpacing: "0.3em", color: ink, fontFamily: "var(--font-display), serif" }}>
                {formatDate(date, { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="h-px flex-1" style={{ background: `${gold}99` }} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Hint({ phase, color }) {
  return (
    <p
      className="pointer-events-none absolute inset-x-0 bottom-[6%] text-center text-[4.2cqw] italic transition-opacity duration-500 sm:text-[3cqw]"
      style={{
        color,
        fontFamily: "var(--font-display), serif",
        opacity: phase ? 0 : 1,
        // the bob animation also animates opacity, so it must stop for the fade-out to apply
        animation: phase ? "none" : "hint-bob 2.4s ease-in-out infinite",
        textShadow: "0 1px 6px rgba(0,0,0,.25)",
        zIndex: 7,
      }}
    >
      Tap the seal to open
    </p>
  );
}

export function EnvelopeEntry({ styleId, seal, title, subtitle, date, onStart, onDone }) {
  const s = ENVELOPES[styleId] || ENVELOPES["linen-monogram"];
  const { phase, open } = useOpenSequence(STEPS, 2700, { onStart, onDone });
  const color = seal.color || s.seal[0];
  const icon = seal.icon || s.seal[1];
  const flapShadow = "drop-shadow(0 6px 10px rgba(0,0,0,.28))";
  const crease = "linear-gradient(to bottom, rgba(255,255,255,.06), rgba(0,0,0,.08))";

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Open the invitation"
      className="absolute inset-0 block h-full w-full cursor-pointer overflow-hidden text-left"
      style={{ containerType: "size", perspective: "1600px", background: shade(s.liner, -0.1) }}
    >
      {/* envelope inside + card */}
      <div className="absolute inset-0" style={{ background: `${noise(0.25)}, ${s.liner}` }} />
      <InnerCard title={title} subtitle={subtitle} date={date} monogram={seal.monogram} ink={s.cardInk} phase={phase} />

      {/* pocket: side + bottom flaps */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 3, transition: "transform 1s cubic-bezier(.6,0,.3,1)", transform: phase >= 3 ? "translateY(108%)" : "none", filter: "drop-shadow(0 -3px 8px rgba(0,0,0,.25))" }}
      >
        <div className="absolute inset-0" style={{ background: bg(s, -0.07), clipPath: "polygon(0 0, 0 100%, 51% 56%)" }} />
        <div className="absolute inset-0" style={{ background: bg(s, -0.07), clipPath: "polygon(100% 0, 100% 100%, 49% 56%)" }} />
        <div className="absolute inset-0" style={{ background: `${crease}, ${bg(s, -0.02)}`, clipPath: "polygon(0 100%, 100% 100%, 100% 98%, 52% 52%, 48% 52%, 0 98%)" }} />
        {s.trim && <div className="absolute inset-[3%] rounded-sm border" style={{ borderColor: `${s.trim}66` }} />}
      </div>

      {/* top flap */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 4, transformOrigin: "50% 0", transition: "transform .95s cubic-bezier(.45,0,.2,1)", transform: phase >= 2 ? "rotateX(178deg)" : "none", filter: flapShadow, backfaceVisibility: "hidden" }}
      >
        <div className="absolute inset-0" style={{ background: `${crease}, ${bg(s, 0.03)}`, clipPath: "polygon(0 0, 100% 0, 100% 2%, 53.5% 55%, 50% 57%, 46.5% 55%, 0 2%)" }} />
      </div>

      <BreakingSeal phase={phase} color={color} icon={icon} monogram={seal.monogram} />
      <Hint phase={phase} color={s.ink} />
    </button>
  );
}

const STEPS = [
  [2, 450],
  [3, 1350],
  [4, 2000],
];

// Ivory gatefold: two scalloped panels tied with a satin ribbon, opening like doors.
export function GatefoldEntry({ styleId, seal, title, subtitle, date, onStart, onDone }) {
  const s = ENVELOPES[styleId] || ENVELOPES["ivory-gatefold"];
  const { phase, open } = useOpenSequence(GATE_STEPS, 2500, { onStart, onDone });
  const color = seal.color || s.seal[0];
  const icon = seal.icon || s.seal[1];
  const satin = "linear-gradient(180deg, #e3d3b9 0%, #fbf5ea 22%, #e8dbc4 48%, #fffaf1 70%, #dccab0 100%)";
  const panel = (side) => ({
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "50%",
    [side]: 0,
    zIndex: side === "left" ? 5 : 4,
    background: bg(s, side === "left" ? 0 : -0.03),
    transformOrigin: `${side} center`,
    transition: "transform 1.3s cubic-bezier(.45,0,.2,1)",
    transform: phase >= 2 ? `rotateY(${side === "left" ? -115 : 115}deg)` : "none",
    boxShadow: side === "left" ? "6px 0 16px rgba(0,0,0,.18)" : "inset 8px 0 14px rgba(0,0,0,.12)",
  });

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Open the invitation"
      className="absolute inset-0 block h-full w-full cursor-pointer overflow-hidden text-left"
      style={{ containerType: "size", perspective: "1800px", background: `${noise(0.2)}, #efe6d8` }}
    >
      <InnerCard title={title} subtitle={subtitle} date={date} monogram={seal.monogram} ink={s.cardInk} phase={phase} />

      <div style={panel("left")}>
        {/* scalloped edge */}
        <div
          className="absolute top-0 bottom-0"
          style={{ right: "-2.4cqw", width: "4.8cqw", background: `radial-gradient(circle at 0 50%, ${s.paper} 2.3cqw, transparent 2.4cqw) 0 0 / 4.8cqw 4.8cqw repeat-y`, filter: "drop-shadow(2px 0 2px rgba(0,0,0,.12))" }}
        />
        <div className="absolute inset-x-0" style={{ top: "45%", height: "10%", background: satin, boxShadow: "0 2px 6px rgba(0,0,0,.15)" }} />
      </div>
      <div style={panel("right")}>
        <div className="absolute inset-x-0" style={{ top: "45%", height: "10%", background: satin, boxShadow: "0 2px 6px rgba(0,0,0,.15)" }} />
      </div>

      {/* ribbon knot behind the seal */}
      <svg
        viewBox="0 0 200 120"
        className="pointer-events-none absolute"
        style={{ left: "50%", top: "50%", width: "min(70cqw, 42cqh)", transform: "translate(-50%, -50%)", zIndex: 6, transition: "opacity .5s", opacity: phase >= 1 ? 0 : 1 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="satinLoop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffaf1" />
            <stop offset=".5" stopColor="#e6d7be" />
            <stop offset="1" stopColor="#fbf3e5" />
          </linearGradient>
        </defs>
        <path d="M100 60 C 70 20 22 22 30 52 C 36 74 76 70 100 60Z" fill="url(#satinLoop)" stroke="#d9c8aa" />
        <path d="M100 60 C 130 20 178 22 170 52 C 164 74 124 70 100 60Z" fill="url(#satinLoop)" stroke="#d9c8aa" />
        <path d="M96 62 L72 116 L84 110 L92 118 L100 64Z M104 62 L128 116 L116 110 L108 118 L100 64Z" fill="url(#satinLoop)" stroke="#d9c8aa" />
      </svg>

      <BreakingSeal phase={phase} color={color} icon={icon} monogram={seal.monogram} top="50%" size="min(30cqw, 18cqh)" />
      <Hint phase={phase} color={s.ink} />
    </button>
  );
}

const GATE_STEPS = [
  [2, 450],
  [4, 1700],
];
