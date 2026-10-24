"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/lib/auth-context";

const LINKS = [
  { href: "/#entrances", label: "Entrances" },
  { href: "/#templates", label: "Templates" },
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
];

export default function Navbar() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    // The menu covers the page, so the page underneath must not scroll.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const signedIn = !loading && user;

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
      {/* Floating capsule: transparent at the top of the page, a frosted bar once you scroll */}
      <nav
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full pl-3 pr-2 transition-all duration-300 sm:h-[3.75rem] sm:pl-5 ${
          scrolled || open ? "border border-ink/10 bg-cream/85 shadow-[0_12px_32px_-20px_rgba(28,26,61,.45)] backdrop-blur-xl" : "border border-transparent"
        }`}
      >
        <Logo size={32} />
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-2.5 py-2 text-[0.9rem] font-medium text-ink/70 transition hover:bg-ink/[0.05] hover:text-ink lg:px-3.5">
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {signedIn ? (
            <Link href="/dashboard" className="btn-primary hidden !py-2.5 sm:inline-flex">
              My invitations <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost hidden md:inline-flex">
                Log in
              </Link>
              <Link href="/register" className="btn-primary hidden whitespace-nowrap !px-4 !py-2.5 min-[380px]:inline-flex">
                Start free
              </Link>
            </>
          )}
          <button
            className="grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-ink/5 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="grain animate-float-up fixed inset-x-0 bottom-0 top-[4.5rem] z-[-1] flex flex-col overflow-y-auto bg-cream px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 md:hidden">
          <p className="eyebrow">Menu</p>
          <ul className="mt-4 border-t border-ink/10">
            {LINKS.map((l, i) => (
              <li key={l.href} className="border-b border-ink/10">
                <a href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-4">
                  <span className="w-6 font-serif text-sm italic text-ink/40">0{i + 1}</span>
                  <span className="display flex-1 text-[1.9rem] leading-none">{l.label}</span>
                  <ArrowUpRight className="h-5 w-5 self-center text-ink/30" />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto grid gap-2.5 pt-10">
            {signedIn ? (
              <Link href="/dashboard" onClick={() => setOpen(false)} className="btn-primary !py-3.5 !text-base">
                My invitations <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link href="/register" onClick={() => setOpen(false)} className="btn-primary !py-3.5 !text-base">
                  Create your invitation <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary !py-3.5 !text-base">
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
