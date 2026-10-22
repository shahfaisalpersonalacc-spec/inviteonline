"use client";

import { useSyncExternalStore } from "react";

// false during SSR + hydration, true afterwards. Particles are decorative, and the browser
// rewrites their inline styles (rounds decimals, expands `animation`), so they must not be
// server-rendered or hydration fails.
const noop = () => () => {};
const useMounted = () => useSyncExternalStore(noop, () => true, () => false);

const COUNT = 16;
const CONFETTI = ["#f43f5e", "#3b82f6", "#facc15", "#22c55e", "#a855f7", "#f97316"];

// Deterministic pseudo-random so server and client render the same markup.
const rand = (i, seed) => {
  const x = Math.sin(i * 9301 + seed * 49297) * 233280;
  return x - Math.floor(x);
};

function particle(kind, i, theme) {
  const size = 8 + rand(i, 1) * 12;
  switch (kind) {
    case "hearts":
      return (
        <svg viewBox="0 0 24 24" width={size + 4} height={size + 4} fill={i % 2 ? theme.primary : theme.secondary} opacity=".8">
          <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.5 3 4.5 6.9 4.5c2 0 3.5 1.1 5.1 3 1.6-1.9 3.1-3 5.1-3 3.9 0 6 4 4.5 7.3C19.5 16.4 12 21 12 21Z" />
        </svg>
      );
    case "confetti":
      return <span className="block" style={{ width: size * 0.6, height: size, background: CONFETTI[i % CONFETTI.length], borderRadius: 2 }} />;
    case "snow":
      return <span className="block rounded-full bg-white shadow" style={{ width: size * 0.6, height: size * 0.6, opacity: 0.85 }} />;
    default: // petals
      return (
        <span
          className="block"
          style={{ width: size, height: size * 0.75, background: i % 3 ? theme.secondary : theme.primary, borderRadius: "80% 0 80% 0", opacity: 0.75 }}
        />
      );
  }
}

export default function Effects({ kind, theme, fixed = true }) {
  const mounted = useMounted();
  if (!mounted || !kind || kind === "none") return null;
  const pos = fixed ? "fixed" : "absolute";

  if (kind === "stars") {
    return (
      <div className={`pointer-events-none ${pos} inset-0 z-[2] overflow-hidden`} aria-hidden>
        {Array.from({ length: 22 }, (_, i) => (
          <span
            key={i}
            className="fx-particle absolute"
            style={{
              left: `${rand(i, 2) * 100}%`,
              top: `${rand(i, 3) * 100}%`,
              color: i % 2 ? theme.secondary : theme.primary,
              fontSize: 8 + rand(i, 4) * 12,
              animation: `twinkle ${2 + rand(i, 5) * 3}s ease-in-out ${rand(i, 6) * 3}s infinite`,
            }}
          >
            ✦
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`pointer-events-none ${pos} inset-0 z-[2] overflow-hidden`} aria-hidden>
      {Array.from({ length: COUNT }, (_, i) => (
        <span
          key={i}
          className="fx-particle absolute -top-8"
          style={{
            left: `${rand(i, 7) * 100}%`,
            "--drift": `${(rand(i, 8) - 0.5) * 160}px`,
            "--spin": `${(rand(i, 9) > 0.5 ? 1 : -1) * (180 + rand(i, 10) * 360)}deg`,
            animation: `fall ${9 + rand(i, 11) * 9}s linear ${rand(i, 12) * 12}s infinite`,
          }}
        >
          {particle(kind, i, theme)}
        </span>
      ))}
    </div>
  );
}
