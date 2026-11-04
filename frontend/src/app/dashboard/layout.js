"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ChevronDown, LayoutGrid, LogOut, Plus, UserRound, Users } from "lucide-react";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Avatar from "@/components/ui/Avatar";
import { api } from "@/lib/api";
import { formatCount } from "@/lib/format";
import { useAuth } from "@/lib/auth-context";
import { startFresh } from "@/lib/draft";

// account menu rows; the page you're on is marked like the tabs in the bar
const MENU_ITEM = "flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm text-ink transition";
const MENU_ACTIVE = "bg-white font-semibold shadow-[0_6px_16px_-10px_rgba(70,45,20,.6)] ring-1 ring-gold-600/25";

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);
  // the menu's Guests item: guests belong to an invitation, so it lists them (loaded when the menu opens)
  const [invites, setInvites] = useState(null);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const guestsPage = /^\/dashboard\/[^/]+\/guests$/.test(pathname);
  const toggleMenu = () => {
    if (!menu) {
      setGuestsOpen(guestsPage);
      api("/invitations")
        .then((d) => setInvites(d.invitations.map(({ _id, title, rsvpCount }) => ({ _id, title, count: rsvpCount || 0 }))))
        .catch(() => setInvites((cur) => cur || []));
    }
    setMenu(!menu);
  };

  // a tap or click anywhere outside closes the menu, and so does Esc
  // (an overlay can't: the header's frosted glass keeps a fixed overlay inside the header)
  useEffect(() => {
    if (!menu) return;
    const outside = (e) => !menuRef.current?.contains(e.target) && setMenu(false);
    const esc = (e) => e.key === "Escape" && setMenu(false);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", esc);
    };
  }, [menu]);

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
            <Link href="/dashboard/new" onClick={startFresh} className="btn-primary hidden !py-2 sm:inline-flex">
              <Plus className="h-4 w-4" /> New invitation
            </Link>
            <ThemeToggle />
            <div className="relative" ref={menuRef}>
              {/* the avatar sits in a slowly turning gold ring */}
              <button onClick={toggleMenu} className="relative grid h-10 w-10 place-items-center rounded-full" aria-label="Account menu" aria-expanded={menu}>
                <span className="absolute inset-0 animate-[spin_6s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#f3d58c,#c9a24a,#fff1c9,#a87a2a,#f3d58c)] motion-reduce:animate-none" aria-hidden />
                <Avatar user={user} className="relative h-[34px] w-[34px] text-lg" />
              </button>
              {menu && (
                <>
                  {/* solid, not glass: a blur nested inside the blurred header can't blur the page behind it */}
                  <div className="at-glass-strong at-pop absolute right-0 z-20 mt-3 w-64 overflow-hidden rounded-3xl !bg-[#fffaf3] p-2 dark:!bg-[#1b1931]">
                    <div className="relative mb-1 overflow-hidden rounded-2xl bg-gradient-to-br from-[#fff3e6] via-[#fdf6ec] to-[#f6e6c4] px-3.5 py-3 dark:from-[#2c2540] dark:via-[#24203a] dark:to-[#3a3026]">
                      <p className="truncate font-serif text-lg text-ink">{user.name}</p>
                      <p className="truncate text-xs text-ink-500">{user.email}</p>
                    </div>
                    {[
                      ["/dashboard", "My invitations", LayoutGrid],
                      ["/dashboard/profile", "Profile & password", UserRound],
                    ].map(([href, label, Icon]) => {
                      const active = pathname === href;
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setMenu(false)}
                          aria-current={active ? "page" : undefined}
                          className={`${MENU_ITEM} ${active ? MENU_ACTIVE : "font-medium hover:bg-white"}`}
                        >
                          <Icon className="h-4 w-4 text-gold-600" /> {label}
                          {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold-600" aria-hidden />}
                        </Link>
                      );
                    })}
                    {invites?.length === 1 ? (
                      <Link
                        href={`/dashboard/${invites[0]._id}/guests`}
                        onClick={() => setMenu(false)}
                        aria-current={guestsPage ? "page" : undefined}
                        className={`${MENU_ITEM} ${guestsPage ? MENU_ACTIVE : "font-medium hover:bg-white"}`}
                      >
                        <Users className="h-4 w-4 text-gold-600" /> Guests
                        <span className={`ml-auto rounded-full px-1.5 py-px text-[11px] font-semibold tabular-nums ${guestsPage ? "bg-ink text-cream" : "bg-ink/[0.07] text-ink-500"}`}>{formatCount(invites[0].count)}</span>
                      </Link>
                    ) : (
                      invites?.length > 1 && (
                        <div>
                          {/* "Guests" opens every invitation's replies; the arrow lists them to jump to one */}
                          <div className={`flex items-center rounded-2xl transition ${guestsPage ? MENU_ACTIVE : "hover:bg-white"}`}>
                            <Link
                              href="/dashboard/all/guests"
                              onClick={() => setMenu(false)}
                              aria-current={guestsPage ? "page" : undefined}
                              className={`${MENU_ITEM} min-w-0 flex-1 ${guestsPage ? "font-semibold" : "font-medium"}`}
                            >
                              <Users className="h-4 w-4 text-gold-600" /> Guests
                            </Link>
                            <button
                              type="button"
                              onClick={() => setGuestsOpen((o) => !o)}
                              aria-expanded={guestsOpen}
                              aria-label={guestsOpen ? "Hide invitations" : "Show guests for one invitation"}
                              className="mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-500 transition hover:bg-ink/[0.06] hover:text-ink"
                            >
                              <ChevronDown className={`h-4 w-4 transition ${guestsOpen ? "rotate-180" : ""}`} />
                            </button>
                          </div>
                          {guestsOpen && (
                            // a soft inset panel; each row shows how many replies that invitation has
                            <div className="no-scrollbar mx-1 mb-1 mt-1 max-h-52 space-y-0.5 overflow-y-auto rounded-2xl bg-ink/[0.04] p-1 dark:bg-white/[0.04]">
                              {[{ _id: "all", title: "All invitations", count: invites.reduce((n, x) => n + x.count, 0) }, ...invites].map((inv) => {
                                const href = `/dashboard/${inv._id}/guests`;
                                const active = pathname === href;
                                return (
                                  <Link
                                    key={inv._id}
                                    href={href}
                                    onClick={() => setMenu(false)}
                                    aria-current={active ? "page" : undefined}
                                    title={`${inv.title}: ${inv.count} ${inv.count === 1 ? "reply" : "replies"}`}
                                    className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] transition ${active ? "bg-white font-semibold text-ink shadow-[0_6px_14px_-10px_rgba(70,45,20,.6)] ring-1 ring-gold-600/25" : "text-ink-500 hover:bg-white hover:text-ink"}`}
                                  >
                                    {inv._id === "all" ? (
                                      <LayoutGrid className={`h-3.5 w-3.5 shrink-0 ${active ? "text-gold-600" : ""}`} />
                                    ) : (
                                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? "bg-gold-600" : "bg-ink/20"}`} aria-hidden />
                                    )}
                                    <span className="min-w-0 flex-1 truncate">{inv.title}</span>
                                    <span className={`shrink-0 rounded-full px-1.5 py-px text-[11px] font-semibold tabular-nums ${active ? "bg-ink text-cream" : "bg-ink/[0.07]"}`}>{formatCount(inv.count)}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )
                    )}
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
        <Link href="/dashboard/new" onClick={startFresh} className="btn-coral fixed bottom-5 right-5 z-30 !h-10 !gap-1 !pl-3 !pr-4 !text-[13px] shadow-lg sm:hidden">
          <Plus className="h-3.5 w-3.5" /> New invitation
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
