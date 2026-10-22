"use client";

import { useEffect, useState } from "react";
import { Card, Reveal, SectionHeading, Shell, ThemeButton } from "../primitives";
import { useInvite } from "../InviteContext";
import { api } from "@/lib/api";
import { formatDate, timeAgo } from "@/lib/format";

const fieldStyle = {
  background: "var(--inv-bg)",
  border: "1px solid color-mix(in srgb, var(--inv-secondary) 70%, transparent)",
  color: "var(--inv-text)",
};
const fieldCls = "w-full rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2";

function useGuestHeaders() {
  const { unlockToken } = useInvite();
  return unlockToken ? { "x-unlock-token": unlockToken } : {};
}

export function Rsvp({ data }) {
  const { mode, slug } = useInvite();
  const headers = useGuestHeaders();
  const [form, setForm] = useState({ name: "", phone: "", status: "yes", guests: 1, message: "" });
  const [state, setState] = useState({ sending: false, done: false, error: "" });
  const storeKey = `rsvp:${slug}`;

  useEffect(() => {
    try {
      if (localStorage.getItem(storeKey)) setState((s) => ({ ...s, done: true }));
    } catch {}
  }, [storeKey]);

  const max = Math.max(1, Number(data.maxGuests) || 5);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (mode === "editor") return;
    setState({ sending: true, done: false, error: "" });
    try {
      await api(`/public/${slug}/rsvp`, { method: "POST", body: { ...form, guests: Number(form.guests) }, headers, auth: false });
      try {
        localStorage.setItem(storeKey, form.status);
      } catch {}
      setState({ sending: false, done: true, error: "" });
    } catch (err) {
      setState({ sending: false, done: false, error: err.message });
    }
  }

  return (
    <Shell>
      <SectionHeading sub={data.text}>{data.heading}</SectionHeading>
      <Reveal className="mx-auto max-w-md">
        <Card>
          {state.done ? (
            <div className="py-6 text-center">
              <div className="text-5xl">💌</div>
              <p className="mt-3 text-xl font-semibold" style={{ color: "var(--inv-primary)" }}>
                Thank you for your response!
              </p>
              <p className="mt-1 text-sm opacity-75">We have received your RSVP.</p>
              <button
                className="mt-4 text-xs underline opacity-70"
                onClick={() => {
                  try {
                    localStorage.removeItem(storeKey);
                  } catch {}
                  setState({ sending: false, done: false, error: "" });
                }}
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <input required maxLength={80} placeholder="Your full name" value={form.name} onChange={set("name")} className={fieldCls} style={fieldStyle} />
              {data.askPhone !== false && (
                <input type="tel" maxLength={30} placeholder="Phone number (optional)" value={form.phone} onChange={set("phone")} className={fieldCls} style={fieldStyle} />
              )}
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Will you attend?">
                {[
                  ["yes", "Joyfully accept", "🥳"],
                  ["maybe", "Maybe", "🤔"],
                  ["no", "Regretfully decline", "😔"],
                ].map(([v, label, icon]) => {
                  const active = form.status === v;
                  return (
                    <button
                      type="button"
                      key={v}
                      role="radio"
                      aria-checked={active}
                      onClick={() => setForm((f) => ({ ...f, status: v }))}
                      className="rounded-xl px-2 py-3 text-xs font-semibold transition"
                      style={active ? { background: "var(--inv-primary)", color: "var(--inv-on-primary)" } : fieldStyle}
                    >
                      <span className="block text-lg">{icon}</span>
                      {label}
                    </button>
                  );
                })}
              </div>
              {form.status !== "no" && (
                <label className="flex items-center justify-between gap-3 text-sm">
                  <span>Number of guests (including you)</span>
                  <select value={form.guests} onChange={set("guests")} className="rounded-xl px-3 py-2" style={fieldStyle}>
                    {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <textarea rows={3} maxLength={500} placeholder="A message for the hosts (optional)" value={form.message} onChange={set("message")} className={fieldCls} style={fieldStyle} />
              {state.error && <p className="text-sm text-red-600">{state.error}</p>}
              <ThemeButton type="submit" disabled={state.sending || mode === "editor"} className="w-full">
                {mode === "editor" ? "RSVP (works on the live page)" : state.sending ? "Sending…" : "Send RSVP"}
              </ThemeButton>
              {data.deadline && <p className="text-center text-xs opacity-70">Please respond by {formatDate(data.deadline)}</p>}
            </form>
          )}
        </Card>
      </Reveal>
    </Shell>
  );
}

const SAMPLE_WISHES = [
  { _id: "s1", name: "Sana", message: "Wishing you a lifetime of love and happiness! 💕", createdAt: new Date().toISOString() },
  { _id: "s2", name: "Uncle Rashid", message: "Many congratulations to the whole family.", createdAt: new Date().toISOString() },
];

export function Wishes({ data }) {
  const { mode, slug } = useInvite();
  const headers = useGuestHeaders();
  const [wishes, setWishes] = useState(mode === "editor" ? SAMPLE_WISHES : []);
  const [form, setForm] = useState({ name: "", message: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const unlock = headers["x-unlock-token"];

  useEffect(() => {
    if (mode === "editor" || !slug) return;
    api(`/public/${slug}/wishes`, { auth: false, headers: unlock ? { "x-unlock-token": unlock } : {} })
      .then((d) => setWishes(d.wishes))
      .catch(() => {});
  }, [mode, slug, unlock]);

  async function submit(e) {
    e.preventDefault();
    if (mode === "editor") return;
    setSending(true);
    setError("");
    try {
      const d = await api(`/public/${slug}/wishes`, { method: "POST", body: form, headers, auth: false });
      setWishes((w) => [d.wish, ...w]);
      setForm({ name: "", message: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <Shell>
      <SectionHeading sub={data.text}>{data.heading}</SectionHeading>
      <Reveal className="mx-auto max-w-lg">
        <Card>
          <form onSubmit={submit} className="space-y-3">
            <input required maxLength={80} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldCls} style={fieldStyle} />
            <textarea required rows={3} maxLength={500} placeholder="Write your wishes…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={fieldCls} style={fieldStyle} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <ThemeButton type="submit" disabled={sending || mode === "editor"} className="w-full">
              {mode === "editor" ? "Wishes (works on the live page)" : sending ? "Sending…" : "Send wishes 💌"}
            </ThemeButton>
          </form>
        </Card>
        {wishes.length > 0 && (
          <ul className="no-scrollbar mt-6 max-h-[28rem] space-y-3 overflow-y-auto">
            {wishes.map((w) => (
              <li key={w._id}>
                <Card className="!p-4">
                  <p className="whitespace-pre-line text-sm">{w.message}</p>
                  <p className="mt-2 text-xs font-semibold" style={{ color: "var(--inv-primary)" }}>
                    — {w.name} <span className="font-normal opacity-60">· {timeAgo(w.createdAt)}</span>
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </Shell>
  );
}
