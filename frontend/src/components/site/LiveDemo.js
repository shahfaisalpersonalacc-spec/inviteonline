"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import InvitationRenderer from "@/components/invite/InvitationRenderer";
import EntryScreen from "@/components/invite/entry/EntryScreen";
import { ENTRY_STYLES, THEMES, resolveTheme } from "@/data/themes";
import { demoInvitation } from "@/data/demoInvite";
import { cursorVars } from "@/lib/cursor";

// Which theme preset best matches each entrance (for the demo only).
const PRESET_FOR = {
  "burgundy-dove": "royal",
  "sage-monogram": "sage",
  "ivory-gatefold": "rose-gold",
  "linen-monogram": "blush",
  "sage-botanical": "emerald",
  "midnight-gold": "midnight",
  "door-garden": "marigold",
  "door-royal": "ruby",
  "door-castle": "sage",
  "door-pastel": "blush",
  "door-lattice": "champagne",
  "door-emerald": "emerald",
  "door-mural": "sage",
};

export function PhoneFrame({ children, className = "" }) {
  return (
    // `isolate` seals the phone's inner z-indexes (entrance, notch, buttons) inside it,
    // so they can never paint over the page's sticky navbar.
    <div className={`relative isolate rounded-[2.8rem] bg-ink p-[10px] shadow-[0_40px_80px_-30px_rgba(28,26,61,.55)] ${className}`}>
      <div className="absolute left-1/2 top-[14px] z-[80] h-[22px] w-[34%] -translate-x-1/2 rounded-full bg-ink" />
      <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] bg-white">{children}</div>
    </div>
  );
}

// The demo phone is always laid out at this size, then scaled down as a whole when the screen is
// narrower, so the invitation inside lines up exactly the same on every device.
const PHONE = { w: 320, h: 660 };

function useFitScale(ref, width) {
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, width]);
  return scale;
}

// Interactive phone: tap the envelope/door, then scroll the invitation inside.
export default function LiveDemo({ initialStyle = "burgundy-dove", showPicker = true }) {
  const fit = useRef(null);
  const scale = useFitScale(fit, PHONE.w);
  const [style, setStyle] = useState(initialStyle);
  const [run, setRun] = useState(0);
  const [opened, setOpened] = useState(false);
  const inv = useMemo(() => demoInvitation(PRESET_FOR[style] || "royal", style), [style]);

  const replay = (next = style) => {
    setStyle(next);
    setOpened(false);
    setRun((r) => r + 1);
  };

  return (
    <div className="flex flex-col items-center">
      {/* takes the available width (up to the phone's), and the scaled phone's height */}
      <div ref={fit} className="w-full" style={{ maxWidth: PHONE.w, height: PHONE.h * scale }}>
      {/* event-themed cursor, as on real invitations */}
      <div className="inv-cursor" style={{ ...cursorVars(inv.eventType || "wedding", resolveTheme(inv.theme || {})), width: PHONE.w, height: PHONE.h, transform: `scale(${scale})`, transformOrigin: "top left" }}>
      <PhoneFrame className="h-full w-full">
        <div className="no-scrollbar absolute inset-0 overflow-y-auto overflow-x-hidden">
          <InvitationRenderer invitation={inv} mode="demo" showFooter={false} />
        </div>
        {!opened && (
          <EntryScreen
            key={`${style}-${run}`}
            contained
            theme={inv.theme}
            title={inv.title}
            subtitle="Together with their families"
            date={inv.sections[0].data.date}
            onOpened={() => setOpened(true)}
          />
        )}
      </PhoneFrame>
      </div>
      </div>

      {/* below the phone, not on its screen, so it never covers the invitation's header */}
      <button
        onClick={() => replay()}
        disabled={!opened}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-cream shadow-lg transition hover:bg-ink/85 disabled:pointer-events-none disabled:opacity-0"
      >
        <RotateCcw className="h-3.5 w-3.5" /> Replay the opening
      </button>

      {showPicker && (
        <div className="mt-3 flex max-w-sm flex-wrap justify-center gap-1.5 sm:gap-2">
          {ENTRY_STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => replay(s.id)}
              title={s.label}
              aria-label={`Show the ${s.label} entrance`}
              className={`h-7 w-7 rounded-full border-2 shadow-sm transition hover:scale-110 sm:h-8 sm:w-8 ${style === s.id ? "border-ink ring-4 ring-gold/40" : "border-white"}`}
              style={{ background: `linear-gradient(135deg, ${s.swatch} 55%, ${THEMES[PRESET_FOR[s.id]]?.secondary || "#c9a24a"} 55%)` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
