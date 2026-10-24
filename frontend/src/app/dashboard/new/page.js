"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check, Moon, Sun } from "lucide-react";
import { EVENT_TYPES } from "@/data/eventTypes";
import { ENTRY_STYLES, THEMES } from "@/data/themes";
import { api } from "@/lib/api";
import Spinner from "@/components/ui/Spinner";
import WaxSeal from "@/components/invite/entry/WaxSeal";
import TemplatePreview from "@/components/site/TemplatePreview";
import { getTemplate, templateTheme, templatesFor } from "@/data/templates";

function Step({ n, children }) {
  return (
    <h2 className="mt-14 flex items-baseline gap-4 border-t border-ink/10 pt-6">
      <span className="font-serif text-2xl italic text-brand-600">{n}.</span>
      <span className="font-serif text-2xl text-ink sm:text-[1.7rem]">{children}</span>
    </h2>
  );
}

export default function NewInvitationPage() {
  const router = useRouter();
  const [eventType, setEventType] = useState("wedding");
  const [theme, setTheme] = useState(EVENT_TYPES[0].theme);
  // the design: a template id, or "" for a simple colour theme (`theme` preset)
  const [template, setTemplate] = useState(templatesFor("wedding")[0].id);
  const [classic, setClassic] = useState(false);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("light");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function create(ev) {
    ev.preventDefault();
    setBusy(true);
    setError("");
    try {
      const t = template && getTemplate(template);
      const body = { title: title.trim() || "My Invitation", eventType, themePreset: theme, mode };
      if (t) Object.assign(body, { theme: templateTheme(t), heroLayout: t.heroLayout, heroFoil: !!t.design.foil });
      const d = await api("/invitations", { method: "POST", body });
      router.replace(`/dashboard/edit/${d.invitation._id}`);
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl pb-10">
      <p className="eyebrow">
        <span className="h-px w-8 bg-brand-600/40" /> New invitation
      </p>
      <h1 className="display mt-4 text-[2.6rem] leading-[1.02] sm:text-6xl">
        What are we <em className="text-brand-600">celebrating?</em>
      </h1>
      <p className="mt-4 max-w-xl leading-relaxed text-ink/65">We&apos;ll prepare it with elegant sample content you can change in the editor.</p>

      <Step n="I">Choose the occasion</Step>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {EVENT_TYPES.map(({ id, label, hint, Icon, theme: t }) => {
          const active = eventType === id;
          return (
            <button
              type="button"
              key={id}
              onClick={() => {
                setEventType(id);
                setTheme(t);
                if (template) setTemplate(templatesFor(id)[0].id);
              }}
              className={`relative flex flex-col items-start gap-2 rounded-2xl border bg-white p-4 text-left transition ${active ? "border-ink shadow-[0_18px_40px_-24px_rgba(28,26,61,.6)]" : "border-ink/[0.07] hover:border-ink/25"}`}
            >
              <span className={`grid h-10 w-10 place-items-center rounded-2xl ${active ? "bg-ink text-gold" : "bg-brand-50 text-brand-600"}`}>
                <Icon className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <span className="font-serif text-lg leading-tight text-ink">{label}</span>
              <span className="text-xs text-ink-500">{hint}</span>
              {active && <Check className="absolute right-4 top-4 h-4 w-4 text-ink" />}
            </button>
          );
        })}
      </div>

      <Step n="II">Choose a design</Step>
      {!classic ? (
        <>
          <div className="no-scrollbar -mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {templatesFor(eventType).map((t) => {
              const active = template === t.id;
              const fits = t.events.includes(eventType);
              return (
                <div
                  key={t.id}
                  className={`group relative w-44 shrink-0 snap-start overflow-hidden rounded-2xl border bg-white text-left transition focus-within:ring-2 focus-within:ring-brand-500 sm:w-auto ${active ? "border-ink shadow-[0_18px_40px_-24px_rgba(28,26,61,.6)] ring-2 ring-gold/50" : "border-ink/[0.07] hover:border-ink/25"}`}
                >
                  <span className="relative block">
                    <TemplatePreview template={t} eventType={eventType} />
                    {fits && (
                      <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink shadow-sm">Suits {eventType === "baby-shower" ? "baby showers" : "this event"}</span>
                    )}
                    {active && (
                      <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-ink text-cream">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </span>
                  <span className="block border-t border-ink/[0.06] p-3">
                    <span className="block font-serif text-lg leading-tight text-ink">{t.label}</span>
                    <span className="mt-0.5 line-clamp-2 block text-xs text-ink-500">{t.tagline}</span>
                  </span>
                  <button type="button" onClick={() => setTemplate(t.id)} aria-pressed={active} aria-label={`Use the ${t.label} template`} className="absolute inset-0 z-10 cursor-pointer outline-none" />
                </div>
              );
            })}
          </div>
          <button type="button" onClick={() => { setClassic(true); setTemplate(""); }} className="mt-2 text-xs font-semibold text-ink-500 underline underline-offset-2 hover:text-ink">
            Prefer a simple colour theme instead?
          </button>
        </>
      ) : (
        <>
          <div className="no-scrollbar -mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-4">
            {Object.entries(THEMES).map(([id, t]) => {
              const active = theme === id;
              const entry = ENTRY_STYLES.find((e) => e.id === t.entryStyle);
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => setTheme(id)}
                  className={`w-40 shrink-0 overflow-hidden rounded-2xl border bg-white text-left transition sm:w-auto ${active ? "border-ink shadow-[0_18px_40px_-24px_rgba(28,26,61,.6)]" : "border-ink/[0.07] hover:border-ink/25"}`}
                >
                  <div className="relative h-24" style={{ background: entry?.swatch || t.primary }}>
                    <div className="absolute inset-0" style={{ background: "rgba(0,0,0,.12)", clipPath: "polygon(0 0, 100% 0, 50% 62%)" }} />
                    <WaxSeal color={t.sealColor} icon={t.sealIcon} monogram="A&A" className="absolute left-1/2 top-[62%] w-12 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-full" style={{ background: t.primary }} />
                      <span className="h-3 w-3 rounded-full" style={{ background: t.secondary }} />
                      <span className="truncate text-sm font-bold text-ink">{t.label}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-ink-500">{entry?.label}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <button type="button" onClick={() => { setClassic(false); setTemplate(templatesFor(eventType)[0].id); }} className="mt-2 text-xs font-semibold text-ink-500 underline underline-offset-2 hover:text-ink">
            Back to design templates
          </button>
        </>
      )}

      <Step n="III">Light or dark?</Step>
      <div className="mt-4 grid max-w-md grid-cols-2 gap-3" role="radiogroup" aria-label="Invitation appearance">
        {[
          ["light", "Light", "Soft, bright paper tones", Sun, "#fffaf3", "#1c1a3d"],
          ["dark", "Dark", "Deep, glowing evening look", Moon, "#16141f", "#f3eadb"],
        ].map(([v, label, hint, Icon, bg, fg]) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={mode === v}
            onClick={() => setMode(v)}
            className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${mode === v ? "border-ink shadow-[0_18px_40px_-24px_rgba(28,26,61,.6)]" : "border-ink/[0.07] bg-white hover:border-ink/25"}`}
          >
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl" style={{ background: bg, color: fg, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08)" }}>
              <Icon className="h-6 w-6" strokeWidth={1.6} />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink">{label}</span>
              <span className="block text-xs text-ink-500">{hint}</span>
            </span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-ink-500">This is how guests will see your invitation. You can switch it any time in the editor.</p>

      <form onSubmit={create}>
      <Step n="IV">Give it a name</Step>
      <input className="input mt-4 !rounded-2xl !py-3.5 !text-base" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Ayesha weds Ahmed" />
      <p className="mt-2 text-xs text-ink-500">This also becomes your link, e.g. /i/ayesha-weds-ahmed. You can change it later.</p>

      {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}
      <div className="mt-12 flex justify-stretch border-t border-ink/10 pt-8 sm:justify-end">
        <button disabled={busy} className="btn-primary w-full !px-8 !py-4 !text-base sm:w-auto">
          {busy && <Spinner className="h-4 w-4" />} Create & start editing <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      </form>
    </div>
  );
}
