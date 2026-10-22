"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import AuthShell from "@/components/site/AuthShell";
import PasswordInput from "@/components/ui/PasswordInput";
import Spinner from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const { handleSession } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (password !== confirm) return setError("Passwords do not match");
    setBusy(true);
    setError("");
    try {
      const d = await api(`/auth/reset-password/${token}`, { method: "POST", body: { password }, auth: false });
      handleSession(d);
      router.replace("/dashboard");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before."
      footer={
        <Link href="/forgot-password" className="font-semibold text-brand-600 hover:underline">
          Request a new link
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="password">New password</label>
          <PasswordInput id="password" minLength={8} autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="confirm">Confirm password</label>
          <PasswordInput id="confirm" minLength={8} autoComplete="new-password" placeholder="Repeat password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="btn-primary w-full !py-3">
          {busy && <Spinner className="h-4 w-4" />} Update password
        </button>
      </form>
    </AuthShell>
  );
}
