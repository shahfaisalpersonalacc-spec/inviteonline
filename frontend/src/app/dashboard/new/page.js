"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Moon, Plus, Sun, X } from "lucide-react";
import { EVENT_TYPES } from "@/data/eventTypes";
import { ENTRY_STYLES, THEMES } from "@/data/themes";
import { api } from "@/lib/api";
import { isLink } from "@/lib/format";
import Spinner from "@/components/ui/Spinner";
import LogoLoader from "@/components/ui/LogoLoader";
import { defaultMusicFor } from "@/data/music";
import WaxSeal from "@/components/invite/entry/WaxSeal";
import TemplatePreview from "@/components/site/TemplatePreview";
import { getTemplate, templateTheme, templatesFor } from "@/data/templates";

const STEPS = ["Occasion", "Design", "Look & entrance", "Names", "Families", "Programme", "Contact"];
const COUPLE = ["wedding", "nikah", "walima", "mehndi", "engagement", "anniversary"];
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

// <input type="date"> value "2026-12-20" -> ISO, at the start of that day in the owner's time zone
const toIso = (v) => (v ? new Date(`${v}T00:00`).toISOString() : undefined);
// <input type="time"> value "18:30" -> "6:30 PM" (how times are shown on the invitation)
const to12h = (v) => {
  if (!v) return "";
  const [h, m] = v.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};
// Phone: a 10-digit mobile number, digits only (e.g. 9876543210).
const PHONE_CHARS = /\D/g;
const phoneError = (v) => (!v || v.length === 10 ? "" : "Enter a 10-digit mobile number, e.g. 9876543210.");
// The design each occasion starts with (listed first, pre-selected); all others stay available.
const DEFAULT_TEMPLATE = {
  wedding: "bordeaux", walima: "bordeaux", engagement: "bordeaux", anniversary: "crimson-rose",
  nikah: "emerald-nikah", mehndi: "marigold-mehndi",
  birthday: "confetti-pop", party: "confetti-pop", graduation: "confetti-pop", "baby-shower": "little-star",
  corporate: "ivory-classic", other: "ivory-classic",
};
const designsFor = (eventType) => {
  const list = templatesFor(eventType);
  const first = DEFAULT_TEMPLATE[eventType] || "bordeaux";
  return [...list.filter((t) => t.id === first), ...list.filter((t) => t.id !== first)];
};
// A typical desi programme for each occasion (times are <input type="time"> values), editable in the step.
const PROGRAMMES = {
  wedding: [["20:00", "Baraat arrival"], ["20:30", "Nikah"], ["22:00", "Dinner"], ["23:30", "Rukhsati"]],
  nikah: [["16:30", "Guests arrive"], ["17:00", "Nikah ceremony"], ["17:45", "Dua & mithai"], ["18:00", "Hi-tea"]],
  walima: [["20:00", "Guests arrive"], ["21:00", "Couple's entry"], ["22:00", "Dinner"], ["23:30", "Farewell"]],
  mehndi: [["20:00", "Guests arrive"], ["21:00", "Mehndi rasam"], ["22:00", "Dholki & dances"], ["23:00", "Dinner"]],
  engagement: [["19:00", "Guests arrive"], ["20:00", "Ring ceremony"], ["21:00", "Dinner"]],
  anniversary: [["19:30", "Guests arrive"], ["20:30", "Cake cutting"], ["21:00", "Dinner"]],
  birthday: [["17:00", "Guests arrive"], ["18:00", "Cake cutting"], ["18:30", "Games & fun"], ["19:30", "Dinner"]],
  "baby-shower": [["16:00", "Guests arrive"], ["16:30", "Games"], ["17:30", "Gift opening"], ["18:00", "Hi-tea"]],
};
const programmeFor = (eventType) =>
  (PROGRAMMES[eventType] || [["19:00", "Guests arrive"], ["20:00", "Main event"], ["21:30", "Dinner"]]).map(([time, title]) => ({ time, title }));
// The wizard keeps a draft in this tab (sessionStorage), so a reload returns to the same step with
// everything filled in. It's cleared once the invitation is created.
const DRAFT_KEY = "new-invitation-draft";
function readDraft() {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "{}") || {};
  } catch {
    return {};
  }
}
const DEFAULT_THANKS = "Your presence is the greatest gift. We look forward to celebrating with you!";

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
      <div ref={track} className="no-scrollbar -mx-1 flex snap-x snap-mandatory scroll-px-1 gap-3 overflow-x-auto scroll-smooth px-1 pb-3 sm:gap-4">
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
      <span className="at-gold-text font-serif text-2xl italic">{n}.</span>
      <span className="font-serif text-2xl text-ink sm:text-[1.7rem]">{children}</span>
    </h2>
  );
}

export default function NewInvitationPage() {
  const router = useRouter();
  // (this page only renders in the browser, after the login check, so reading the draft here is safe)
  const [draft] = useState(readDraft);
  const [eventType, setEventType] = useState(draft.eventType ?? "wedding");
  const [theme, setTheme] = useState(draft.theme ?? EVENT_TYPES[0].theme);
  // the design: a template id, or "" for a simple colour theme (`theme` preset)
  const [template, setTemplate] = useState(draft.template ?? designsFor("wedding")[0].id);
  const [classic, setClassic] = useState(draft.classic ?? false);
  const [title, setTitle] = useState(draft.title ?? ""); // non-couple events: the invitation name
  const [bride, setBride] = useState(draft.bride ?? "");
  const [groom, setGroom] = useState(draft.groom ?? "");
  const couple = COUPLE.includes(eventType);
  // couple events: "Bride & Groom" on the cover and in the link
  const fullTitle = couple ? [bride.trim(), groom.trim()].filter(Boolean).join(" & ") : title.trim();
  const namesReady = couple ? !!(bride.trim() && groom.trim()) : !!title.trim();
  // the owner's details (all optional; anything left empty keeps the sample content)
  const [date, setDate] = useState((draft.date ?? "").slice(0, 10));
  const [families, setFamilies] = useState(draft.families ?? [
    { title: "", names: "" },
    { title: "", names: "" },
  ]);
  // a ready-made programme for the occasion, which the owner can adjust
  const [schedule, setSchedule] = useState(() => draft.schedule ?? programmeFor("wedding"));
  const [venue, setVenue] = useState(draft.venue ?? { name: "", address: "" });
  const [contact, setContact] = useState(draft.contact ?? { name: "", phone: "" });
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [closing, setClosing] = useState(draft.closing ?? DEFAULT_THANKS);
  const [mode, setMode] = useState(draft.mode ?? "light");
  const [entry, setEntry] = useState(draft.entry ?? null); // entrance (envelope / door); null = the design's own
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(draft.step ?? 0); // 0 occasion · 1 design · 2 light/dark · 3 name
  const last = step === STEPS.length - 1;
  const designEntry = (template && getTemplate(template)?.theme.entryStyle) || THEMES[theme]?.entryStyle || "burgundy-dove";
  const entryStyle = entry || designEntry;

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ step, eventType, theme, template, classic, mode, entry, title, bride, groom, date, families, schedule, venue, contact, closing }));
    } catch {}
  }, [step, eventType, theme, template, classic, mode, entry, title, bride, groom, date, families, schedule, venue, contact, closing]);

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
      const famTitles = couple ? ["Bride's family", "Groom's family"] : ["With love from", ""];
      const details = {
        date: toIso(date),
        families: families.map((f, i) => ({ title: f.title.trim() || famTitles[i] || "Family", names: f.names.trim() })).filter((f) => f.names),
        schedule: schedule.filter((x) => x.time || x.title.trim()).map((x) => ({ time: to12h(x.time), title: x.title.trim() })),
        // a pasted map link becomes the venue's map link, not its written address
        venue: isLink(venue.address) ? { name: venue.name, address: "", mapUrl: venue.address.trim() } : venue,
        contact,
        closing: closing.trim() || undefined,
      };
      const body = { title: fullTitle || "My Invitation", eventType, themePreset: theme, mode, details, music: { url: song.src, title: song.title, enabled: true } };
      if (t) Object.assign(body, { theme: { ...templateTheme(t), entryStyle }, heroLayout: t.heroLayout, heroFoil: !!t.design.foil });
      else body.theme = { entryStyle };
      const d = await api("/invitations", { method: "POST", body });
      try {
        sessionStorage.removeItem(DRAFT_KEY); // created: the next new invitation starts fresh
      } catch {}
      // ?new=1: the editor keeps the same animated loader up while it opens
      router.replace(`/dashboard/edit/${d.invitation._id}?new=1`);
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  return (
    // not one big <form>: the design previews contain the invitation's own RSVP form.
    // The wizard fills the screen between the 4rem header and the 4rem bottom bar (fixed, so it never
    // depends on the page padding); a step that needs more room scrolls inside its own area.
    <>
    <div className="fixed inset-x-0 top-16 z-10" style={{ bottom: "calc(4rem + env(safe-area-inset-bottom))" }}>
    <div className="mx-auto flex h-full max-w-5xl flex-col px-4 pt-3 sm:px-6 sm:pt-6">
      {busy && <LogoLoader />}
      <p className="eyebrow hidden sm:flex">
        <span className="h-px w-8 bg-brand-600/40" /> New invitation
      </p>
      {/* one line on phones */}
      <h1 className="display whitespace-nowrap text-[clamp(1.3rem,6.6vw,2rem)] leading-[1.1] sm:mt-2 sm:whitespace-normal sm:text-5xl">
        What are we <em className="text-brand-600">celebrating?</em>
      </h1>
      <p className="mt-2 hidden max-w-xl text-sm leading-relaxed text-ink/65 sm:[@media(min-height:800px)]:block">We&apos;ll prepare it with elegant sample content you can change in the editor.</p>

      {/* progress: finished steps can be revisited */}
      <ol className="at-glass mt-3 flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-2 sm:mt-4 sm:gap-3 sm:px-3 lg:gap-2" aria-label="Steps">
        {STEPS.map((label, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={label} className="flex min-w-0 flex-1 items-center gap-2 last:flex-none sm:gap-3 lg:min-w-max lg:gap-2">
              <button
                type="button"
                onClick={() => done && go(i)}
                disabled={!done}
                aria-current={current ? "step" : undefined}
                className="flex shrink-0 items-center gap-2 text-left disabled:cursor-default"
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-all duration-300 ${
                    current
                      ? "bg-ink text-cream shadow-[0_0_0_4px_rgba(233,205,132,.45)]"
                      : done
                        ? "bg-gradient-to-br from-[#f38a74] to-[#e8544a] text-white shadow-[0_6px_14px_-6px_rgba(232,84,74,.8)]"
                        : "bg-white text-ink-500 ring-1 ring-ink/10"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <span className={`hidden whitespace-nowrap text-[13px] font-semibold lg:block ${current ? "text-ink" : "text-ink-500"}`}>{label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <span className="h-0.5 min-w-3 flex-1 overflow-hidden rounded-full bg-ink/10" aria-hidden>
                  <span className={`block h-full bg-gradient-to-r from-[#e8544a] to-[#d9ae55] transition-all duration-500 ${done ? "w-full" : "w-0"}`} />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div ref={body} key={step} className="at-rise min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-1 pb-4">
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
                setSchedule(programmeFor(id));
                setClassic(false);
                setTemplate(designsFor(id)[0].id);
                setEntry(null); // the new design's own entrance
              }}
              className={`relative flex flex-col items-center gap-1.5 rounded-2xl border px-1.5 py-2.5 text-center transition min-[420px]:flex-row min-[420px]:gap-3 min-[420px]:p-3 min-[420px]:text-left ${active ? "border-ink bg-white shadow-[0_18px_40px_-24px_rgba(28,26,61,.6),0_0_0_4px_rgba(233,205,132,.3)]" : "border-white/80 bg-white/60 backdrop-blur hover:-translate-y-0.5 hover:border-[#d9b45e]/60 hover:bg-white/90"}`}
            >
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl min-[420px]:h-10 min-[420px]:w-10 ${active ? "bg-ink text-gold dark:text-[#a87a2a]" : "bg-brand-50 text-brand-600"}`}>
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
            {designsFor(eventType).map((t) => {
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
          <button type="button" onClick={() => { setClassic(false); setTemplate(designsFor(eventType)[0].id); }} className="mt-2 text-xs font-semibold text-ink-500 underline underline-offset-2 hover:text-ink">
            Back to design templates
          </button>
        </>
      )}

      </>
      )}

      {step === 2 && (
      <>
      <Step n="III">Light or dark?</Step>
      <div className="mt-3 grid max-w-md grid-cols-2 gap-3" role="radiogroup" aria-label="Invitation appearance">
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

      <h3 className="mt-4 font-serif text-xl text-ink">Choose the entrance</h3>
      <p className="mt-1 text-xs text-ink-500">What guests tap to open your invitation: an envelope with a wax seal, or a door that swings open.</p>
      <Slider>
        {ENTRY_STYLES.map((e) => {
          const active = entryStyle === e.id;
          const seal = (template && getTemplate(template)?.theme.sealColor) || THEMES[theme]?.sealColor || "#c9a24a";
          return (
            <button
              type="button"
              key={e.id}
              onClick={() => setEntry(e.id)}
              aria-pressed={active}
              className={`relative w-28 shrink-0 snap-start overflow-hidden rounded-2xl border bg-white text-left transition sm:w-32 ${active ? "border-ink shadow-[0_18px_40px_-24px_rgba(28,26,61,.6)] ring-2 ring-gold/50" : "border-ink/[0.07] hover:border-ink/25"}`}
            >
              <span className="relative block aspect-[4/5]" style={{ background: e.swatch }}>
                {e.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.photo} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <>
                    <span className="absolute inset-0" style={{ background: "rgba(0,0,0,.14)", clipPath: "polygon(0 0, 100% 0, 50% 58%)" }} />
                    <WaxSeal color={seal} icon="monogram" monogram="A&A" className="absolute left-1/2 top-[58%] w-10 -translate-x-1/2 -translate-y-1/2" />
                  </>
                )}
                {active && (
                  <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-cream">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                {e.id === designEntry && (
                  <span className="absolute bottom-1.5 left-1.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink shadow-sm">With design</span>
                )}
              </span>
              <span className="block truncate px-2 py-1.5 text-xs font-semibold text-ink">{e.label}</span>
            </button>
          );
        })}
      </Slider>

      </>
      )}

      {step >= 3 && (
      // details steps: Enter moves on, and creates on the last one. All optional ("leave empty to keep the sample").
      <form
        id="new-invite"
        onSubmit={(e) => {
          e.preventDefault();
          if (step === 3 && (!namesReady || !date)) return; // names and date are required (the browser shows which)
          if (last && phoneError(contact.phone)) return setPhoneTouched(true); // fix the number first
          if (last) create(e);
          else go(step + 1);
        }}
        className="at-glass mt-4 rounded-3xl px-4 pb-5 pt-1 sm:mt-5 sm:px-7 sm:pb-7"
      >
      <Step n={ROMAN[step]}>
        {["", "", "", "Names & date", "With the blessings of", "Programme & venue", "Contact & thank-you"][step]}
      </Step>
      <p className="mt-1 text-xs text-ink-500">
        {step === 3 ? "Both are needed: they go on the cover, the scratch card and the countdown." : "Optional: anything you leave empty keeps the sample text, and you can change it all later in the editor."}
      </p>

      {step === 3 && (
        <div className="mt-4 space-y-4">
          {couple ? (
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="label">{eventType === "anniversary" ? "Wife's name" : "Bride's name"} *</span>
                  <input autoFocus required className="input" maxLength={55} value={bride} onChange={(e) => setBride(e.target.value)} placeholder="e.g. Ayesha" autoComplete="off" />
                </label>
                <label className="block">
                  <span className="label">{eventType === "anniversary" ? "Husband's name" : "Groom's name"} *</span>
                  <input required className="input" maxLength={55} value={groom} onChange={(e) => setGroom(e.target.value)} placeholder="e.g. Ahmed" autoComplete="off" />
                </label>
              </div>
              <span className="mt-1 block text-xs text-ink-500">
                Shown on the cover as &ldquo;{fullTitle || "Ayesha & Ahmed"}&rdquo; and used for your link. You can change it later.
              </span>
            </div>
          ) : (
            <label className="block">
              <span className="label">Invitation name *</span>
              <input autoFocus required className="input" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Our Celebration" />
              <span className="mt-1 block text-xs text-ink-500">Shown on the cover and used for your link. You can change it later.</span>
            </label>
          )}
          <label className="block">
            <span className="label">Date *</span>
            <input type="date" required className="input" value={date} onChange={(e) => setDate(e.target.value)} />
            <span className="mt-1 block text-xs text-ink-500">Used on the cover, the scratch card and the countdown.</span>
          </label>
        </div>
      )}

      {step === 4 && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(COUPLE.includes(eventType) ? ["Bride's family", "Groom's family"] : ["Hosted by"]).map((label, i) => (
            <label key={label} className="block">
              <span className="label">{label}</span>
              <textarea
                rows={3}
                className="input resize-none"
                maxLength={300}
                value={families[i].names}
                onChange={(e) => setFamilies((f) => f.map((x, j) => (j === i ? { ...x, names: e.target.value } : x)))}
                placeholder={"e.g. Mr. & Mrs. Khan\nGrandparents & family"}
              />
            </label>
          ))}
        </div>
      )}

      {step === 5 && (
        <div className="mt-4 space-y-4">
          <div>
            <span className="label">Programme</span>
            <div className="space-y-2">
              {schedule.map((x, i) => (
                <div key={i} className="flex gap-2">
                  <input type="time" className="input !w-36 shrink-0" value={x.time} onChange={(e) => setSchedule((l) => l.map((y, j) => (j === i ? { ...y, time: e.target.value } : y)))} aria-label={`Time ${i + 1}`} />
                  <input className="input" maxLength={80} value={x.title} onChange={(e) => setSchedule((l) => l.map((y, j) => (j === i ? { ...y, title: e.target.value } : y)))} placeholder={["Guests arrive", "Main ceremony", "Dinner"][i] || "What happens"} aria-label={`What happens ${i + 1}`} />
                  {schedule.length > 1 && (
                    <button type="button" onClick={() => setSchedule((l) => l.filter((_, j) => j !== i))} className="grid w-10 shrink-0 place-items-center rounded-xl text-ink-500 hover:bg-ink/5" aria-label={`Remove item ${i + 1}`}>
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {schedule.length < 12 && (
              <button type="button" onClick={() => setSchedule((l) => [...l, { time: "", title: "" }])} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-ink underline underline-offset-2">
                <Plus className="h-3.5 w-3.5" /> Add an item
              </button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="label">Venue name</span>
              <input className="input" maxLength={120} value={venue.name} onChange={(e) => setVenue((v) => ({ ...v, name: e.target.value }))} placeholder="e.g. Pearl Continental" />
            </label>
            <label className="block">
              <span className="label">Address</span>
              <input className="input" maxLength={500} value={venue.address} onChange={(e) => setVenue((v) => ({ ...v, address: e.target.value }))} placeholder="Street, area, city" />
              <span className="mt-1 block text-xs text-ink-500">Tip: you can paste the exact Google Maps link here instead, and guests will open that spot directly.</span>
            </label>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="label">Contact name</span>
              <input className="input" maxLength={80} value={contact.name} onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))} placeholder="e.g. Usman (brother)" />
            </label>
            <label className="block">
              <span className="label">Phone / WhatsApp</span>
              <input
                type="tel"
                autoComplete="tel"
                className={`input ${phoneTouched && phoneError(contact.phone) ? "!border-red-400" : ""}`}
                maxLength={10}
                inputMode="numeric"
                value={contact.phone}
                onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value.replace(PHONE_CHARS, "") }))}
                onBlur={() => setPhoneTouched(true)}
                aria-invalid={phoneTouched && !!phoneError(contact.phone)}
                aria-describedby="phone-help"
                placeholder="e.g. 9876543210"
              />
              <span id="phone-help" className={`mt-1 block text-xs ${phoneTouched && phoneError(contact.phone) ? "text-red-600" : "text-ink-500"}`}>
                {(phoneTouched && phoneError(contact.phone)) || "Guests can call or WhatsApp this number."}
              </span>
            </label>
          </div>
          <label className="block">
            <span className="label">Thank-you message</span>
            <textarea rows={3} className="input resize-none" maxLength={400} value={closing} onChange={(e) => setClosing(e.target.value)} placeholder={DEFAULT_THANKS} />
          </label>
        </div>
      )}

      {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}
      </form>
      )}
      </div>

    </div>
    </div>
      {/* fixed to the bottom of the screen: back, where you are, next (create on the last step) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/80 bg-[#fbf6ee]/80 pb-[env(safe-area-inset-bottom)] dark:bg-[#15142a]/85 shadow-[0_-20px_40px_-30px_rgba(70,45,20,.35)] backdrop-blur-xl">
        <span className="absolute inset-x-0 -top-px h-0.5 bg-ink/5" aria-hidden>
          <span className="block h-full bg-gradient-to-r from-[#d9ae55] via-[#e8544a] to-[#d23d52] transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </span>
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4 sm:px-6">
          {step > 0 ? (
            <button type="button" onClick={() => go(step - 1)} className="btn-secondary !px-4">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            // step 1: back to the dashboard
            <Link href="/dashboard" className="btn-secondary !px-4">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          )}
          <p className="flex-1 whitespace-nowrap text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500 min-[360px]:text-xs min-[360px]:tracking-[0.18em]">
            Step {step + 1} of {STEPS.length}
          </p>
          {/* the details steps submit their form (Enter in a field does the same) */}
          {/* key: a different element for "submit", so the click on step 3's Next can't also submit step 4 */}
          <button
            key={step >= 3 ? "submit" : "next"}
            type={step >= 3 ? "submit" : "button"}
            form={step >= 3 ? "new-invite" : undefined}
            onClick={step >= 3 ? undefined : () => go(step + 1)}
            disabled={busy}
            className="btn-primary !px-6"
          >
            {last ? (
              <>
                {busy && <Spinner className="h-4 w-4" />}
                {/* one element, so the button's flex gap doesn't open up inside the label */}
                <span>
                  Create<span className="hidden sm:inline"> &amp; start editing</span>
                </span>
              </>
            ) : (
              <>Next</>
            )}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}
