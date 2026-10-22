"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { useAuth } from "@/lib/auth-context";

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return <FullPageSpinner />;

  // The editor uses the full screen and has its own toolbar.
  if (pathname.startsWith("/dashboard/edit/")) return children;

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <Link href="/dashboard/new" className="btn-primary hidden sm:inline-flex">
              + New invitation
            </Link>
            <div className="relative">
              <button onClick={() => setMenu((m) => !m)} className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 font-semibold text-brand-700" aria-label="Account menu">
                {user.name?.[0]?.toUpperCase() || "U"}
              </button>
              {menu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                  <div className="animate-float-up absolute right-0 z-20 mt-2 w-56 rounded-2xl border border-zinc-100 bg-white p-2 shadow-xl">
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-zinc-500">{user.email}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setMenu(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-50">
                      My invitations
                    </Link>
                    <Link href="/dashboard/profile" onClick={() => setMenu(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-50">
                      Profile & password
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        router.replace("/");
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      <Link href="/dashboard/new" className="btn-primary fixed bottom-5 right-5 z-30 !h-14 !w-14 !p-0 text-2xl sm:hidden" aria-label="New invitation">
        +
      </Link>
    </div>
  );
}
