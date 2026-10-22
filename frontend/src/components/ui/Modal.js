"use client";

import { useEffect } from "react";

export default function Modal({ open, onClose, title, children, size = "max-w-md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className={`animate-float-up max-h-[92vh] w-full ${size} overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
            <button onClick={onClose} className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100" aria-label="Close">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
