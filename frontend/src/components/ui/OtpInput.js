"use client";

import { useRef } from "react";

const LENGTH = 6;

// Six single-digit boxes backed by one string value. Typing advances, Backspace goes back,
// and pasting (or SMS/email autofill into the first box) fills all of them.
export default function OtpInput({ value, onChange, autoFocus = true }) {
  const refs = useRef([]);
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] || "");

  function fill(from, text) {
    const clean = text.replace(/\D/g, "");
    if (!clean) return;
    const next = (value.slice(0, from) + clean).slice(0, LENGTH);
    onChange(next);
    refs.current[Math.min(next.length, LENGTH - 1)]?.focus();
  }

  function onKeyDown(i, e) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const at = digits[i] ? i : Math.max(i - 1, 0);
      onChange(value.slice(0, at));
      refs.current[at]?.focus();
    } else if (e.key === "ArrowLeft") refs.current[i - 1]?.focus();
    else if (e.key === "ArrowRight") refs.current[i + 1]?.focus();
  }

  return (
    <div className="flex justify-between gap-2" onPaste={(e) => { e.preventDefault(); fill(0, e.clipboardData.getData("text")); }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={d}
          onChange={(e) => fill(Math.min(i, value.length), e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          autoFocus={autoFocus && i === 0}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${i + 1}`}
          className="input h-14 w-full min-w-0 !px-0 text-center text-2xl font-semibold"
        />
      ))}
    </div>
  );
}
