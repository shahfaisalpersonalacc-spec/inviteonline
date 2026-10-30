"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { LayoutGrid, LogOut, Plus, UserRound } from "lucide-react";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Avatar from "@/components/ui/Avatar";
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

  if (loading || !user) return <AppSkeleton />;

  // The editor uses the full screen and has its own toolbar.
  if (pathname.startsWith("/dashboard/edit/")) return children;

  return (
    <div className="atelier relative min-h-screen">
      {/* a floating glass bar: 0.5rem from the top, 3.5rem tall (pages below assume 4rem in all) */}
      <header className="sticky top-0 z-40 px-3 pt-2 sm:px-4">
        <div className="at-glass-strong mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-full pl-4 pr-2 sm:pl-5">
          <div className="flex items-center gap-5">
            <Logo size={30} />
            <nav className="hidden items-center gap-1 md:flex" aria-label="Dashboard">
              {[
                ["/dashboard", "Invitations"],
                ["/dashboard/profile", "Profile"],
              ].map(([href, label]) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${active ? "bg-white text-ink shadow-[0_6px_16px_-10px_rgba(70,45,20,.6)] ring-1 ring-gold-600/25" : "text-ink-500 hover:bg-white/60 hover:text-ink"}`}
                  >
                    {label}
                    {active && <span className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-gold-600 to-transparent" aria-hidden />}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/new" className="btn-primary hidden !py-2 sm:inline-flex">
              <Plus className="h-4 w-4" /> New invitation
            </Link>
            <ThemeToggle />
            <div className="relative">
              {/* the avatar sits in a slowly turning gold ring */}
              <button onClick={() => setMenu((m) => !m)} className="relative grid h-10 w-10 place-items-center rounded-full" aria-label="Account menu" aria-expanded={menu}>
                <span className="absolute inset-0 animate-[spin_6s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#f3d58c,#c9a24a,#fff1c9,#a87a2a,#f3d58c)] motion-reduce:animate-none" aria-hidden />
                <Avatar user={user} className="relative h-[34px] w-[34px] text-lg" />
              </button>
              {menu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                  {/* solid, not glass: a blur nested inside the blurred header can't blur the page behind it */}
                  <div className="at-glass-strong at-pop absolute right-0 z-20 mt-3 w-64 overflow-hidden rounded-3xl !bg-[#fffaf3] p-2 dark:!bg-[#1b1931]">
                    <div className="relative mb-1 overflow-hidden rounded-2xl bg-gradient-to-br from-[#fff3e6] via-[#fdf6ec] to-[#f6e6c4] px-3.5 py-3 dark:from-[#2c2540] dark:via-[#24203a] dark:to-[#3a3026]">
                      <p className="truncate font-serif text-lg text-ink">{user.name}</p>
                      <p className="truncate text-xs text-ink-500">{user.email}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setMenu(false)} className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-white">
                      <LayoutGrid className="h-4 w-4 text-gold-600" /> My invitations
                    </Link>
                    <Link href="/dashboard/profile" onClick={() => setMenu(false)} className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-white">
                      <UserRound className="h-4 w-4 text-gold-600" /> Profile & password
                    </Link>
                    <button
                      onClick={() => {
                        leaving.current = true;
                        logout();
                        router.replace("/");
                      }}
                      className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
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
      <main id="main" className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">{children}</main>
      {pathname === "/dashboard" && (
        <Link href="/dashboard/new" className="btn-coral fixed bottom-5 right-5 z-30 !h-14 !w-14 !p-0 sm:hidden" aria-label="New invitation">
          <Plus className="h-6 w-6" />
        </Link>
      )}
    </div>
  );
}

// While we check who's signed in: the frame of the page as shimmering placeholders.
function AppSkeleton() {
  return (
    <div className="atelier relative min-h-screen" aria-busy="true" aria-label="Loading">
      <div className="relative z-10 px-3 pt-2 sm:px-4">
        <div className="at-glass-strong mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-4">
          <div className="at-skel h-7 w-32" />
          <div className="at-skel h-10 w-10 rounded-full" />
        </div>
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
        <div className="at-skel h-4 w-36" />
        <div className="at-skel mt-4 h-12 w-[min(26rem,85%)]" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="at-skel h-72 rounded-[1.75rem]" />
          ))}
        </div>
      </div>
    </div>
  );
}
