"use client";

import { useEffect, useState } from "react";

const STEPS = ["Choosing your theme…", "Writing the sample content…", "Setting up your entrance…", "Adding the finishing touches…"];

// Full-screen loader built from the InviteOnline logo: the invitation card keeps rising out of the
// envelope, the sparkle twinkles and confetti pops, while short status lines rotate underneath.
// Used while a new invitation is created and the editor opens (one continuous animation).
export default function LogoLoader({ title = "Preparing your invitation", steps = STEPS }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % steps.length), 1600);
    return () => clearInterval(t);
  }, [steps.length]);

  return (
    <div role="status" aria-live="polite" className="fixed inset-0 z-[95] grid place-items-center bg-cream/95 backdrop-blur-sm">
      <div className="flex flex-col items-center px-6 text-center">
        <div className="relative h-36 w-36">
          {/* soft glow */}
          <div className="absolute inset-4 rounded-full bg-brand-200/50 blur-2xl" />
          <svg viewBox="0 0 64 64" className="relative h-full w-full overflow-visible" aria-hidden="true">
            {/* back of the envelope and its open flap */}
            <path d="M8 30 L32 12 L56 30 Z" fill="#BE453D" className="origin-[32px_30px] animate-[ll-flap_2.4s_ease-in-out_infinite]" />
            <rect x="8" y="28" width="48" height="28" rx="7" fill="#E8544A" />
            {/* the card, rising out and sinking back */}
            <g className="animate-[ll-card_2.4s_ease-in-out_infinite]">
              <rect x="16" y="9" width="32" height="35" rx="4" fill="#FFF8F1" />
              <circle cx="32" cy="18" r="4" fill="#F5C451" />
              <rect x="23" y="26" width="18" height="3" rx="1.5" fill="#1C1A3D" />
              <rect x="26" y="32" width="12" height="2.5" rx="1.25" fill="#F4A9A2" />
            </g>
            {/* front pocket covers the card's lower half */}
            <path d="M8 36 L32 50 L56 36 L56 49 Q56 56 49 56 L15 56 Q8 56 8 49 Z" fill="#BE453D" />
            <path d="M8 36 L32 50 L56 36 L56 39 L32 53 L8 39 Z" fill="#9E3932" />
            {/* sparkle and confetti */}
            <path d="M53 2 L55.2 8.8 L62 11 L55.2 13.2 L53 20 L50.8 13.2 L44 11 L50.8 8.8 Z" fill="#F5C451" className="origin-[53px_11px] animate-[ll-twinkle_1.6s_ease-in-out_infinite]" />
            <circle cx="6" cy="16" r="2.2" fill="#E8544A" className="animate-[ll-pop_2.4s_ease-out_infinite]" />
            <circle cx="12" cy="7" r="1.6" fill="#F5C451" className="animate-[ll-pop_2.4s_ease-out_.4s_infinite]" />
            <circle cx="60" cy="26" r="1.8" fill="#1C1A3D" className="animate-[ll-pop_2.4s_ease-out_.8s_infinite]" />
            <circle cx="3" cy="30" r="1.4" fill="#F5C451" className="animate-[ll-pop_2.4s_ease-out_1.2s_infinite]" />
            <circle cx="62" cy="40" r="1.4" fill="#E8544A" className="animate-[ll-pop_2.4s_ease-out_1.6s_infinite]" />
          </svg>
        </div>

        <p className="display mt-6 text-2xl text-ink sm:text-3xl">{title}</p>
        {/* the status line fades in each time it changes */}
        <p key={step} className="mt-2 h-5 text-sm text-ink-500 animate-[ll-fade_1.6s_ease-in-out]">
          {steps[step]}
        </p>
        <div className="mt-5 h-1 w-40 overflow-hidden rounded-full bg-ink/10">
          <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-brand-400 to-gold animate-[ll-bar_1.4s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
