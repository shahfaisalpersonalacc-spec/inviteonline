import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Check, Feather, Gift, Heart, Image as ImageIcon, ListChecks, Lock, MailOpen, MapPin, Music, Palette,
  Plus, QrCode, Sparkles, Stamp, Ticket,
} from "lucide-react";
import Navbar from "@/components/site/Navbar";
import DashboardRedirect from "@/components/site/DashboardRedirect";
import Footer from "@/components/site/Footer";
import LiveDemo from "@/components/site/LiveDemo";
import { EntranceGallery, ScratchDemo } from "@/components/site/Showcases";
import TemplateGallery from "@/components/site/TemplateGallery";
import WaxSeal from "@/components/invite/entry/WaxSeal";
import { EVENT_TYPES } from "@/data/eventTypes";

const FEATURES = [
  { Icon: Stamp, title: "Wax-sealed entrances", text: "Six envelopes and seven real photographed doors that open onto a decorated wedding venue." },
  { Icon: Ticket, title: "Scratch to reveal", text: "A gold-foil card hides the date until guests scratch it away." },
  { Icon: Palette, title: "Couture themes", text: "Twelve palettes with paired fonts, in light or evening dark." },
  { Icon: Feather, title: "Your story", text: "The couple, the families, a verse and a timeline of moments." },
  { Icon: ImageIcon, title: "Photos & stickers", text: "Arched portraits, a gallery with lightbox and 77 vector stickers." },
  { Icon: MapPin, title: "Venues & directions", text: "Each event with its own map, directions and add-to-calendar." },
  { Icon: ListChecks, title: "RSVP & guest list", text: "Guests reply in seconds. Track headcount and export to Excel." },
  { Icon: MailOpen, title: "Guestbook wishes", text: "Family and friends leave messages right on your page." },
  { Icon: Music, title: "Background music", text: "Your song begins the moment the envelope opens." },
  { Icon: Gift, title: "Gifts, gracefully", text: "Share bank or wallet details with one-tap copy, if you wish." },
  { Icon: Lock, title: "Private if you like", text: "Protect the page with a password, or share it openly." },
  { Icon: QrCode, title: "QR for printed cards", text: "Download a QR code that opens your invitation from paper." },
];

// icon orbs, in turn: champagne, coral, lilac, sage
const ORBS = [
  "from-[#f7e2ad] to-[#d9ae55] text-[#6d4c12]",
  "from-[#ffc7bb] to-[#e8544a] text-white",
  "from-[#e9dcfa] to-[#a58bd6] text-white",
  "from-[#c9f2dc] to-[#2fb27a] text-white",
];

const STEPS = [
  { title: "Choose your entrance", text: "Pick the occasion, a theme, light or dark, and the envelope or doors guests will open." },
  { title: "Make it yours", text: "Add names, photos, events, music and stickers. Every change previews live as you type." },
  { title: "Share one link", text: "Send it on WhatsApp, Instagram or anywhere. Guests need no app and no account." },
];

const MOMENTS = ["Tap the seal", "Scratch the date", "Count down the days", "Find the venue", "RSVP in seconds", "Leave a wish", "Hear your song"];

const FAQ = [
  { q: "Do my guests need an account or an app?", a: "No. Anyone with your link opens the invitation in their browser, RSVPs and leaves wishes. Only you can edit it." },
  { q: "Can I change details after sharing?", a: "Yes. Edits appear instantly on the same link, so there's nothing to resend." },
  { q: "Will it look good on every phone?", a: "Every invitation is designed mobile-first and adapts to any screen, from small phones to desktops." },
  { q: "Can I keep my invitation private?", a: "Yes. Add a password in settings and only guests who know it can view the page." },
  { q: "Can I download my RSVP list?", a: "Yes. Export every response to a CSV file that opens in Excel or Google Sheets." },
];

// Section opener used throughout the page: roman numeral, label, headline. `light` is for the night panels.
function Chapter({ n, label, title, children, light = false, className = "" }) {
  return (
    <div className={className}>
      <p className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] ${light ? "text-gold" : "text-gold-600"}`}>
        <span className="font-serif text-base font-normal normal-case italic tracking-normal">{n}.</span>
        <span className={`h-px w-8 ${light ? "bg-gold/50" : "bg-gold-600/50"}`} />
        {label}
      </p>
      <h2 className={`display mt-5 text-[2.5rem] leading-[1.02] sm:text-[3.4rem] lg:text-[4rem] ${light ? "!text-cream" : ""}`}>{title}</h2>
      {children && <p className={`mt-5 max-w-xl text-[1.05rem] leading-relaxed ${light ? "text-cream/65" : "text-ink/65"}`}>{children}</p>}
    </div>
  );
}

// An evening panel floating on the page. `at-light` keeps its own (night) colours in both themes.
function NightPanel({ id, children, className = "" }) {
  return (
    <section id={id} className="scroll-mt-20 px-3 sm:px-4">
      <div className={`at-light grain grain-dark relative mx-auto max-w-[90rem] overflow-hidden rounded-[2.5rem] bg-night text-cream ring-1 ring-white/[0.06] ${className}`}>{children}</div>
    </section>
  );
}

// Slowly turning gold rings behind a night panel's content.
function Rings({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <div className="absolute inset-0 animate-[spin_70s_linear_infinite] rounded-full border border-dashed border-gold/20 motion-reduce:animate-none" />
      <div className="absolute inset-[12%] animate-[spin_50s_linear_infinite_reverse] rounded-full border border-gold/15 motion-reduce:animate-none" />
    </div>
  );
}

function SeeBadge() {
  return (
    <div className="at-light absolute -top-3 right-0 z-10 grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-gradient-to-br from-[#fff1c9] via-[#f5c451] to-[#d9ae55] shadow-[0_14px_30px_-14px_rgba(28,26,61,.6)] ring-4 ring-white/60 sm:-right-6 sm:top-6 sm:h-28 sm:w-28" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="animate-rotate-badge absolute inset-0 h-full w-full">
        <defs>
          <path id="badge-ring" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text fill="#1c1a3d" fontSize="10.5" fontWeight="700" letterSpacing="2.4">
          <textPath href="#badge-ring" textLength="272">TAP THE SEAL ✦ TAP THE SEAL ✦</textPath>
        </text>
      </svg>
      <Stamp className="h-6 w-6 text-ink sm:h-7 sm:w-7" strokeWidth={1.6} />
    </div>
  );
}

export default function Home() {
  return (
    <div className="atelier relative min-h-screen">
      {/* with a saved session the page starts covered (authPendingScript in app/layout.js) */}
      <DashboardRedirect />
      {/* a soft gold dawn at the top of the page (under the navbar too), coral to the left */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[780px] bg-[radial-gradient(ellipse_55%_60%_at_72%_18%,rgba(243,213,140,.35),transparent_70%),radial-gradient(ellipse_45%_45%_at_8%_35%,rgba(243,138,116,.16),transparent_70%)] dark:bg-[radial-gradient(ellipse_55%_60%_at_72%_18%,rgba(217,180,94,.16),transparent_70%),radial-gradient(ellipse_45%_45%_at_8%_35%,rgba(232,84,74,.14),transparent_70%)]"
        aria-hidden="true"
      />
      <Navbar />
      <main id="main" className="overflow-x-clip">
        {/* ================= Hero ================= */}
        <section className="relative">
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-10 sm:px-6 md:pt-14 lg:grid-cols-[1.1fr_.9fr] lg:gap-8 lg:pb-28">
            <div className="text-center lg:text-left">
              <p className="at-glass at-rise inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-gold-600 sm:text-[11px]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>
                  <span className="hidden min-[420px]:inline">Online invitations</span>
                  <span className="min-[420px]:hidden">Invitations</span> for every celebration
                </span>
              </p>
              <h1 className="display at-rise mt-6 text-[clamp(3.1rem,11.5vw,6.6rem)] leading-[0.94]" style={{ "--i": 1 }}>
                Invitations
                <br />
                worth{" "}
                <em className="relative inline-block">
                  opening.
                  <svg viewBox="0 0 220 18" className="absolute -bottom-1 left-0 w-full sm:-bottom-2" fill="none" aria-hidden="true">
                    <path d="M3 13 C 55 4, 130 2, 217 9" stroke="#e2bf6b" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </em>
              </h1>
              <p className="at-rise mx-auto mt-8 max-w-[34rem] text-[1.08rem] leading-relaxed text-ink/70 sm:text-lg lg:mx-0" style={{ "--i": 2 }}>
                Guests tap a wax seal, the envelope opens, and your whole celebration unfolds: events, photos, RSVPs and wishes, on one link you share anywhere.
              </p>
              <div className="at-rise mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start" style={{ "--i": 3 }}>
                <Link href="/login" className="btn-coral w-full !px-7 !py-4 !text-base sm:w-auto">
                  Create your invitation <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#entrances" className="btn-secondary w-full !px-6 !py-4 !text-[0.95rem] sm:w-auto">
                  See all twelve entrances <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
              <dl className="at-glass at-rise mx-auto mt-10 grid max-w-md grid-cols-3 divide-x divide-gold-600/20 rounded-3xl py-1 lg:mx-0" style={{ "--i": 4 }}>
                {[
                  ["Free", "to start"],
                  ["No app", "for guests"],
                  ["One link", "anywhere"],
                ].map(([a, b]) => (
                  <div key={a} className="px-2 py-3.5 text-center">
                    <dt className="font-serif text-xl text-ink sm:text-2xl">{a}</dt>
                    <dd className="mt-0.5 text-xs font-medium text-ink-500">{b}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Stage: a coral arch in turning gold rings, a printed card, notes of what guests do, and the live phone */}
            <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[440px]">
              <Rings className="left-1/2 top-0 hidden h-[560px] w-[560px] -translate-x-1/2 sm:block" />
              <div
                className="absolute left-1/2 top-8 h-[430px] w-[94%] -translate-x-1/2 rounded-t-full bg-gradient-to-b from-[#f38a74] via-[#e8544a] to-[#b8323a] shadow-[0_50px_90px_-40px_rgba(184,50,58,.6)] ring-1 ring-gold/50 ring-offset-8 ring-offset-[#faf9f7] sm:top-6 sm:h-[600px] dark:ring-offset-[#0f0e1d]"
                aria-hidden="true"
              >
                <div className="absolute inset-3 rounded-t-full border border-white/25" />
                <div className="absolute inset-0 rounded-t-full opacity-50" style={{ background: "radial-gradient(circle at 50% 18%, #ffd9b0 0, transparent 55%)" }} />
              </div>
              <div className="at-light absolute -left-10 top-48 hidden w-40 -rotate-[10deg] rounded-md bg-[#fffaf3] p-2 shadow-[0_24px_40px_-20px_rgba(28,26,61,.55)] sm:block" aria-hidden="true">
                <div className="flex aspect-[3/4] flex-col items-center justify-center rounded-sm border border-gold-600/50 text-center">
                  <span className="font-script text-2xl text-brand-600">Save the date</span>
                  <span className="mt-1 font-serif text-3xl text-ink">12 · 12</span>
                  <span className="mt-2 text-[8px] font-bold uppercase tracking-[0.3em] text-ink-500">Ayesha & Ahmed</span>
                </div>
              </div>
              <div className="at-glass-strong absolute -right-16 top-[62%] z-20 hidden items-center gap-2.5 rounded-2xl px-3.5 py-2.5 [animation:at-float_7s_ease-in-out_infinite] xl:flex" style={{ "--r": "3deg" }} aria-hidden="true">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <span className="text-left">
                  <span className="block text-xs font-bold text-ink">Sara is coming</span>
                  <span className="block text-[11px] text-ink-500">RSVP · 3 guests</span>
                </span>
              </div>
              <div className="at-glass-strong absolute -left-20 top-[80%] z-20 hidden items-center gap-2.5 rounded-2xl px-3.5 py-2.5 [animation:at-float_8s_ease-in-out_infinite_-3s] xl:flex" style={{ "--r": "-3deg" }} aria-hidden="true">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#ffc7bb] to-[#e8544a] text-white">
                  <Heart className="h-4 w-4" fill="currentColor" />
                </span>
                <span className="text-left">
                  <span className="block text-xs font-bold text-ink">12 new wishes</span>
                  <span className="block text-[11px] text-ink-500">&ldquo;Mubarak ho!&rdquo;</span>
                </span>
              </div>
              <SeeBadge />
              {/* phones: a smaller demo, with the badge above it instead of over its screen */}
              <div className="relative mx-auto max-w-[250px] pt-10 sm:max-w-none sm:pt-0">
                <LiveDemo />
              </div>
            </div>
          </div>
        </section>

        {/* ================= Ticker: a champagne ribbon ================= */}
        <div className="marquee relative overflow-hidden bg-gradient-to-r from-[#e9cd84] via-[#fff1c9] to-[#e2bf6b] py-4 text-[#1c1a3d] shadow-[0_20px_40px_-30px_rgba(168,122,42,.8)]" aria-label="What guests can do">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 || undefined}>
                {MOMENTS.map((m) => (
                  <li key={m} className="flex items-center whitespace-nowrap font-serif text-xl italic sm:text-2xl">
                    <span className="px-6 sm:px-8">{m}</span>
                    <span className="not-italic text-[#b8323a]">✦</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        {/* ================= I. Entrances ================= */}
        <div className="pt-16 sm:pt-24">
          <NightPanel id="entrances" className="pb-12 pt-16 sm:py-28">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] opacity-70" style={{ background: "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(245,196,81,.18), transparent 70%)" }} />
            <Rings className="-right-40 -top-40 h-[34rem] w-[34rem]" />
            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
              <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_.8fr]">
                <Chapter n="I" label="The first impression" title={<>Twelve ways to be <em className="!text-gold">opened.</em></>} light />
                <p className="max-w-md text-[1.05rem] leading-relaxed text-cream/65 lg:pb-3">
                  Every guest begins with something to open: a wax-sealed envelope, a gatefold card or a pair of real palace doors. Tap any of them to try it.
                </p>
              </div>
              <div className="mt-10 sm:mt-16">
                <EntranceGallery dark />
              </div>
            </div>
          </NightPanel>
        </div>

        {/* ================= II. Templates ================= */}
        <section id="templates" className="relative scroll-mt-20 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_.8fr]">
              <Chapter n="II" label="Design templates" title={<>Ten designs, ready to make <em>yours.</em></>} />
              <p className="max-w-md text-[1.05rem] leading-relaxed text-ink/65 lg:pb-3">
                Watercolour gardens, burgundy bands with torn-paper edges, emerald and gold for a nikah, balloons for a birthday. Pick one, then change anything.
              </p>
            </div>
            <div className="mt-12 sm:mt-14">
              <TemplateGallery />
            </div>
          </div>
        </section>

        {/* ================= III. The reveal ================= */}
        <section className="relative pb-24 sm:pb-32">
          <div className="pointer-events-none absolute left-0 top-1/4 h-[420px] w-[420px] rounded-full bg-[#f3d58c]/25 blur-[110px] dark:bg-[#d9b45e]/10" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
            <div className="relative order-2 lg:order-1">
              {/* a thin champagne-gold rim round the card, softer at night */}
              <div className="mx-auto max-w-[300px] -rotate-[1.5deg] rounded-[2.3rem] sm:max-w-md bg-gradient-to-br from-[#f3d58c] via-[#fff1c9] to-[#c9a24a] p-[5px] shadow-[0_40px_70px_-36px_rgba(70,45,20,.55)] dark:from-[#d9b45e]/80 dark:via-[#4a3f2a] dark:to-[#a87a2a]/80 dark:p-[3px] dark:shadow-[0_40px_80px_-30px_rgba(0,0,0,.9),0_0_60px_-20px_rgba(217,180,94,.35)]">
                <div className="at-light overflow-hidden rounded-[2rem]">
                  <ScratchDemo />
                </div>
              </div>
              <p className="absolute -top-10 right-6 rotate-[6deg] font-script text-2xl text-brand-600 sm:-top-9 sm:right-10 sm:text-3xl" aria-hidden="true">
                go on, scratch it
                <svg viewBox="0 0 60 40" className="ml-auto mr-10 mt-1 h-8 w-12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M50 4 C 40 22, 26 30, 8 34" />
                  <path d="M8 34 L 16 26 M8 34 L 18 37" />
                </svg>
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <Chapter n="III" label="Little moments of magic" title={<>Let them scratch the gold to find <em>the date.</em></>}>
                A tactile surprise on every phone. Then a live countdown, the music you chose, your story as a timeline and a guestbook full of love.
              </Chapter>
              <ul className="at-glass mt-10 divide-y divide-gold-600/15 rounded-3xl px-2">
                {[
                  [Ticket, "Scratch-to-reveal date", "Gold foil that clears under a fingertip"],
                  [Stamp, "Doors & envelopes that open", "With a seal in your colours and monogram"],
                  [Music, "Music on opening", "Starts as the envelope lifts"],
                  [Feather, "Your story as a timeline", "From the first meeting to the big day"],
                ].map(([Icon, t, d], i) => (
                  <li key={t} className="flex items-center gap-4 px-3 py-4">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br shadow-[0_10px_20px_-12px_rgba(70,45,20,.6)] ${ORBS[i % ORBS.length]}`}>
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink">{t}</span>
                      <span className="block text-sm text-ink-500">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ================= IV. Everything inside ================= */}
        <section id="features" className="relative scroll-mt-20 pb-24 sm:pb-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_.8fr]">
              <Chapter n="IV" label="Everything included" title={<>All that goes <em>inside</em> the envelope.</>} />
              <div className="lg:pb-3">
                <p className="max-w-md text-[1.05rem] leading-relaxed text-ink/65">
                  Twelve pieces of a complete invitation suite, ready the moment you create your page. Use the ones you need and hide the rest.
                </p>
                <Link href="/register" className="btn-primary mt-6 !px-6 !py-3.5">
                  Start with a template <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <ol className="mt-12 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {FEATURES.map(({ Icon, title, text }, i) => (
                // phones: icon beside the text; from 640px a card with the icon on top
                <li key={title} className="at-glass at-ring group relative flex items-start gap-4 rounded-3xl p-4 transition duration-300 hover:-translate-y-1 sm:block sm:p-6">
                  <div className="flex shrink-0 items-start justify-between gap-3">
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br shadow-[0_10px_20px_-12px_rgba(70,45,20,.6)] transition duration-500 group-hover:-rotate-6 group-hover:scale-110 ${ORBS[i % ORBS.length]}`}>
                      <Icon className="h-5 w-5" strokeWidth={1.7} />
                    </span>
                    <span className="hidden font-serif text-sm italic text-ink/35 sm:inline">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-[1.15rem] leading-tight text-ink sm:mt-5 sm:text-[1.3rem]">{title}</h3>
                    <p className="mt-1 text-[0.9rem] leading-relaxed text-ink-500 sm:mt-1.5 sm:text-[0.93rem]">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ================= V. How it works ================= */}
        <NightPanel id="how" className="py-20 sm:py-28">
          <div className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-brand-500/25 blur-[110px]" />
          <Rings className="-bottom-56 -left-40 h-[34rem] w-[34rem]" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <Chapter n="V" label="How it works" title={<>Ready in three <em className="!text-gold">graceful</em> steps.</>} light />
            <ol className="mt-14 grid gap-4 md:grid-cols-3 md:gap-5">
              {STEPS.map(({ title, text }, i) => (
                <li key={title} className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-7">
                  <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                  <span className="font-serif text-[5rem] leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgba(245,196,81,.75)]">{i + 1}</span>
                  <h3 className="mt-6 font-serif text-2xl">{title}</h3>
                  <p className="mt-3 leading-relaxed text-cream/60">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </NightPanel>

        {/* ================= VI. Occasions ================= */}
        <section id="events" className="relative scroll-mt-20 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Chapter n="VI" label="For every celebration" title={<>From Nikah to <em>first birthdays.</em></>}>
              Each occasion starts with its own theme, entrance and sample sections, so you begin from something beautiful rather than a blank page.
            </Chapter>
            <ul className="mt-12 flex flex-wrap gap-2.5 sm:gap-3">
              {EVENT_TYPES.map(({ id, label, Icon }, i) => (
                <li key={id}>
                  <Link href="/register" className="at-glass at-ring group inline-flex items-center gap-2.5 rounded-full py-2 pl-2 pr-5 font-serif text-lg text-ink transition duration-300 hover:-translate-y-0.5 sm:text-xl">
                    <span className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br transition duration-500 group-hover:rotate-12 ${ORBS[i % ORBS.length]}`}>
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section id="faq" className="relative scroll-mt-20 pb-24 sm:pb-32">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
            <div>
              <Chapter n="VII" label="Questions" title={<>Good to <em>know.</em></>}>
                The things people ask before they send their first invitation.
              </Chapter>
            </div>
            <div className="space-y-3">
              {FAQ.map((f) => (
                <details key={f.q} className="at-glass group rounded-3xl px-5 transition open:shadow-[0_0_0_1px_rgba(201,162,74,.35)] sm:px-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-lg text-ink sm:text-[1.3rem] [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold-600/30 text-gold-600 transition group-open:rotate-45 group-open:border-transparent group-open:bg-gradient-to-br group-open:from-[#f38a74] group-open:to-[#e8544a] group-open:text-white">
                      <Plus className="h-4 w-4" />
                    </span>
                  </summary>
                  <p className="-mt-1 max-w-xl pb-5 pr-12 leading-relaxed text-ink-500">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ================= Closing envelope ================= */}
        <section className="px-4 pb-16 sm:px-6 sm:pb-24">
          <div className="at-light grain grain-dark relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-ink text-center text-cream shadow-[0_50px_90px_-50px_rgba(28,26,61,.8)] ring-1 ring-gold/25">
            {/* envelope flap */}
            <div className="absolute inset-x-0 top-0 h-36 bg-ink-700 sm:h-44" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} aria-hidden="true" />
            <div className="absolute inset-x-0 top-0 h-36 sm:h-44" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", background: "linear-gradient(180deg, rgba(255,255,255,.06), transparent)" }} aria-hidden="true" />
            <WaxSeal color="#e8544a" icon="heart" className="absolute left-1/2 top-36 w-20 -translate-x-1/2 -translate-y-1/2 animate-[loader-breathe_3s_ease-in-out_infinite] sm:top-44 sm:w-24" />
            <div className="relative px-6 pb-16 pt-52 sm:px-12 sm:pb-20 sm:pt-64">
              <h2 className="display mx-auto max-w-3xl text-[2.4rem] leading-[1.02] !text-cream sm:text-6xl">
                Your celebration deserves a <em className="at-gold-text !text-transparent">grand entrance.</em>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-cream/65">Start free. Make it yours in minutes and share it with everyone you love.</p>
              <Link href="/login" className="btn-coral mt-9 !px-8 !py-4 !text-base">
                Create your invitation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
