"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthShell from "@/components/site/AuthShell";
import OtpInput from "@/components/ui/OtpInput";
import PasswordInput from "@/components/ui/PasswordInput";
import ResendCode from "@/components/ui/ResendCode";
import Spinner from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { handleSession } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function requestCode(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/auth/forgot-password", { method: "POST", body: { email }, auth: false });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function reset(e) {
    e.preventDefault();
    if (password !== confirm) return setError("The two passwords don't match. Please type them again.");
    setBusy(true);
    setError("");
    try {
      const d = await api("/auth/reset-password", { method: "POST", body: { email, code, password }, auth: false });
      handleSession(d);
      router.replace("/dashboard");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  const back = (
    <Link href="/login" className="font-semibold text-brand-600 hover:underline">
      ← Back to log in
    </Link>
  );

  if (sent) {
    return (
      <AuthShell title="Set a new password" subtitle={`If an account exists for ${email}, we've emailed it a 6-digit code. It expires in 10 minutes.`} footer={back}>
        <form onSubmit={reset} className="space-y-4">
          <div>
            <label className="label">Code</label>
            <OtpInput value={code} onChange={setCode} />
          </div>
          <div>
            <label className="label" htmlFor="password">New password</label>
            <PasswordInput id="password" minLength={8} autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="confirm">Confirm password</label>
            <PasswordInput id="confirm" minLength={8} autoComplete="new-password" placeholder="Repeat password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          {error && <p className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}
          <button disabled={busy || code.length < 6} className="btn-primary w-full !py-3">
            {busy && <Spinner className="h-4 w-4" />} Update password
          </button>
          <ResendCode email={email} purpose="reset" />
          <button type="button" onClick={() => { setSent(false); setCode(""); setError(""); }} className="block w-full text-center text-sm font-semibold text-brand-600 hover:underline">
            ← Use a different email
          </button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Forgot your password?" subtitle="Enter your account email and we'll send you a code to reset it." footer={back}>
      <form onSubmit={requestCode} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        {error && <p className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="btn-primary w-full !py-3">
          {busy && <Spinner className="h-4 w-4" />} Send code
        </button>
      </form>
    </AuthShell>
  );
}
