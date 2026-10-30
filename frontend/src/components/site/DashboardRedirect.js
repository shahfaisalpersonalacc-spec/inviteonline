"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getToken } from "@/lib/api";
import { FullPageSpinner } from "@/components/ui/Spinner";

const noop = () => () => {};

// On the landing page: someone already logged in goes straight to their dashboard. While that is
// being worked out (a saved session is being checked) the page is covered by the loader, so the
// landing page doesn't flash before the redirect.
export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const hasSession = useSyncExternalStore(noop, () => !!getToken(), () => false);
  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
    // not logged in after all (e.g. an expired session): uncover the landing page
    if (!loading && !user) document.documentElement.classList.remove("auth-pending");
  }, [loading, user, router]);
  // leaving for the dashboard: drop the cover set by authPendingScript in app/layout.js
  // (only once the URL has changed: React's dev mode also unmounts once on the spot, which mustn't uncover)
  useEffect(
    () => () =>
      setTimeout(() => {
        if (location.pathname !== "/") document.documentElement.classList.remove("auth-pending");
      }, 0),
    []
  );

  if (!hasSession || (!loading && !user)) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-cream">
      <FullPageSpinner />
    </div>
  );
}
