"use client";

import { useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
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

// A titanium phone: fixed colours, so it's the same device in light and dark. `small` for the gallery.
export function PhoneFrame({ children, className = "", small = false }) {
  return (
    // `isolate` seals the phone's inner z-indexes (entrance, island, buttons) inside it,
    // so they can never paint over the page's sticky navbar.
    <div
      className={`at-light relative isolate bg-[linear-gradient(145deg,#4a4760_0%,#17162b_26%,#0b0a15_62%,#3a3752_100%)] shadow-[0_40px_80px_-30px_rgba(10,8,30,.65),inset_0_0_0_1px_rgba(255,255,255,.16)] ${
        small ? "rounded-[2rem] p-[5px]" : "rounded-[2.9rem] p-[9px]"
      } ${className}`}
    >
      {/* side buttons */}
      <span className={`absolute -left-[3px] w-[3px] rounded-l-sm bg-[#2c2a42] ${small ? "top-[20%] h-8" : "top-[19%] h-14"}`} aria-hidden="true" />
      <span className={`absolute -right-[3px] w-[3px] rounded-r-sm bg-[#2c2a42] ${small ? "top-[26%] h-12" : "top-[25%] h-20"}`} aria-hidden="true" />
      <div className={`relative h-full w-full overflow-hidden bg-white ring-1 ring-black/70 ${small ? "rounded-[1.7rem]" : "rounded-[2.4rem]"}`}>
        {children}
        {/* the glass: a faint diagonal reflection */}
        <div className="pointer-events-none absolute inset-0 z-[85] bg-[linear-gradient(118deg,rgba(255,255,255,.16)_0%,rgba(255,255,255,0)_30%)]" aria-hidden="true" />
      </div>
      {/* dynamic island */}
      <div
        className={`absolute left-1/2 z-[90] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)] ${small ? "top-[11px] h-[13px] w-[30%]" : "top-[17px] h-[24px] w-[31%]"}`}
        aria-hidden="true"
      />
    </div>
  );
}

// The demo phone is always laid out at this size, then scaled down as a whole when the screen is
// narrower, so the invitation inside lines up exactly the same on every device.
const PHONE = { w: 320, h: 660 };
const noop = () => () => {};

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
  // the demo's dates are "today + N days": fixed at deploy time on the server, so show them only in the browser
  const mounted = useSyncExternalStore(noop, () => true, () => false);

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
          {mounted && <InvitationRenderer invitation={inv} mode="demo" showFooter={false} />}
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
