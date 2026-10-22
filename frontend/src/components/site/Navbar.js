"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/lib/auth-context";

const LINKS = [
  { href: "/#entrances", label: "Entrances" },
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
];

export default function Navbar() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-all ${scrolled ? "border-b border-ink/[0.06] bg-cream/85 backdrop-blur-xl" : "bg-transparent"}`}>
      <nav className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-semibold text-ink/70 transition hover:text-ink">
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {!loading && user ? (
            <Link href="/dashboard" className="btn-primary">
              My invitations <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">
                Log in
              </Link>
              <Link href="/register" className="btn-primary">
                Get started
              </Link>
            </>
          )}
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-ink/5 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open && (
        <div className="animate-float-up border-t border-ink/[0.06] bg-cream px-4 pb-6 pt-2 md:hidden">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-base font-semibold text-ink hover:bg-white">
              {l.label}
            </a>
          ))}
          <div className="mt-3 grid gap-2">
            {user ? (
              <Link href="/dashboard" className="btn-primary !py-3">
                My invitations
              </Link>
            ) : (
              <>
                <Link href="/register" className="btn-primary !py-3">
                  Get started
                </Link>
                <Link href="/login" className="btn-secondary !py-3">
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
