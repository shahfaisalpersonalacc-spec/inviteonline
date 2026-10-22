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
export function EntranceGallery() {
  const [runs, setRuns] = useState({});
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
      {ENTRY_STYLES.map((s) => (
        <figure key={s.id} className="flex flex-col items-center">
          <PhoneFrame className="h-[300px] w-[150px] !rounded-[2rem] !p-[6px] sm:h-[340px] sm:w-[170px]">
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
          <figcaption className="mt-3 text-sm font-semibold text-ink">{s.label}</figcaption>
          <span className="text-xs text-ink-500">{s.kind === "door" ? "Doors" : s.kind === "gatefold" ? "Gatefold" : "Wax-sealed envelope"}</span>
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
