"use client";

import { useEffect, useRef } from "react";
import { Disc3, VolumeX } from "lucide-react";

// Background music plays softly: it eases in to a low volume so it sits under the invitation.
const SOFT = 0.35;

export default function MusicPlayer({ url, title, playing, setPlaying }) {
  const audio = useRef(null);

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    if (!playing) return el.pause();
    el.volume = 0;
    el.play().catch(() => setPlaying(false));
    const start = performance.now();
    const t = setInterval(() => {
      const k = Math.min(1, (performance.now() - start) / 2500);
      el.volume = SOFT * k * k;
      if (k >= 1) clearInterval(t);
    }, 60);
    return () => clearInterval(t);
  }, [playing, setPlaying]);

  if (!url) return null;
  return (
    <>
      <audio ref={audio} src={url} loop preload="auto" />
      <button
        onClick={() => setPlaying((p) => !p)}
        className="fixed left-3 top-3 z-[50] grid h-11 w-11 place-items-center rounded-full shadow-lg md:bottom-5 md:left-4 md:top-auto md:h-12 md:w-12"
        style={{ background: "var(--inv-primary)", color: "var(--inv-on-primary)" }}
        aria-label={playing ? "Pause music" : "Play music"}
        title={title || "Music"}
      >
        {playing ? <Disc3 className="animate-spin-slow h-6 w-6" strokeWidth={1.6} /> : <VolumeX className="h-5 w-5" strokeWidth={1.8} />}
      </button>
    </>
  );
}
