"use client";

import { useState } from "react";
import { KeyRound, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { api, setToken } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";
import PasswordInput from "@/components/ui/PasswordInput";
import OtpInput from "@/components/ui/OtpInput";
import ResendCode from "@/components/ui/ResendCode";
import Spinner from "@/components/ui/Spinner";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user.name);
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [busy, setBusy] = useState("");
  // password change: step 1 checks the current password and emails a code, step 2 enters it
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");

  async function save(body, kind) {
    setBusy(kind);
    try {
      const d = await api("/auth/profile", { method: "PUT", body });
      if (d.token) setToken(d.token);
      setUser(d.user);
      toast(kind === "pw" ? "Password updated" : "Profile saved");
      if (kind === "pw") cancelChange();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setBusy("");
    }
  }

  const sendCode = () => api("/auth/password-code", { method: "POST", body: { currentPassword: pw.currentPassword } });

  async function requestCode() {
    setBusy("pw");
    try {
      const d = await sendCode();
      setCodeSent(true);
      toast(d.message);
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setBusy("");
    }
  }

  function cancelChange() {
    setPw({ currentPassword: "", newPassword: "" });
    setCode("");
    setCodeSent(false);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="at-rise">
        <p className="eyebrow">
          <Sparkles className="h-3.5 w-3.5" /> Account
        </p>
        <h1 className="display mt-3 text-[2.5rem] leading-none sm:text-6xl">
          Your <em>profile.</em>
        </h1>
      </div>

      <div className="mt-8 grid gap-6 sm:mt-10 lg:grid-cols-[19rem_1fr] lg:items-start">
        {/* who you are */}
        <aside className="at-glass at-rise relative overflow-hidden rounded-[2rem] p-6 text-center lg:sticky lg:top-24" style={{ "--i": 1 }}>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-[#fbd9cf] via-[#fbefd8] to-[#ece0f8] dark:from-[#3b2233] dark:via-[#2e2838] dark:to-[#2a2447]" aria-hidden />
          <div className="relative mx-auto mt-6 grid h-24 w-24 place-items-center rounded-full">
            <span className="absolute inset-0 animate-[spin_8s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#f3d58c,#c9a24a,#fff1c9,#a87a2a,#f3d58c)] motion-reduce:animate-none" aria-hidden />
            <span className="relative grid h-[5.25rem] w-[5.25rem] place-items-center rounded-full bg-ink font-serif text-4xl text-gold dark:text-[#a87a2a]">{user.name?.[0]?.toUpperCase() || "U"}</span>
          </div>
          <p className="relative mt-4 truncate font-serif text-2xl text-ink">{user.name}</p>
          <p className="relative truncate text-sm text-ink-500">{user.email}</p>
          <span className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#8a7258] ring-1 ring-gold-600/25">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Verified email
          </span>
        </aside>

        <div className="space-y-6">
          <form
            className="at-glass at-rise rounded-[2rem] p-5 sm:p-8"
            style={{ "--i": 2 }}
            onSubmit={(e) => {
              e.preventDefault();
              save({ name }, "name");
            }}
          >
            <SectionTitle Icon={UserRound} hint="How you appear in InviteOnline.">Your details</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Email</label>
                <input className="input !bg-white/40 dark:!bg-white/[0.03]" value={user.email} disabled />
              </div>
              <div>
                <label className="label" htmlFor="name">Name</label>
                <input id="name" className="input" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            <button className="btn-primary mt-5" disabled={busy === "name"}>
              {busy === "name" && <Spinner className="h-4 w-4" />} {busy === "name" ? "Saving…" : "Save changes"}
            </button>
          </form>

          <form
            className="at-glass at-rise rounded-[2rem] p-5 sm:p-8"
            style={{ "--i": 3 }}
            onSubmit={(e) => {
              e.preventDefault();
              if (codeSent) save({ ...pw, code }, "pw");
              else requestCode();
            }}
          >
            <SectionTitle Icon={KeyRound} hint="We'll email you a code to confirm it's you.">Change password</SectionTitle>
            {!codeSent ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Current password</label>
                    <PasswordInput required value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">New password</label>
                    <PasswordInput required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
                  </div>
                </div>
                <button className="btn-primary mt-5" disabled={busy === "pw"}>
                  {busy === "pw" && <Spinner className="h-4 w-4" />} {busy === "pw" ? "Sending code…" : "Update password"}
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-ink-500">
                  To confirm it&apos;s you, enter the 6-digit code we emailed to <span className="font-semibold text-ink">{user.email}</span>.
                </p>
                <OtpInput value={code} onChange={setCode} />
                <div className="flex flex-wrap items-center gap-3">
                  <button className="btn-primary" disabled={busy === "pw" || code.length !== 6}>
                    {busy === "pw" && <Spinner className="h-4 w-4" />} {busy === "pw" ? "Updating…" : "Confirm & update password"}
                  </button>
                  <button type="button" className="btn-ghost" onClick={cancelChange}>
                    Cancel
                  </button>
                </div>
                <ResendCode onResend={sendCode} />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ Icon, hint, children }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#fff1c9] to-[#d9ae55] text-[#6d4c12] shadow-[0_10px_20px_-12px_rgba(168,122,42,.8)]">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <div>
        <h2 className="font-serif text-2xl leading-tight text-ink">{children}</h2>
        <p className="text-xs text-ink-500">{hint}</p>
      </div>
    </div>
  );
}
