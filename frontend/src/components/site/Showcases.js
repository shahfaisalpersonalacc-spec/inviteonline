"use client";

import { useState } from "react";
import EntryScreen from "@/components/invite/entry/EntryScreen";
import { themeVars } from "@/components/invite/InvitationRenderer";
import { Scratch } from "@/components/invite/sections/extra";
import { ENTRY_STYLES, THEMES } from "@/data/themes";
import { PhoneFrame } from "./LiveDemo";

const SAMPLE_DATE = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 45);
  return d.toISOString();
})();

// Grid of every entrance; each one opens when tapped, then resets.
// On phones it is a swipeable rail; from 640px a 4-column grid.
export function EntranceGallery({ dark = false }) {
  const [runs, setRuns] = useState({});
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-x-4 sm:gap-y-12 sm:overflow-visible sm:px-0">
      {ENTRY_STYLES.map((s, i) => (
        <figure key={s.id} className="flex shrink-0 snap-center flex-col items-center">
          <PhoneFrame className={`h-[340px] w-[170px] !rounded-[2rem] !p-[6px] lg:h-[380px] lg:w-[190px] ${dark ? "ring-1 ring-white/15" : ""}`}>
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
          <figcaption className={`mt-4 text-center font-serif text-lg ${dark ? "text-cream" : "text-ink"}`}>
            <span className={`mr-1.5 text-sm italic ${dark ? "text-gold/70" : "text-ink/40"}`}>{String(i + 1).padStart(2, "0")}</span>
            {s.label}
          </figcaption>
          <span className={`text-xs ${dark ? "text-cream/50" : "text-ink-500"}`}>{s.kind === "door" ? "Doors" : s.kind === "gatefold" ? "Gatefold" : "Wax-sealed envelope"}</span>
        </figure>
      ))}
    </div>
  );
}

// The real scratch card, themed for the landing page.
export function ScratchDemo() {
  const t = THEMES.royal;
  return (
    <div className="@container rounded-[2rem]" style={{ ...themeVars(t), background: "#fbf6f1", color: t.text, fontFamily: "var(--font-display)" }}>
      <Scratch data={{ heading: "Save the date", text: "Scratch the gold foil with your finger", date: SAMPLE_DATE }} />
    </div>
  );
}
