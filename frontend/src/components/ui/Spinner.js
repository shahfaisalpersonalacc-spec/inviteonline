import WaxSeal from "@/components/invite/entry/WaxSeal";

export default function Spinner({ className = "h-5 w-5" }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-label="Loading">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity=".25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// Page loader: a breathing wax seal inside a turning gold ring, centred on the screen (not just
// the space under the header), and click-through so it never blocks the navbar.
export function FullPageSpinner() {
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-0 z-30 grid place-items-center">
      <div className="flex flex-col items-center">
        <div className="relative grid h-28 w-28 place-items-center">
          {/* soft glow */}
          <div className="absolute inset-3 rounded-full bg-gold/25 blur-xl" />
          {/* faint track + turning gold arc */}
          <svg className="absolute inset-0 h-full w-full animate-[spin_1.6s_linear_infinite] motion-reduce:animate-none" viewBox="0 0 112 112" fill="none">
            <defs>
              <linearGradient id="loader-arc" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f5c451" stopOpacity="0" />
                <stop offset="1" stopColor="#c9a24a" />
              </linearGradient>
            </defs>
            <circle cx="56" cy="56" r="52" stroke="#c9a24a" strokeOpacity=".18" strokeWidth="2" />
            <path d="M56 4 A52 52 0 0 1 108 56" stroke="url(#loader-arc)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="108" cy="56" r="3.5" fill="#f5c451" />
          </svg>
          <WaxSeal color="#c93a31" icon="heart" className="relative w-16 animate-[loader-breathe_1.8s_ease-in-out_infinite] drop-shadow-[0_8px_14px_rgba(121,42,37,.35)] motion-reduce:animate-none" />
        </div>
        {/* the dots hang off to the right so the word itself stays centred under the seal */}
        <p className="relative mt-5 pl-[0.35em] text-[11px] font-bold uppercase tracking-[0.35em] text-ink-500">
          Loading<span className="absolute left-full top-0 after:animate-[loader-dots_1.6s_linear_infinite] after:content-['']" />
        </p>
      </div>
    </div>
  );
}
