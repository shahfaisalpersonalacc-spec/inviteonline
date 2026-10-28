"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";
import PasswordInput from "@/components/ui/PasswordInput";
import OtpInput from "@/components/ui/OtpInput";
import ResendCode from "@/components/ui/ResendCode";

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
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <p className="eyebrow">
          <span className="h-px w-8 bg-brand-600/40" /> Account
        </p>
        <h1 className="display mt-4 text-[2.6rem] leading-none sm:text-5xl">
          Your <em className="text-brand-600">profile.</em>
        </h1>
      </div>
      <form
        className="panel space-y-4 p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          save({ name }, "name");
        }}
      >
        <div>
          <label className="label">Email</label>
          <input className="input bg-cream" value={user.email} disabled />
        </div>
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input id="name" className="input" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button className="btn-primary" disabled={busy === "name"}>
          Save
        </button>
      </form>

      <form
        className="panel space-y-4 p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (codeSent) save({ ...pw, code }, "pw");
          else requestCode();
        }}
      >
        <h2 className="font-serif text-2xl text-ink">Change password</h2>
        {!codeSent ? (
          <>
            <div>
              <label className="label">Current password</label>
              <PasswordInput required value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
            </div>
            <div>
              <label className="label">New password</label>
              <PasswordInput required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
            </div>
            <button className="btn-primary" disabled={busy === "pw"}>
              Update password
            </button>
          </>
        ) : (
          <>
            <p className="text-sm leading-relaxed text-ink-500">
              To confirm it&apos;s you, enter the 6-digit code we emailed to <span className="font-semibold text-ink">{user.email}</span>.
            </p>
            <OtpInput value={code} onChange={setCode} />
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-primary" disabled={busy === "pw" || code.length !== 6}>
                Confirm &amp; update password
              </button>
              <button type="button" className="btn-ghost" onClick={cancelChange}>
                Cancel
              </button>
            </div>
            <ResendCode onResend={sendCode} />
          </>
        )}
      </form>
    </div>
  );
}
