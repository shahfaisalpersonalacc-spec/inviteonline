"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import InvitationRenderer from "@/components/invite/InvitationRenderer";
import EntryScreen from "@/components/invite/entry/EntryScreen";
import { ENTRY_STYLES, THEMES } from "@/data/themes";
import { demoInvitation } from "@/data/demoInvite";

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
};

export function PhoneFrame({ children, className = "" }) {
  return (
    <div className={`relative rounded-[2.8rem] bg-ink p-[10px] shadow-[0_40px_80px_-30px_rgba(28,26,61,.55)] ${className}`}>
      <div className="absolute left-1/2 top-[14px] z-[80] h-[22px] w-[34%] -translate-x-1/2 rounded-full bg-ink" />
      <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] bg-white">{children}</div>
    </div>
  );
}

// Interactive phone: tap the envelope/door, then scroll the invitation inside.
export default function LiveDemo({ initialStyle = "burgundy-dove", showPicker = true, className = "h-[620px] w-[300px] sm:h-[660px] sm:w-[320px]" }) {
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
      <PhoneFrame className={className}>
        <div className="no-scrollbar absolute inset-0 overflow-y-auto overflow-x-hidden">
          <InvitationRenderer invitation={inv} mode="editor" showFooter={false} />
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
        {opened && (
          <button
            onClick={() => replay()}
            className="absolute right-3 top-12 z-[70] inline-flex items-center gap-1.5 rounded-full bg-ink/85 px-3 py-1.5 text-xs font-semibold text-cream shadow-lg backdrop-blur"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Replay
          </button>
        )}
      </PhoneFrame>

      {showPicker && (
        <div className="mt-6 flex max-w-sm flex-wrap justify-center gap-2">
          {ENTRY_STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => replay(s.id)}
              title={s.label}
              aria-label={`Show the ${s.label} entrance`}
              className={`h-8 w-8 rounded-full border-2 shadow-sm transition hover:scale-110 ${style === s.id ? "border-ink ring-4 ring-gold/40" : "border-white"}`}
              style={{ background: `linear-gradient(135deg, ${s.swatch} 55%, ${THEMES[PRESET_FOR[s.id]]?.secondary || "#c9a24a"} 55%)` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
