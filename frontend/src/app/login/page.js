"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthShell from "@/components/site/AuthShell";
import PasswordInput from "@/components/ui/PasswordInput";
import Spinner from "@/components/ui/Spinner";
import VerifyEmailStep from "@/components/site/VerifyEmailStep";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [pendingEmail, setPendingEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(form.email, form.password);
      router.replace("/dashboard");
    } catch (err) {
      if (err.data?.needsVerification) setPendingEmail(err.data.email);
      else setError(err.message);
      setBusy(false);
    }
  }

  if (pendingEmail) {
    return (
      <AuthShell title="Verify your email" subtitle="Your account isn't activated yet.">
        <VerifyEmailStep email={pendingEmail} onVerified={() => router.replace("/dashboard")} onBack={() => setPendingEmail("")} />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to edit your invitations and see your RSVPs."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-semibold text-brand-600 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-3 sm:space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required autoComplete="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="password">Password</label>
            <Link href="/forgot-password" className="mb-1.5 text-xs font-semibold text-brand-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordInput id="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="btn-primary w-full !py-3">
          {busy && <Spinner className="h-4 w-4" />} Log in
        </button>
      </form>
    </AuthShell>
  );
}
