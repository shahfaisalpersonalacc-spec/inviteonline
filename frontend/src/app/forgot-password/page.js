"use client";

import Link from "next/link";
import { useState } from "react";
import AuthShell from "@/components/site/AuthShell";
import Spinner from "@/components/ui/Spinner";
import { MailCheck } from "lucide-react";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const d = await api("/auth/forgot-password", { method: "POST", body: { email }, auth: false });
      setSent(d.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your account email and we'll send you a link to reset it."
      footer={
        <Link href="/login" className="font-semibold text-brand-600 hover:underline">
          ← Back to log in
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6 text-sm text-emerald-900">
          <MailCheck className="h-8 w-8 text-emerald-600" strokeWidth={1.6} />
          <p className="mt-2 font-semibold">Check your inbox</p>
          <p className="mt-1">{sent} The link expires in 30 minutes — check your spam folder too.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" required autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          {error && <p className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}
          <button disabled={busy} className="btn-primary w-full !py-3">
            {busy && <Spinner className="h-4 w-4" />} Send reset link
          </button>
        </form>
      )}
    </AuthShell>
  );
}
