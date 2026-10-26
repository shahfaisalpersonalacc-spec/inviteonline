"use client";

import { useState } from "react";
import OtpInput from "@/components/ui/OtpInput";
import ResendCode from "@/components/ui/ResendCode";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/lib/auth-context";

// Code-entry step shown after register (or a login with an unverified email). Logs in on success.
export default function VerifyEmailStep({ email, onVerified, onBack }) {
  const { verifyEmail } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await verifyEmail(email, code);
      onVerified();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-zinc-600">
        We sent a 6-digit code to <span className="font-semibold text-zinc-900">{email}</span>. It expires in 10 minutes.
      </p>
      <OtpInput value={code} onChange={setCode} />
      {error && <p className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}
      <button disabled={busy || code.length < 6} className="btn-primary w-full !py-3">
        {busy && <Spinner className="h-4 w-4" />} Verify email
      </button>
      <ResendCode email={email} purpose="verify" />
      {onBack && (
        <button type="button" onClick={onBack} className="block w-full text-center text-sm font-semibold text-brand-600 hover:underline">
          ← Use a different email
        </button>
      )}
    </form>
  );
}
