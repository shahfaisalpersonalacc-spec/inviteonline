"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EVENT_TYPES } from "@/data/eventTypes";
import { THEMES } from "@/data/themes";
import { api } from "@/lib/api";
import Spinner from "@/components/ui/Spinner";

export default function NewInvitationPage() {
  const router = useRouter();
  const [eventType, setEventType] = useState("wedding");
  const [theme, setTheme] = useState(EVENT_TYPES[0].theme);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function pickEvent(e) {
    setEventType(e.id);
    setTheme(e.theme);
  }

  async function create(ev) {
    ev.preventDefault();
    setBusy(true);
    setError("");
    try {
      const d = await api("/invitations", { method: "POST", body: { title: title.trim() || "My Invitation", eventType, themePreset: theme } });
      router.replace(`/dashboard/edit/${d.invitation._id}`);
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={create} className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">Create a new invitation</h1>
      <p className="mt-1 text-sm text-zinc-600">We&apos;ll fill it with sample content you can change in the editor.</p>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-500">1. What are you celebrating?</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {EVENT_TYPES.map((e) => (
          <button
            type="button"
            key={e.id}
            onClick={() => pickEvent(e)}
            className={`card flex flex-col items-start gap-1 p-4 text-left transition ${eventType === e.id ? "!border-brand-500 ring-4 ring-brand-100" : "hover:border-zinc-300"}`}
          >
            <span className="text-3xl">{e.emoji}</span>
            <span className="text-sm font-semibold text-zinc-900">{e.label}</span>
            <span className="text-xs text-zinc-500">{e.hint}</span>
          </button>
        ))}
      </div>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-500">2. Choose a theme</h2>
      <div className="no-scrollbar -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 lg:grid-cols-6">
        {Object.entries(THEMES).map(([id, t]) => (
          <button
            type="button"
            key={id}
            onClick={() => setTheme(id)}
            className={`card w-32 shrink-0 overflow-hidden text-left transition sm:w-auto ${theme === id ? "!border-brand-500 ring-4 ring-brand-100" : ""}`}
          >
            <div className="flex h-16 items-center justify-center" style={{ background: t.background }}>
              <span className="text-2xl" style={{ color: t.primary, fontFamily: "var(--font-great-vibes)" }}>
                Aa
              </span>
            </div>
            <div className="flex items-center gap-1.5 p-2">
              <span className="h-3 w-3 rounded-full" style={{ background: t.primary }} />
              <span className="h-3 w-3 rounded-full" style={{ background: t.secondary }} />
              <span className="truncate text-xs font-medium">{t.label}</span>
            </div>
          </button>
        ))}
      </div>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-500">3. Give it a name</h2>
      <input className="input mt-3 !py-3 !text-base" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Ayesha weds Ahmed" />
      <p className="mt-1.5 text-xs text-zinc-500">This also becomes your link, e.g. /i/ayesha-weds-ahmed — you can change it later.</p>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="mt-8 flex justify-end">
        <button disabled={busy} className="btn-primary !px-8 !py-3 !text-base">
          {busy && <Spinner className="h-4 w-4" />} Create & start editing →
        </button>
      </div>
    </form>
  );
}
