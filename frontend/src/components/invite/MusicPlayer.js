"use client";

import { useEffect, useRef } from "react";

export default function MusicPlayer({ url, title, playing, setPlaying }) {
  const audio = useRef(null);

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    if (playing) el.play().catch(() => setPlaying(false));
    else el.pause();
  }, [playing, setPlaying]);

  if (!url) return null;
  return (
    <>
      <audio ref={audio} src={url} loop preload="auto" />
      <button
        onClick={() => setPlaying((p) => !p)}
        className="fixed bottom-5 left-4 z-[50] grid h-12 w-12 place-items-center rounded-full shadow-xl"
        style={{ background: "var(--inv-primary)", color: "var(--inv-on-primary)" }}
        aria-label={playing ? "Pause music" : "Play music"}
        title={title || "Music"}
      >
        <span className={`text-xl ${playing ? "animate-spin-slow" : ""}`}>{playing ? "💿" : "🔇"}</span>
      </button>
    </>
  );
}
