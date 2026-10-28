"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { LayoutGrid, LogOut, Plus, UserRound } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { useAuth } from "@/lib/auth-context";

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);

  const leaving = useRef(false); // logging out: going home, not to /login
  useEffect(() => {
    if (!loading && !user && !leaving.current) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return <FullPageSpinner />;

  // The editor uses the full screen and has its own toolbar.
  if (pathname.startsWith("/dashboard/edit/")) return children;

  return (
    <div className="grain relative min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Logo size={32} />
            <nav className="hidden items-center gap-1 md:flex" aria-label="Dashboard">
              {[
                ["/dashboard", "Invitations"],
                ["/dashboard/profile", "Profile"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${pathname === href ? "bg-ink/[0.07] text-ink" : "text-ink-500 hover:text-ink"}`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/new" className="btn-primary hidden sm:inline-flex">
              <Plus className="h-4 w-4" /> New invitation
            </Link>
            <div className="relative">
              <button onClick={() => setMenu((m) => !m)} className="grid h-10 w-10 place-items-center rounded-full bg-ink font-serif text-lg text-gold ring-2 ring-gold/30 ring-offset-2 ring-offset-cream" aria-label="Account menu" aria-expanded={menu}>
                {user.name?.[0]?.toUpperCase() || "U"}
              </button>
              {menu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                  <div className="animate-float-up absolute right-0 z-20 mt-2 w-64 rounded-2xl border border-ink/10 bg-white p-2 shadow-[0_30px_60px_-25px_rgba(28,26,61,.45)]">
                    <div className="px-3 py-2.5">
                      <p className="truncate font-serif text-lg text-ink">{user.name}</p>
                      <p className="truncate text-xs text-ink-500">{user.email}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setMenu(false)} className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-cream">
                      <LayoutGrid className="h-4 w-4" /> My invitations
                    </Link>
                    <Link href="/dashboard/profile" onClick={() => setMenu(false)} className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-cream">
                      <UserRound className="h-4 w-4" /> Profile & password
                    </Link>
                    <button
                      onClick={() => {
                        leaving.current = true;
                        logout();
                        router.replace("/");
                      }}
                      className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">{children}</main>
      {pathname === "/dashboard" && (
        <Link href="/dashboard/new" className="btn-coral fixed bottom-5 right-5 z-30 !h-14 !w-14 !p-0 sm:hidden" aria-label="New invitation">
          <Plus className="h-6 w-6" />
        </Link>
      )}
    </div>
  );
}
