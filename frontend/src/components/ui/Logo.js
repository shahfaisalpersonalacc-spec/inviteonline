"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

// InviteOnline brand mark: open envelope with an invitation card rising out, confetti and a sparkle.
// Colours from the brand board: coral #E8544A (flap shades derived), ink #1C1A3D, gold #F5C451, cream #FFF8F1.
export function LogoMark({ size = 40, className = "", onDark = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M8 30 L32 12 L56 30 Z" fill="#BE453D" />
      <rect x="8" y="28" width="48" height="28" rx="7" fill="#E8544A" />
      <rect x="16" y="9" width="32" height="35" rx="4" fill="#FFF8F1" />
      <circle cx="32" cy="18" r="4" fill="#F5C451" />
      <rect x="23" y="26" width="18" height="3" rx="1.5" fill="#1C1A3D" />
      <rect x="26" y="32" width="12" height="2.5" rx="1.25" fill="#F4A9A2" />
      <path d="M8 36 L32 50 L56 36 L56 49 Q56 56 49 56 L15 56 Q8 56 8 49 Z" fill="#BE453D" />
      <path d="M8 36 L32 50 L56 36 L56 39 L32 53 L8 39 Z" fill="#9E3932" />
      <path d="M53 2 L55.2 8.8 L62 11 L55.2 13.2 L53 20 L50.8 13.2 L44 11 L50.8 8.8 Z" fill="#F5C451" />
      <circle cx="6" cy="16" r="2.2" fill={onDark ? "#FFF8F1" : "#E8544A"} />
      <circle cx="12" cy="7" r="1.6" fill="#F5C451" />
      <circle cx="60" cy="26" r="1.8" fill={onDark ? "#F4A9A2" : "#1C1A3D"} />
    </svg>
  );
}

export function Wordmark({ light = false, className = "" }) {
  return (
    <span className={`font-extrabold tracking-[-0.04em] leading-none ${className}`}>
      <span className={light ? "text-cream" : "text-ink"}>Invite</span>
      <span className="text-brand-600">Online</span>
    </span>
  );
}

export default function Logo({ className = "", light = false, size = 36 }) {
  // logged in, "home" is the dashboard (linking to / would flash the landing page, then redirect)
  const { user } = useAuth() || {};
  return (
    <Link href={user ? "/dashboard" : "/"} className={`flex items-center gap-2.5 ${className}`} aria-label={user ? "InviteOnline dashboard" : "InviteOnline home"}>
      <LogoMark size={size} onDark={light} className="drop-shadow-[0_6px_10px_rgba(232,84,74,0.28)]" />
      <Wordmark light={light} className="text-[1.45rem]" />
    </Link>
  );
}
