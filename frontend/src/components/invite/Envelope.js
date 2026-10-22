"use client";

import { useState } from "react";

export default function Envelope({ title, subtitle, onOpen }) {
  const [opening, setOpening] = useState(false);

  function open() {
    setOpening(true);
    onOpen?.();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      style={{
        background: "radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--inv-secondary) 60%, var(--inv-bg)), var(--inv-bg) 70%)",
        animation: opening ? "envelope-out .9s ease-in forwards" : undefined,
      }}
    >
      <div className="animate-float-up relative w-full max-w-sm">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl" style={{ background: "var(--inv-surface)" }}>
          {/* envelope flap */}
          <svg viewBox="0 0 100 50" className="block w-full" preserveAspectRatio="none" aria-hidden>
            <path d="M0 0 L50 46 L100 0 Z" fill="var(--inv-primary)" opacity=".92" />
          </svg>
          <div className="px-6 pb-10 pt-4 text-center" style={{ color: "var(--inv-text)" }}>
            <p className="text-[11px] uppercase tracking-[0.3em] opacity-70">You are cordially invited</p>
            <h1 className="mt-3 text-4xl leading-tight break-words" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
              {title}
            </h1>
            {subtitle && <p className="mt-2 text-sm opacity-80">{subtitle}</p>}
            <button
              onClick={open}
              className="animate-pulse-ring mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold shadow-lg"
              style={{ background: "var(--inv-primary)", color: "var(--inv-on-primary)" }}
            >
              ✉ Open Invitation
            </button>
          </div>
          {/* wax seal */}
          <div
            className="absolute left-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xl shadow-lg"
            style={{ background: "var(--inv-secondary)", color: "var(--inv-primary)", top: "22%" }}
            aria-hidden
          >
            ❤
          </div>
        </div>
      </div>
    </div>
  );
}
