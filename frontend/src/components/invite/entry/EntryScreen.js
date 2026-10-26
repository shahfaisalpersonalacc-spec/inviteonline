"use client";

import { useState, useSyncExternalStore } from "react";
import { EnvelopeEntry, GatefoldEntry, ENVELOPES } from "./EnvelopeEntry";
import { PHOTO_DOORS, PhotoDoorEntry } from "./PhotoDoorEntry";
import { ENTRY_STYLES } from "@/data/themes";

const noop = () => () => {};
const useMounted = () => useSyncExternalStore(noop, () => true, () => false);

/**
 * The guest's first screen: an envelope, gatefold or door they tap to open.
 * `contained` renders inside a positioned parent (landing-page demo / editor preview)
 * instead of covering the viewport.
 */
export default function EntryScreen({ theme = {}, title, subtitle, date, onStart, onOpened, contained = false }) {
  const mounted = useMounted();
  const [leaving, setLeaving] = useState(false);
  const styleId = theme.entryStyle || "linen-monogram";
  const kind = ENTRY_STYLES.find((s) => s.id === styleId)?.kind || "envelope";
  const seal = { color: theme.sealColor, icon: theme.sealIcon, monogram: theme.monogram };

  const done = () => {
    setLeaving(true);
    setTimeout(() => onOpened?.(), 650);
  };

  const pos = contained ? "absolute" : "fixed";
  // Server render + first paint: a plain cover so the page never flashes before the entry appears.
  if (!mounted) {
    const cover = ENVELOPES[styleId]?.paper || PHOTO_DOORS[styleId]?.cover || "#f3e4c9";
    return <div className={`${pos} inset-0 z-[60]`} style={{ background: cover }} />;
  }

  const props = { styleId, seal, theme, title, subtitle, date, onStart, onDone: done };
  return (
    <div className={`${pos} inset-0 z-[60] transition-opacity duration-700`} style={{ opacity: leaving ? 0 : 1 }}>
      {kind === "door" ? <PhotoDoorEntry {...props} /> : kind === "gatefold" ? <GatefoldEntry {...props} /> : <EnvelopeEntry {...props} />}
    </div>
  );
}
