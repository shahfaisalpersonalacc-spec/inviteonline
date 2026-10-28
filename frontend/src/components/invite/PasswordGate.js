"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import Spinner from "@/components/ui/Spinner";

export default function PasswordGate({ title, onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onUnlock(password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[100svh] items-center justify-center p-6">
      <form onSubmit={submit} className="animate-float-up w-full max-w-sm rounded-3xl p-8 text-center shadow-xl" style={{ background: "var(--inv-surface)" }}>
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full" style={{ background: "color-mix(in srgb, var(--inv-primary) 12%, transparent)", color: "var(--inv-primary)" }}>
          <Lock className="h-7 w-7" strokeWidth={1.6} />
        </span>
        <h1 className="mt-4 text-4xl leading-tight" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
          {title}
        </h1>
        <p className="mt-2 text-sm opacity-75">This invitation is private. Enter the password shared by the host.</p>
        <input
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-6 w-full rounded-xl px-4 py-3 text-center text-sm outline-none"
          style={{ background: "var(--inv-bg)", border: "1px solid var(--inv-secondary)", color: "var(--inv-text)" }}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          disabled={busy}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold disabled:opacity-60"
          style={{ background: "var(--inv-primary)", color: "var(--inv-on-primary)" }}
        >
          {busy && <Spinner className="h-4 w-4" />} {busy ? "Checking…" : "View invitation"}
        </button>
      </form>
    </div>
  );
}
