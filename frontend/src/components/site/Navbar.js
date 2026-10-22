"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/lib/auth-context";

const LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/#events", label: "Events" },
  { href: "/#faq", label: "FAQ" },
];

export default function Navbar() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-100/80 bg-white/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-zinc-600 hover:text-brand-600">
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {!loading && user ? (
            <Link href="/dashboard" className="btn-primary">
              My invitations
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">
                Log in
              </Link>
              <Link href="/register" className="btn-primary">
                Get started free
              </Link>
            </>
          )}
        </div>
        <button className="rounded-lg p-2 text-zinc-700 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>
      {open && (
        <div className="animate-float-up border-t border-zinc-100 bg-white px-4 pb-5 pt-2 md:hidden">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
              {l.label}
            </a>
          ))}
          <div className="mt-3 grid gap-2">
            {user ? (
              <Link href="/dashboard" className="btn-primary">
                My invitations
              </Link>
            ) : (
              <>
                <Link href="/register" className="btn-primary">
                  Get started free
                </Link>
                <Link href="/login" className="btn-secondary">
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
