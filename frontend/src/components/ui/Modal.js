"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({ open, onClose, title, children, size = "max-w-md" }) {
  const panel = useRef(null);
  // callers pass a new onClose each render; read it from a ref so a parent re-render doesn't
  // re-run the effect below (which would move focus back to the first control)
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement; // restore focus here when the dialog closes
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // move focus into the dialog (first control, else the panel itself)
    const first = panel.current?.querySelector(FOCUSABLE);
    (first || panel.current)?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") return close.current?.();
      if (e.key !== "Tab" || !panel.current) return;
      // keep Tab / Shift+Tab inside the dialog
      const items = [...panel.current.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const [firstEl, lastEl] = [items[0], items[items.length - 1]];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`animate-float-up max-h-[92vh] w-full ${size} overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl outline-none sm:rounded-3xl sm:p-6`}
        style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-ink">{title}</h2>
            <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-ink-500 hover:bg-ink/5 hover:text-ink" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
