"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";
import PasswordInput from "@/components/ui/PasswordInput";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user.name);
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [busy, setBusy] = useState("");

  async function save(body, kind) {
    setBusy(kind);
    try {
      const d = await api("/auth/profile", { method: "PUT", body });
      setUser(d.user);
      toast(kind === "pw" ? "Password updated" : "Profile saved");
      if (kind === "pw") setPw({ currentPassword: "", newPassword: "" });
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setBusy("");
    }
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
          save(pw, "pw");
        }}
      >
        <h2 className="font-serif text-2xl text-ink">Change password</h2>
        <div>
          <label className="label">Current password</label>
          <PasswordInput value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
        </div>
        <div>
          <label className="label">New password</label>
          <PasswordInput minLength={8} autoComplete="new-password" placeholder="At least 8 characters" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
        </div>
        <button className="btn-primary" disabled={busy === "pw"}>
          Update password
        </button>
      </form>
    </div>
  );
}
