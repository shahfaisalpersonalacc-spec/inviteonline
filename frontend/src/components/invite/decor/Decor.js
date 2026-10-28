"use client";

import { FLORA, FloralCorner, FloralGarland } from "./flora";
import { BalloonCorner, CrimsonRoseCorner, DecoCorner, GeometricCorner, SkyCorner, Toran } from "./ornaments";
import { getTemplate } from "@/data/templates";
import { luminance } from "@/lib/color";

// Design rules of the invitation's template, or null for the classic (template-less) look.
export const designFor = (theme) => getTemplate(theme?.template)?.design || null;

// One decoration piece; `flip` mirrors it for the right-hand side.
export function DecorPiece({ decor, theme, className = "", style, seed }) {
  if (!decor) return null;
  if (FLORA[decor]) return <FloralCorner name={decor} className={className} style={style} seed={seed} />;
  const p = theme?.primary;
  const s = theme?.secondary;
  if (decor === "sky") return <SkyCorner a="#9cc3e6" b={s} gold="#e9c46a" className={className} style={style} />;
  if (decor === "balloons") return <BalloonCorner colors={[p, s, "#3cc6b5", "#7b6cf6"]} className={className} style={style} />;
  if (decor === "geometric") return <GeometricCorner gold={s} deep={p} className={className} style={style} />;
  if (decor === "deco") return <DecoCorner color={s} className={className} style={style} />;
  if (decor === "crimson") return <CrimsonRoseCorner className={className} style={style} seed={seed} />;
  return null;
}

// Corner decoration for a section: every other section, alternating sides, peeking in from the edge.
export function SectionDecor({ design, theme, index, count }) {
  if (!design?.decor) return null;
  const last = index === count - 1;
  const deco = design.decor === "deco";
  if (!last && (index % 2 === 0 || (deco && index % 4 !== 1))) return null;
  const right = Math.floor(index / 2) % 2 === 1;
  const size = deco ? "min(30cqw, 220px)" : "min(36cqw, 300px)";
  const piece = (side, vertical, key) => (
    <div
      key={key}
      className="pointer-events-none absolute"
      style={{
        width: size,
        [side]: deco ? "1.25rem" : "-5%",
        [vertical]: deco ? "1.25rem" : "-3%",
        transform: `${side === "right" ? "scaleX(-1)" : ""} ${vertical === "bottom" ? "scaleY(-1)" : ""}`,
        opacity: deco ? 0.9 : 1,
      }}
      aria-hidden
    >
      <DecorPiece decor={design.decor} theme={theme} className="block w-full" seed={index * 7 + 3} />
    </div>
  );
  // the closing section gets a pair at the bottom; others one at the top
  return last ? [piece("left", "bottom", "a"), piece("right", "bottom", "b")] : piece(right ? "right" : "left", "top", "a");
}

// ---------- dividers ----------
const seeded = (seed) => {
  let s = seed || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

function tornPath(seed) {
  const r = seeded(seed);
  const pts = [];
  for (let x = 0; x <= 1200; x += 18 + r() * 26) pts.push(`L${x.toFixed(0)} ${(10 + r() * 24 + (r() > 0.85 ? 8 : 0)).toFixed(1)}`);
  return `M0 60 L0 22 ${pts.join(" ")} L1200 20 L1200 60Z`;
}
const wavePath = "M0 60 L0 30 C150 0 300 0 450 26 C600 52 750 52 900 26 C1020 6 1110 8 1200 24 L1200 60Z";
const cloudPath = (() => {
  let d = "M0 60 L0 34";
  for (let x = 0; x < 1200; x += 80) d += ` A42 34 0 0 1 ${x + 80} 34`;
  return `${d} L1200 60Z`;
})();
const scallopPath = (() => {
  let d = "M0 60 L0 44";
  for (let x = 0; x < 1200; x += 60) d += ` L${x + 6} 44 Q${x + 30} 4 ${x + 54} 44`;
  return `${d} L1200 44 L1200 60Z`;
})();

// Drawn at the top of a section, rising into the one above, filled with this section's colour.
export function Divider({ design, theme, fill, seed = 1 }) {
  const dark = luminance(theme?.background || "#ffffff") < 0.3;
  const kind = design?.divider;
  if (!kind || kind === "none") return null;
  if (kind === "floral") {
    return (
      <div className="pointer-events-none absolute left-1/2 top-0 z-[2] w-[min(92cqw,640px)] -translate-x-1/2 -translate-y-1/2" aria-hidden>
        <FloralGarland name={design.decor} className="block w-full" seed={seed} />
      </div>
    );
  }
  if (kind === "line") {
    return (
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center" aria-hidden>
        <svg viewBox="0 0 360 20" className="w-[min(60cqw,360px)] -translate-y-1/2" fill="none" stroke={theme?.secondary || "#b8a27a"}>
          <path d="M0 10h160M200 10h160" strokeWidth="1" />
          <path d="M180 2l8 8-8 8-8-8Z" fill={theme?.secondary || "#b8a27a"} />
        </svg>
      </div>
    );
  }
  const d = kind === "torn" ? tornPath(seed * 31 + 7) : kind === "wave" ? wavePath : kind === "cloud" ? cloudPath : kind === "scallop" ? scallopPath : null;
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 top-0 block h-[clamp(18px,5cqw,44px)] w-full -translate-y-[calc(100%-1px)]"
      // the soft shadow lifts the tear on light pages; on dark pages it showed as black streaks
      style={{ filter: kind === "torn" && !dark ? "drop-shadow(0 -2px 2px rgba(0,0,0,.08))" : undefined }}
      aria-hidden
    >
      <path d={d} style={{ fill }} />
    </svg>
  );
}

// Hero ornaments for templates: corner pieces on framed layouts, the mehndi toran.
export function HeroDecor({ design, theme, layout }) {
  if (!design) return null;
  return (
    <>
      {design.toran && <Toran className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[clamp(90px,22cqw,170px)] w-full" />}
      {design.decor && !["floral", "photo-top", "full"].includes(layout) && !design.toran && (
        <>
          <div className="pointer-events-none absolute -left-[4%] -top-[3%] z-0" style={{ width: "min(40cqw, 320px)" }} aria-hidden>
            <DecorPiece decor={design.decor} theme={theme} className="block w-full" seed={11} />
          </div>
          <div className="pointer-events-none absolute -bottom-[3%] -right-[4%] z-0" style={{ width: "min(40cqw, 320px)", transform: "scale(-1,-1)" }} aria-hidden>
            <DecorPiece decor={design.decor} theme={theme} className="block w-full" seed={17} />
          </div>
        </>
      )}
    </>
  );
}

export { FloralCorner, FloralGarland };
