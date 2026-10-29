"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { EVENT_TYPES } from "@/data/eventTypes";
import { ENTRY_STYLES, THEMES } from "@/data/themes";
import { api } from "@/lib/api";
import Spinner from "@/components/ui/Spinner";
import LogoLoader from "@/components/ui/LogoLoader";
import { defaultMusicFor } from "@/data/music";
import WaxSeal from "@/components/invite/entry/WaxSeal";
import TemplatePreview from "@/components/site/TemplatePreview";
import { getTemplate, templateTheme, templatesFor } from "@/data/templates";

const STEPS = ["Occasion", "Design", "Look", "Name"];

// A horizontal slider: swipe on touch screens, arrow buttons on the sides.
// Each arrow shows only when there is more to see on that side.
function Slider({ children }) {
  const track = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const check = () => setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    check();
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, []);
  const slide = (dir) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="relative mt-4">
      <div ref={track} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-3 sm:mx-0 sm:gap-4 sm:px-0">
        {children}
      </div>
      {[-1, 1].filter((dir) => !(dir < 0 ? edges.start : edges.end)).map((dir) => (
        <button
          key={dir}
          type="button"
          onClick={() => slide(dir)}
          aria-label={dir < 0 ? "Previous designs" : "More designs"}
          className={`absolute top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-ink/10 bg-white text-ink shadow-lg transition hover:bg-cream sm:grid ${dir < 0 ? "left-1" : "right-1"}`}
        >
          {dir < 0 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      ))}
    </div>
  );
}

function Step({ n, children }) {
  return (
    <h2 className="mt-4 flex items-baseline gap-4">
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
  const [step, setStep] = useState(0); // 0 occasion · 1 design · 2 light/dark · 3 name
  const last = step === STEPS.length - 1;

  const body = useRef(null);
  function go(n) {
    setStep(n);
    body.current?.scrollTo({ top: 0 });
  }

  async function create(ev) {
    ev.preventDefault();
    setBusy(true);
    setError("");
    try {
      const t = template && getTemplate(template);
      const song = defaultMusicFor(eventType); // a soft track that suits the occasion (changeable in Settings)
      const body = { title: title.trim() || "My Invitation", eventType, themePreset: theme, mode, music: { url: song.src, title: song.title, enabled: true } };
      if (t) Object.assign(body, { theme: templateTheme(t), heroLayout: t.heroLayout, heroFoil: !!t.design.foil });
      const d = await api("/invitations", { method: "POST", body });
      // ?new=1: the editor keeps the same animated loader up while it opens
      router.replace(`/dashboard/edit/${d.invitation._id}?new=1`);
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  return (
    // not one big <form>: the design previews contain the invitation's own RSVP form
    // Sized to the screen (below the 4rem header, above the fixed bar) so the page itself never scrolls;
    // a step that needs more room scrolls inside its own area.
    <div className="mx-auto -mb-16 -mt-6 flex max-w-4xl flex-col sm:-mt-10" style={{ height: "calc(100dvh - 4rem - 1rem - 4.75rem)" }}>
      {busy && <LogoLoader />}
      <p className="eyebrow">
        <span className="h-px w-8 bg-brand-600/40" /> New invitation
      </p>
      <h1 className="display mt-2 text-[2rem] leading-[1.05] sm:text-5xl">
        What are we <em className="text-brand-600">celebrating?</em>
      </h1>
      <p className="mt-2 hidden max-w-xl text-sm leading-relaxed text-ink/65 [@media(min-height:800px)]:block">We&apos;ll prepare it with elegant sample content you can change in the editor.</p>

      {/* progress: finished steps can be revisited */}
      <ol className="mt-4 flex shrink-0 items-center gap-2 border-y border-ink/10 py-3 sm:gap-3" aria-label="Steps">
        {STEPS.map((label, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={label} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => done && go(i)}
                disabled={!done}
                aria-current={current ? "step" : undefined}
                className="flex min-w-0 items-center gap-2 text-left disabled:cursor-default"
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition ${
                    current ? "bg-ink text-cream" : done ? "bg-gold/25 text-ink" : "bg-ink/[0.06] text-ink-500"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className={`hidden truncate text-sm font-semibold sm:block ${current ? "text-ink" : "text-ink-500"}`}>{label}</span>
              </button>
              {i < STEPS.length - 1 && <span className={`h-px flex-1 ${done ? "bg-ink/40" : "bg-ink/10"}`} aria-hidden />}
            </li>
          );
        })}
      </ol>

      <div ref={body} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-1 pb-4">
      {step === 0 && (
      <>
      <Step n="I">Choose the occasion</Step>
      <div className="mt-3 grid grid-cols-3 gap-2 min-[420px]:grid-cols-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-4">
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
              className={`relative flex flex-col items-center gap-1.5 rounded-2xl border bg-white px-1.5 py-2.5 text-center transition min-[420px]:flex-row min-[420px]:gap-3 min-[420px]:p-3 min-[420px]:text-left ${active ? "border-ink shadow-[0_18px_40px_-24px_rgba(28,26,61,.6)]" : "border-ink/[0.07] hover:border-ink/25"}`}
            >
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl min-[420px]:h-10 min-[420px]:w-10 ${active ? "bg-ink text-gold" : "bg-brand-50 text-brand-600"}`}>
                <Icon className="h-5 w-5" strokeWidth={1.7} />
              </span>
              {/* the full name, never cut off: small phones stack the icon above it, wider cards sit side by side */}
              <span className="min-w-0 font-serif text-[13px] leading-tight text-ink min-[420px]:pr-4 min-[420px]:text-[15px] sm:text-lg" title={hint}>
                {label}
              </span>
              {active && <Check className="absolute right-2 top-2 h-3.5 w-3.5 text-ink min-[420px]:right-3 min-[420px]:top-3 min-[420px]:h-4 min-[420px]:w-4" />}
            </button>
          );
        })}
      </div>

      </>
      )}

      {step === 1 && (
      <>
      <Step n="II">Choose a design</Step>
      {!classic ? (
        <>
          {/* card width follows the screen height (9:16 previews), so the step fits without scrolling */}
          <Slider>
            {templatesFor(eventType).map((t) => {
              const active = template === t.id;
              const fits = t.events.includes(eventType);
              return (
                <div
                  key={t.id}
                  style={{ width: "clamp(8.5rem, min(calc((100dvh - 30.5rem) * 0.5625), 44vw), 13rem)" }}
                  className={`group relative shrink-0 snap-start overflow-hidden rounded-2xl border bg-white text-left transition focus-within:ring-2 focus-within:ring-brand-500 ${active ? "border-ink shadow-[0_18px_40px_-24px_rgba(28,26,61,.6)] ring-2 ring-gold/50" : "border-ink/[0.07] hover:border-ink/25"}`}
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
                  <span className="block border-t border-ink/[0.06] px-3 py-2.5">
                    <span className="block truncate font-serif text-base leading-tight text-ink">{t.label}</span>
                    <span className="mt-0.5 block truncate text-xs text-ink-500" title={t.tagline}>{t.tagline}</span>
                  </span>
                  <button type="button" onClick={() => setTemplate(t.id)} aria-pressed={active} aria-label={`Use the ${t.label} template`} className="absolute inset-0 z-10 cursor-pointer outline-none" />
                </div>
              );
            })}
          </Slider>
          <button type="button" onClick={() => { setClassic(true); setTemplate(""); }} className="mt-2 text-xs font-semibold text-ink-500 underline underline-offset-2 hover:text-ink">
            Prefer a simple colour theme instead?
          </button>
        </>
      ) : (
        <>
          <Slider>
            {Object.entries(THEMES).map(([id, t]) => {
              const active = theme === id;
              const entry = ENTRY_STYLES.find((e) => e.id === t.entryStyle);
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => setTheme(id)}
                  className={`w-40 shrink-0 snap-start overflow-hidden rounded-2xl border bg-white text-left transition sm:w-48 ${active ? "border-ink shadow-[0_18px_40px_-24px_rgba(28,26,61,.6)]" : "border-ink/[0.07] hover:border-ink/25"}`}
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
          </Slider>
          <button type="button" onClick={() => { setClassic(false); setTemplate(templatesFor(eventType)[0].id); }} className="mt-2 text-xs font-semibold text-ink-500 underline underline-offset-2 hover:text-ink">
            Back to design templates
          </button>
        </>
      )}

      </>
      )}

      {step === 2 && (
      <>
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

      </>
      )}

      {last && (
      <form id="new-invite" onSubmit={create}>
      <Step n="IV">Give it a name</Step>
      <input autoFocus className="input mt-4 !rounded-2xl !py-3.5 !text-base" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Our Celebration" />
      <p className="mt-2 text-xs text-ink-500">This also becomes your link, e.g. /i/our-celebration. You can change it later.</p>

      {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}
      </form>
      )}
      </div>

      {/* fixed to the bottom of the screen: back, where you are, next (create on the last step) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-cream/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-6">
          {step > 0 ? (
            <button type="button" onClick={() => go(step - 1)} className="btn-secondary !px-4">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <span className="w-[5.5rem]" aria-hidden />
          )}
          <p className="flex-1 text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            Step {step + 1} of {STEPS.length}
          </p>
          {/* the last step submits the name form (Enter in the field does the same) */}
          <button
            type={last ? "submit" : "button"}
            form={last ? "new-invite" : undefined}
            onClick={last ? undefined : () => go(step + 1)}
            disabled={busy}
            className="btn-primary !px-6"
          >
            {last ? (
              <>
                {busy && <Spinner className="h-4 w-4" />} Create<span className="hidden sm:inline">&nbsp;&amp; start editing</span>
              </>
            ) : (
              <>Next</>
            )}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
