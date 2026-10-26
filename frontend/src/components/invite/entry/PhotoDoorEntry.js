"use client";

import { useEffect, useRef, useState } from "react";
import useOpenSequence from "./useOpenSequence";

// Photographic door entrances. Each uses a photo (public/entrances) and the doorway's position
// in it, as % of the image: x0..x1, y0..y1, the seam between the leaves, and `arch` (% of the
// doorway height its arched top takes; 0 = square top). A single door puts the seam on its latch
// edge (x0 or x1), so one leaf covers it and swings from the hinge side. The leaves are cut
// from the same photo, so closed they match it exactly; opening, they swing into the building in
// real 3D perspective onto a decorated wedding venue (a second photo, `scene`), and the camera walks in.
const oak = { src: "/entrances/door-oak-lilac.webp", ratio: 736 / 1104, x0: 21, x1: 78.4, y0: 18.8, y1: 86.2, seam: 49.9, arch: 8, light: "#fff0d2", cover: "#3b2a1e", scene: "/entrances/venue-courtyard.webp", scenePos: "50% 60%" };
export const PHOTO_DOORS = {
  // ids from earlier versions are kept so saved invitations keep working
  "door-royal": { src: "/entrances/door-blush-palace.webp", ratio: 736 / 1308, x0: 10.6, x1: 90, y0: 11, y1: 96.7, seam: 50.3, arch: 32, light: "#fff1d6", cover: "#5a3e34", scene: "/entrances/venue-palace-hall.webp", scenePos: "50% 55%" },
  "door-garden": oak,
  "door-carved": oak,
  "door-castle": { src: "/entrances/door-rose-arch.webp", ratio: 736 / 1104, x0: 29, x1: 74.5, y0: 18, y1: 77.6, seam: 50, arch: 20, light: "#fff4e0", cover: "#3a2a2a", scene: "/entrances/venue-floral-aisle.webp", scenePos: "50% 50%" },
  "door-lattice": { src: "/entrances/door-ivory-arch.webp", ratio: 736 / 1308, x0: 20.1, x1: 79.5, y0: 14, y1: 80.3, seam: 49.6, arch: 24, light: "#fff6e6", cover: "#4a3a2e", scene: "/entrances/venue-chandelier-hall.webp", scenePos: "50% 45%" },
  "door-pastel": { src: "/entrances/door-rose-cottage.webp", ratio: 736 / 1104, x0: 33.7, x1: 66.7, y0: 30.1, y1: 77, seam: 33.7, arch: 0, light: "#fff3dc", cover: "#5a4a44", scene: "/entrances/venue-glass-tent.webp", scenePos: "50% 50%" },
  "door-golden": { src: "/entrances/door-champagne.webp", ratio: 736 / 1307, x0: 24.5, x1: 76.4, y0: 13.4, y1: 84.5, seam: 50.1, arch: 0, light: "#fff2d8", cover: "#4a3c30", scene: "/entrances/venue-reception.webp", scenePos: "50% 50%" },
  "door-emerald": { src: "/entrances/door-emerald.webp", ratio: 453 / 680, x0: 24.3, x1: 76.2, y0: 14.7, y1: 95.3, seam: 50.3, arch: 19, light: "#fff4e0", cover: "#3a3630", scene: "/entrances/venue-palace-hall.webp", scenePos: "50% 50%" },
  "door-mural": { src: "/entrances/door-painted-garden.webp", ratio: 736 / 930, x0: 36.7, x1: 61.8, y0: 47.6, y1: 87.6, seam: 49.5, arch: 0, light: "#fff3dc", cover: "#4a4434", scene: "/entrances/venue-floral-aisle.webp", scenePos: "50% 50%" },
};

// Phases: 0 closed · 1 unlatched (light at the seam) · 2 swinging open · 3 through the doorway
const STEPS = [
  [2, 420],
  [3, 2350],
];
const TOTAL = 3150;

// Arched top as a polygon (in % of the doorway box), sampled from an ellipse.
function archClip(arch) {
  if (!arch) return undefined;
  const pts = Array.from({ length: 25 }, (_, i) => {
    const t = Math.PI - (Math.PI * i) / 24;
    return `${(50 + 50 * Math.cos(t)).toFixed(2)}% ${(arch - arch * Math.sin(t)).toFixed(2)}%`;
  });
  return `polygon(0% 100%, ${pts.join(", ")}, 100% 100%)`;
}

// The entrance's own size (it fills the screen, or a preview frame when `contained`).
function useBox(ref) {
  const [box, setBox] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return box;
}

export function PhotoDoorEntry({ styleId, title, onStart, onDone }) {
  const d = PHOTO_DOORS[styleId] || PHOTO_DOORS["door-royal"];
  const root = useRef(null);
  const box = useBox(root);
  const [loaded, setLoaded] = useState(false);
  const { phase, open } = useOpenSequence(STEPS, TOTAL, { onStart, onDone });

  // Fit: phones and portrait frames are always filled edge to edge (sides cropped around the
  // doorway's middle, sharp, never letterboxed). Landscape screens show the whole photo at full
  // height, centred on a plain dark tone taken from the photo. (Not the seam: a single door's seam
  // is its latch edge.)
  let stage = null;
  if (box) {
    const portrait = box.w / box.h < 0.9;
    const h = portrait ? Math.max(box.w / d.ratio, box.h) : box.h; // photo height in px
    const w = h * d.ratio;
    const centre = box.w / 2 - ((d.x0 + d.x1) / 200) * w;
    const left = w > box.w ? Math.min(0, Math.max(box.w - w, centre)) : centre;
    const doorMid = (((d.y0 + d.y1) / 2) / 100) * h;
    const top = h > box.h ? Math.min(0, Math.max(box.h - h, box.h / 2 - doorMid)) : 0;
    stage = { w, h, left, top };
  }
  const px = (pct, total) => (pct / 100) * total;
  const door = stage && {
    left: px(d.x0, stage.w),
    top: px(d.y0, stage.h),
    width: px(d.x1 - d.x0, stage.w),
    height: px(d.y1 - d.y0, stage.h),
    seam: px(d.seam - d.x0, stage.w),
  };
  const swing = "transform 1.9s cubic-bezier(.55,.06,.2,1)";
  const leaf = (side) => {
    const isLeft = side === "left";
    const width = isLeft ? door.seam : door.width - door.seam;
    const angle = phase >= 2 ? 84 : phase === 1 ? 4 : 0;
    return (
      <div
        className="absolute top-0 h-full overflow-hidden"
        style={{
          [side]: 0,
          width,
          transformOrigin: isLeft ? "left center" : "right center",
          transform: `rotateY(${isLeft ? angle : -angle}deg)`,
          transition: phase === 1 ? "transform .4s ease-out" : swing,
          backfaceVisibility: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={d.src}
          alt=""
          draggable={false}
          className="absolute max-w-none select-none"
          style={{ width: stage.w, height: stage.h, left: -(door.left + (isLeft ? 0 : door.seam)), top: -door.top }}
        />
        {/* turning away from the light outside: the face darkens, the free edge reads as the door's thickness */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${isLeft ? 90 : 270}deg, rgba(0,0,0,.15), rgba(0,0,0,.55))`,
            opacity: phase >= 2 ? 1 : 0,
            transition: "opacity 1.6s ease",
            boxShadow: `inset ${isLeft ? -6 : 6}px 0 10px rgba(0,0,0,.55)`,
          }}
        />
      </div>
    );
  };

  return (
    // as the camera starts through the doorway the whole entrance fades, straight into the invitation
    <div ref={root} className="absolute inset-0 overflow-hidden" style={{ background: d.cover, containerType: "size", opacity: phase >= 3 ? 0 : 1, transition: "opacity .55s ease" }}>
      {stage && (
        <>

          {/* camera: drifts slightly while waiting, then glides through the doorway */}
          <div
            className="absolute"
            style={{
              left: stage.left,
              top: stage.top,
              width: stage.w,
              height: stage.h,
              transformOrigin: `${door.left + door.width / 2}px ${door.top + door.height * 0.55}px`,
              transform: phase >= 3 ? "scale(1.35)" : "scale(1)",
              transition: phase >= 3 ? "transform .9s cubic-bezier(.4,0,.6,1)" : "transform .6s ease",
              opacity: loaded ? 1 : 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.src} alt="" fetchPriority="high" onLoad={() => setLoaded(true)} className="absolute inset-0 h-full w-full max-w-none select-none" draggable={false} />

            {/* the doorway: light beyond, leaves in perspective, clipped to the frame's shape */}
            <div
              className="absolute"
              style={{ left: door.left, top: door.top, width: door.width, height: door.height, perspective: `${door.width * 2.4}px`, clipPath: archClip(d.arch) }}
            >
              {/* beyond the doors: the decorated venue, slightly larger so it can drift in as the doors part */}
              <div className="absolute inset-0 overflow-hidden" style={{ opacity: phase >= 1 ? 1 : 0, transition: "opacity .4s ease" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.scene}
                  alt=""
                  draggable={false}
                  className="absolute inset-0 h-full w-full select-none object-cover"
                  style={{ objectPosition: d.scenePos, transform: phase >= 2 ? "scale(1.04)" : "scale(1.18)", transition: "transform 3.2s cubic-bezier(.2,.7,.2,1)", filter: "saturate(1.08)" }}
                />
                {/* a faint warm glow from the venue lights */}
                <div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse 60% 45% at 50% 42%, ${d.light}66, transparent 70%)`, mixBlendMode: "screen", opacity: phase >= 2 ? 0.3 : 0.15, transition: "opacity 1.6s ease" }}
                />
                {/* the shadow of the doorway on the near ground */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.18), transparent 25%, transparent 80%, rgba(0,0,0,.2))" }} />
              </div>
              {leaf("left")}
              {leaf("right")}
              {/* first crack of light at the seam */}
              <div
                className="absolute inset-y-0 w-[3px] -translate-x-1/2"
                style={{ left: door.seam, background: `linear-gradient(transparent, ${d.light}, #fff, ${d.light}, transparent)`, boxShadow: `0 0 24px 6px ${d.light}`, opacity: phase === 1 ? 1 : 0, transition: "opacity .35s ease" }}
              />
            </div>

            {/* light spilling out over the threshold and the frame */}
            <div
              className="pointer-events-none absolute"
              style={{
                left: door.left - door.width * 0.25,
                width: door.width * 1.5,
                top: door.top + door.height * 0.92,
                height: door.height * 0.45,
                background: `radial-gradient(ellipse 48% 70% at 50% 0%, ${d.light}aa, transparent 72%)`,
                mixBlendMode: "screen",
                filter: "blur(6px)",
                opacity: phase >= 2 ? 1 : 0,
                transition: "opacity 1.6s ease .3s",
              }}
            />
            {/* bloom: the frame and wall around the doorway catch the light */}
            <div
              className="pointer-events-none absolute"
              style={{
                left: door.left - door.width * 0.7,
                width: door.width * 2.4,
                top: door.top - door.height * 0.4,
                height: door.height * 1.8,
                background: `radial-gradient(ellipse 40% 40% at 50% 55%, ${d.light}, color-mix(in srgb, ${d.light} 40%, transparent) 45%, transparent 72%)`,
                mixBlendMode: "screen",
                filter: "blur(10px)",
                opacity: phase >= 2 ? 0.35 : 0,
                transition: "opacity 1.8s ease .5s",
              }}
            />
          </div>


          {/* names and the invitation to tap, on a soft shade at the bottom */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24 text-center text-white"
            style={{ background: "linear-gradient(transparent, rgba(0,0,0,.62))", opacity: phase === 0 ? 1 : 0, transition: "opacity .5s ease" }}
          >
            {/* sized to the entrance itself (it may be a small preview frame), not the browser window */}
            {title && (
              <p className="leading-tight [text-shadow:0_2px_16px_rgba(0,0,0,.5)]" style={{ fontSize: "clamp(1.15rem, 11cqw, 3.4rem)", fontFamily: "var(--inv-font-heading, var(--font-great-vibes)), cursive" }}>
                {title}
              </p>
            )}
            <p className="mt-3 animate-pulse whitespace-nowrap font-semibold uppercase opacity-90" style={{ fontSize: "clamp(7px, 2.8cqw, 11px)", letterSpacing: "clamp(0.15em, 1cqw, 0.4em)" }}>
              Tap the door to open
            </p>
          </div>
        </>
      )}

      <button type="button" onClick={open} disabled={phase !== 0} aria-label="Open the invitation" className="absolute inset-0 z-10 cursor-pointer disabled:cursor-default" />
    </div>
  );
}
