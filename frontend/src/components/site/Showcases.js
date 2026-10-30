"use client";

import { useState } from "react";
import EntryScreen from "@/components/invite/entry/EntryScreen";
import { themeVars } from "@/components/invite/InvitationRenderer";
import { Scratch } from "@/components/invite/sections/extra";
import { ENTRY_STYLES, THEMES } from "@/data/themes";
import { PhoneFrame } from "./LiveDemo";
import { useDarkMode } from "@/lib/theme";

const SAMPLE_DATE = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 45);
  return d.toISOString();
})();

// Grid of every entrance; each one opens when tapped, then resets.
// On phones it is a swipeable rail (two phones and a peek of the next); from 640px a 4-column grid.
export function EntranceGallery({ dark = false }) {
  const [runs, setRuns] = useState({});
  return (
    <div className="no-scrollbar -mx-4 flex scroll-px-4 snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-x-4 sm:gap-y-12 sm:overflow-visible sm:px-0">
      {ENTRY_STYLES.map((s, i) => (
        <figure key={s.id} className="flex w-[140px] shrink-0 snap-start flex-col items-center sm:w-auto">
          <PhoneFrame small className="h-[280px] w-[140px] sm:h-[340px] sm:w-[170px] lg:h-[380px] lg:w-[190px]">
            <div className="absolute inset-0 grid place-items-center bg-cream text-center">
              <span className="px-3 font-script text-3xl text-ink">Welcome!</span>
            </div>
            <EntryScreen
              key={runs[s.id] || 0}
              contained
              theme={{ entryStyle: s.id, monogram: "A&A" }}
              title="Ayesha & Ahmed"
              date={SAMPLE_DATE}
              onOpened={() => setTimeout(() => setRuns((r) => ({ ...r, [s.id]: (r[s.id] || 0) + 1 })), 900)}
            />
          </PhoneFrame>
          <figcaption className={`mt-3 text-center font-serif text-[15px] leading-tight sm:mt-4 sm:text-lg ${dark ? "text-cream" : "text-ink"}`}>
            <span className={`mr-1 text-xs italic sm:mr-1.5 sm:text-sm ${dark ? "text-gold/70" : "text-ink/40"}`}>{String(i + 1).padStart(2, "0")}</span>
            {s.label}
          </figcaption>
          <span className={`mt-0.5 text-[11px] sm:text-xs ${dark ? "text-cream/50" : "text-ink-500"}`}>{s.kind === "door" ? "Doors" : s.kind === "gatefold" ? "Gatefold" : "Wax-sealed envelope"}</span>
        </figure>
      ))}
    </div>
  );
}

// The real scratch card, themed for the landing page: burgundy on ivory, or midnight and gold in dark mode.
export function ScratchDemo() {
  const t = useDarkMode() ? THEMES.midnight : THEMES.royal;
  return (
    <div className="@container rounded-[2rem]" style={{ ...themeVars(t), background: t.background, color: t.text, fontFamily: "var(--font-display)" }}>
      <Scratch data={{ heading: "Save the date", text: "Scratch the gold foil with your finger", date: SAMPLE_DATE }} />
    </div>
  );
}
