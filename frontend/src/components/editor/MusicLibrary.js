"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Music, Pause, Play } from "lucide-react";
import { musicFor } from "@/data/music";
import { eventTypeLabel } from "@/data/eventTypes";

// The built-in tracks: suggestions for this event type first, then the rest. Each can be previewed
// (one at a time) and chosen.
export default function MusicLibrary({ eventType, value, onPick }) {
  const { suggested, others } = musicFor(eventType);
  const [showAll, setShowAll] = useState(false);
  const [playing, setPlaying] = useState(null);
  const audio = useRef(null);

  // stop the preview when the panel closes
  useEffect(() => () => audio.current?.pause(), []);

  function preview(t) {
    if (!audio.current) {
      audio.current = new Audio();
      audio.current.volume = 0.6;
      audio.current.onended = () => setPlaying(null);
    }
    if (playing === t.id) {
      audio.current.pause();
      setPlaying(null);
      return;
    }
    audio.current.src = t.src;
    audio.current.currentTime = 0;
    audio.current.play().then(() => setPlaying(t.id)).catch(() => setPlaying(null));
  }

  const row = (t) => {
    const chosen = value === t.src;
    return (
      <li key={t.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition ${chosen ? "border-ink/40 bg-cream" : "border-ink/10 bg-white"}`}>
        <button
          type="button"
          onClick={() => preview(t)}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-cream transition hover:bg-ink-700"
          aria-label={playing === t.id ? `Pause ${t.title}` : `Play ${t.title}`}
        >
          {playing === t.id ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{t.title}</p>
          <p className="truncate text-xs text-ink-500">
            {t.mood} · {t.by}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onPick(t)}
          disabled={chosen}
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${chosen ? "text-ink" : "bg-ink/5 text-ink hover:bg-ink/10"}`}
        >
          {chosen ? (
            <>
              <Check className="h-3.5 w-3.5" /> Chosen
            </>
          ) : (
            "Use"
          )}
        </button>
      </li>
    );
  };

  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
        <Music className="h-3.5 w-3.5" /> Music library
      </p>
      {suggested.length > 0 && <p className="mb-2 text-xs text-ink-500">Suggested for {eventTypeLabel(eventType).toLowerCase()}</p>}
      <ul className="space-y-2">{suggested.map(row)}</ul>
      {showAll ? (
        <>
          <p className="mb-2 mt-4 text-xs text-ink-500">More tracks</p>
          <ul className="space-y-2">{others.map(row)}</ul>
        </>
      ) : (
        <button type="button" onClick={() => setShowAll(true)} className="mt-2 text-xs font-semibold text-ink underline underline-offset-2 hover:text-ink-700">
          Show all {suggested.length + others.length} tracks
        </button>
      )}
    </div>
  );
}
