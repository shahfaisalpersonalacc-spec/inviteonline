"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthShell from "@/components/site/AuthShell";
import PasswordInput from "@/components/ui/PasswordInput";
import Spinner from "@/components/ui/Spinner";
import VerifyEmailStep from "@/components/site/VerifyEmailStep";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const { register, user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [pendingEmail, setPendingEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Skip while verifying: a successful code sets `user`, and that step routes to /dashboard/new itself.
    if (!loading && user && !pendingEmail) router.replace("/dashboard");
  }, [loading, user, router, pendingEmail]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const d = await register(form.name, form.email, form.password);
      setPendingEmail(d.email);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (pendingEmail) {
    return (
      <AuthShell title="Check your email" subtitle="One last step to activate your account.">
        <VerifyEmailStep email={pendingEmail} onVerified={() => router.replace("/dashboard/new")} onBack={() => setPendingEmail("")} />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="It's free. Make your first invitation in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" required minLength={2} autoComplete="name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required autoComplete="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <PasswordInput id="password" minLength={8} autoComplete="new-password" placeholder="At least 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="btn-primary w-full !py-3">
          {busy && <Spinner className="h-4 w-4" />} Create account
        </button>
      </form>
    </AuthShell>
  );
}
