"use client";

import { useEffect, useState } from "react";
import { Check, CircleHelp, MailOpen, Minus, Plus, Send, X } from "lucide-react";
import { Card, Reveal, SectionHeading, Shell, ThemeButton } from "../primitives";
import { useInvite } from "../InviteContext";
import { api } from "@/lib/api";
import { formatDate, timeAgo } from "@/lib/format";

const fieldStyle = {
  background: "var(--inv-bg)",
  border: "1px solid color-mix(in srgb, var(--inv-secondary) 70%, transparent)",
  color: "var(--inv-text)",
};
// text-base (16px) stops iOS Safari zooming in when a field is focused.
const fieldCls = "block min-h-12 w-full rounded-xl px-3.5 py-2.5 text-base outline-none focus:ring-2";
const labelCls = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70";

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
      <Reveal className="mx-auto max-w-md @3xl:max-w-2xl">
        <Card className="!p-4 @sm:!p-5 @3xl:!p-10">
          {state.done ? (
            <div className="py-6 text-center">
              <MailOpen className="mx-auto h-12 w-12" strokeWidth={1.3} style={{ color: "var(--inv-primary)" }} />
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
            // The form is its own container so it adapts to the card's width, not the screen's.
            <form onSubmit={submit} className="@container space-y-4">
              <div className={`grid gap-3 ${data.askPhone !== false ? "@lg:grid-cols-2" : ""}`}>
                <label className="block">
                  <span className={labelCls}>Your name</span>
                  <input required maxLength={80} autoComplete="name" placeholder="Full name" value={form.name} onChange={set("name")} className={fieldCls} style={fieldStyle} />
                </label>
                {data.askPhone !== false && (
                  <label className="block">
                    <span className={labelCls}>Phone / WhatsApp</span>
                    <input type="tel" maxLength={30} autoComplete="tel" placeholder="Optional" value={form.phone} onChange={set("phone")} className={fieldCls} style={fieldStyle} />
                  </label>
                )}
              </div>

              <fieldset>
                <legend className={labelCls}>Will you attend?</legend>
                {/* Stacked rows on narrow cards, three tiles once there is room. */}
                <div className="grid gap-2 @sm:grid-cols-3" role="radiogroup" aria-label="Will you attend?">
                  {[
                    ["yes", "Joyfully accept", Check],
                    ["maybe", "Maybe", CircleHelp],
                    ["no", "Regretfully decline", X],
                  ].map(([v, label, Icon]) => {
                    const active = form.status === v;
                    return (
                      <button
                        type="button"
                        key={v}
                        role="radio"
                        aria-checked={active}
                        onClick={() => setForm((f) => ({ ...f, status: v }))}
                        className="flex min-h-12 items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold leading-tight transition @sm:flex-col @sm:justify-center @sm:gap-1.5 @sm:px-2 @sm:py-3 @sm:text-center"
                        style={active ? { background: "var(--inv-primary)", color: "var(--inv-on-primary)", boxShadow: "0 10px 22px -14px var(--inv-primary)" } : fieldStyle}
                      >
                        <Icon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
                        <span className="flex-1 @sm:flex-none">{label}</span>
                        <span
                          className="grid h-5 w-5 shrink-0 place-items-center rounded-full @sm:hidden"
                          style={{ boxShadow: `inset 0 0 0 1.5px ${active ? "var(--inv-on-primary)" : "color-mix(in srgb, var(--inv-text) 35%, transparent)"}` }}
                          aria-hidden
                        >
                          {active && <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--inv-on-primary)" }} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {form.status !== "no" && (
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl px-3.5 py-2.5" style={fieldStyle}>
                  <span className="text-sm font-semibold">
                    Guests <span className="font-normal opacity-70">(including you)</span>
                  </span>
                  <div className="flex items-center gap-1" role="group" aria-label="Number of guests">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, guests: Math.max(1, Number(f.guests) - 1) }))}
                      disabled={form.guests <= 1}
                      className="grid h-10 w-10 place-items-center rounded-full disabled:opacity-35"
                      style={{ boxShadow: "inset 0 0 0 1.5px var(--inv-primary)", color: "var(--inv-primary)" }}
                      aria-label="Fewer guests"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-9 text-center text-lg font-semibold tabular-nums" aria-live="polite">
                      {form.guests}
                    </span>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, guests: Math.min(max, Number(f.guests) + 1) }))}
                      disabled={form.guests >= max}
                      className="grid h-10 w-10 place-items-center rounded-full disabled:opacity-35"
                      style={{ background: "var(--inv-primary)", color: "var(--inv-on-primary)" }}
                      aria-label="More guests"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <label className="block">
                <span className={labelCls}>Message</span>
                <textarea rows={3} maxLength={500} placeholder="A note for the hosts (optional)" value={form.message} onChange={set("message")} className={`${fieldCls} resize-y`} style={fieldStyle} />
              </label>

              {state.error && <p className="text-sm text-red-600">{state.error}</p>}
              <ThemeButton type="submit" disabled={state.sending || mode === "editor"} className="min-h-12 w-full !text-base">
                <Send className="h-4 w-4" /> {state.sending ? "Sending…" : "Send RSVP"}
              </ThemeButton>
              {mode === "editor" && <p className="text-center text-xs italic opacity-70">Preview only: guests can reply on the live page.</p>}
              {data.deadline && <p className="text-center text-sm opacity-75">Please respond by {formatDate(data.deadline)}</p>}
            </form>
          )}
        </Card>
      </Reveal>
    </Shell>
  );
}

const SAMPLE_WISHES = [
  { _id: "s1", name: "Sana", message: "Wishing you a lifetime of love and happiness!", createdAt: new Date().toISOString() },
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
      <Reveal className="mx-auto max-w-lg @5xl:max-w-none">
        <Card className="mx-auto max-w-lg">
          <form onSubmit={submit} className="space-y-3">
            <input required maxLength={80} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldCls} style={fieldStyle} />
            <textarea required rows={3} maxLength={500} placeholder="Write your wishes…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={fieldCls} style={fieldStyle} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <ThemeButton type="submit" disabled={sending || mode === "editor"} className="w-full">
              {mode === "editor" ? "Wishes (works on the live page)" : sending ? "Sending…" : (<><Send className="h-4 w-4" /> Send wishes</>)}
            </ThemeButton>
          </form>
        </Card>
        {wishes.length > 0 && (
          <ul className="no-scrollbar mt-6 grid max-h-[28rem] gap-3 overflow-y-auto @3xl:max-h-none @3xl:grid-cols-2 @3xl:overflow-visible @5xl:mt-10 @5xl:grid-cols-3">
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
