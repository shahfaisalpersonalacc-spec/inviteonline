"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { Image, Music, Palette, Pencil, Sparkles, Sticker } from "lucide-react";
import WaxSeal from "@/components/invite/entry/WaxSeal";

// Shown once after creating an invitation: dims the page, spotlights where editing starts (the ✎ Edit
// button on phones, the panel tabs on larger screens) and lists what can be customised.
export default function EditorTip({ onClose, onEdit }) {
  const [rect, setRect] = useState(null);
  const [phone, setPhone] = useState(true);

  useLayoutEffect(() => {
    const measure = () => {
      const small = window.innerWidth < 1024; // the editor's lg breakpoint
      const el = document.querySelector(small ? '[data-tip="edit"]' : '[data-tip="tabs"]');
      setPhone(small);
      setRect(el ? el.getBoundingClientRect() : null);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const pad = 6;
  const cardTop = rect ? rect.bottom + 16 : 96;
  // the card sits under the spotlight, always fully inside the screen (12px from each edge)
  const vw = typeof window === "undefined" ? 360 : window.innerWidth;
  const cardW = Math.min(340, vw - 24);
  const cardLeft = rect ? Math.min(Math.max(12, rect.left + rect.width / 2 - cardW / 2), vw - cardW - 12) : 12;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="editor-tip-title">
      {/* dim everything except the spotlight */}
      {rect ? (
        <div
          className="pointer-events-none absolute rounded-full ring-2 ring-brand-400 transition-all"
          style={{
            left: rect.left - pad,
            top: rect.top - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
            borderRadius: phone ? 9999 : 14,
            boxShadow: "0 0 0 9999px rgba(20, 18, 40, 0.62)",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-[rgba(20,18,40,0.62)]" />
      )}
      {/* clicking the dimmed area closes the tip */}
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close" onClick={onClose} />
      {/* the highlighted control stays usable: on phones it opens the editor */}
      {rect && phone && (
        <button
          type="button"
          onClick={onEdit}
          className="absolute rounded-full"
          style={{ left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }}
          aria-label="Start editing"
        />
      )}

      <div
        className="absolute max-h-[calc(100dvh-90px)] overflow-y-auto rounded-[1.75rem] bg-white shadow-[0_30px_80px_-20px_rgba(20,18,40,.55)] ring-1 ring-ink/5"
        style={{ top: cardTop, left: cardLeft, width: cardW }}
      >
        <span className="absolute -top-2 h-4 w-4 rotate-45 bg-[#fff1ec]" style={{ left: rect ? Math.min(Math.max(20, rect.left + rect.width / 2 - cardLeft - 8), cardW - 28) : 24 }} aria-hidden />

        {/* header: a soft blush band with confetti, the seal and the title */}
        <div className="relative overflow-hidden rounded-t-[1.75rem] bg-gradient-to-br from-[#fff1ec] via-[#fff8f1] to-[#fdf0d9] px-5 pb-4 pt-5">
          {[["8%", "18%", "#e8544a", 6], ["86%", "14%", "#f5c451", 7], ["72%", "62%", "#1c1a3d", 4], ["18%", "74%", "#f5c451", 5], ["94%", "48%", "#e8544a", 4]].map(([l, t, c, sz], i) => (
            <span key={i} className="absolute rounded-full opacity-70" style={{ left: l, top: t, width: sz, height: sz, background: c }} aria-hidden />
          ))}
          <div className="relative flex items-center gap-3">
            <WaxSeal color="#c93a31" icon="heart" className="w-11 shrink-0 drop-shadow-[0_6px_10px_rgba(121,42,37,.35)]" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-600">Your invitation is ready</p>
              <h2 id="editor-tip-title" className="mt-0.5 font-serif text-[1.35rem] leading-tight text-ink min-[360px]:text-2xl">
                {phone ? (
                  <>
                    Tap <span className="inline-grid h-7 w-7 translate-y-1 place-items-center rounded-full bg-brand-500 text-white shadow-md shadow-brand-500/40"><Pencil className="h-3.5 w-3.5" /></span> to make it <em className="text-brand-600">yours</em>
                  </>
                ) : (
                  <>
                    Make it <em className="text-brand-600">yours</em> from these tabs
                  </>
                )}
              </h2>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 pt-4">
          <p className="text-[13px] leading-relaxed text-ink-500">Change much more than the names and date:</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5">
            {[
              [Pencil, "Text & sections", "#e8544a"],
              [Image, "Photos & gallery", "#c9a24a"],
              [Palette, "Colours & fonts", "#7a5cc7"],
              [Sticker, "Stickers", "#2f9e7a"],
              [Music, "Background music", "#d9486f"],
              [Sparkles, "Link & password", "#1c1a3d"],
            ].map(([Icon, label, color]) => (
              <li key={label} className="flex items-center gap-2.5 text-[12px] font-semibold leading-tight text-ink">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl" style={{ background: `color-mix(in srgb, ${color} 13%, white)`, color }}>
                  <Icon className="h-4 w-4" strokeWidth={1.9} />
                </span>
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-2">
            {phone && (
              <button type="button" onClick={onEdit} className="btn-coral flex-1 !py-2.5">
                <Pencil className="h-4 w-4" /> Start editing
              </button>
            )}
            <button type="button" onClick={onClose} className={`${phone ? "btn-secondary !px-5" : "btn-coral flex-1"} !py-2.5`}>
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
