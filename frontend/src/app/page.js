import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Feather, Gift, Image as ImageIcon, ListChecks, Lock, MailOpen, MapPin, Music, Palette,
  Plus, QrCode, Stamp, Ticket,
} from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import LiveDemo from "@/components/site/LiveDemo";
import { EntranceGallery, ScratchDemo } from "@/components/site/Showcases";
import TemplateGallery from "@/components/site/TemplateGallery";
import WaxSeal from "@/components/invite/entry/WaxSeal";
import { EVENT_TYPES } from "@/data/eventTypes";

const FEATURES = [
  { Icon: Stamp, title: "Wax-sealed entrances", text: "Six envelopes and two garden doors. Guests tap the seal and your invitation unfolds." },
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

// Section opener used throughout the page: roman numeral, label, headline.
function Chapter({ n, label, title, children, light = false, className = "" }) {
  return (
    <div className={className}>
      <p className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] ${light ? "text-gold" : "text-brand-600"}`}>
        <span className="font-serif text-base font-normal normal-case italic tracking-normal">{n}.</span>
        <span className={`h-px w-8 ${light ? "bg-gold/50" : "bg-brand-600/40"}`} />
        {label}
      </p>
      <h2 className={`display mt-5 text-[2.5rem] leading-[1.02] sm:text-[3.4rem] lg:text-[4rem] ${light ? "!text-cream" : ""}`}>{title}</h2>
      {children && <p className={`mt-5 max-w-xl text-[1.05rem] leading-relaxed ${light ? "text-cream/65" : "text-ink/65"}`}>{children}</p>}
    </div>
  );
}

function SeeBadge() {
  return (
    <div className="absolute -right-1 top-6 z-10 grid h-[5.5rem] w-[5.5rem] place-items-center rounded-full bg-gold shadow-[0_14px_30px_-14px_rgba(28,26,61,.6)] sm:-right-6 sm:h-28 sm:w-28" aria-hidden="true">
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
    <>
      <Navbar />
      <main id="main" className="overflow-x-clip">
        {/* ================= Hero ================= */}
        <section className="grain relative bg-cream">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-10 sm:px-6 md:pt-14 lg:grid-cols-[1.1fr_.9fr] lg:gap-8 lg:pb-28">
            <div className="text-center lg:text-left">
              <p className="eyebrow justify-center lg:justify-start">
                <span className="hidden h-px w-8 bg-brand-600/40 lg:block" /> Online invitations for every celebration
              </p>
              <h1 className="display mt-6 text-[clamp(3.1rem,11.5vw,6.6rem)] leading-[0.94]">
                Invitations
                <br />
                worth{" "}
                <span className="relative inline-block italic text-brand-600">
                  opening.
                  <svg viewBox="0 0 220 18" className="absolute -bottom-1 left-0 w-full sm:-bottom-2" fill="none" aria-hidden="true">
                    <path d="M3 13 C 55 4, 130 2, 217 9" stroke="#f5c451" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="mx-auto mt-8 max-w-[34rem] text-[1.08rem] leading-relaxed text-ink/70 sm:text-lg lg:mx-0">
                Guests tap a wax seal, the envelope opens, and your whole celebration unfolds: events, photos, RSVPs and wishes, on one link you share anywhere.
              </p>
              <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="/register" className="btn-primary w-full !px-7 !py-4 !text-base sm:w-auto">
                  Create your invitation <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#entrances" className="link-quiet inline-flex items-center gap-1.5 px-2 py-2 text-[0.95rem] font-semibold text-ink">
                  See all eight entrances <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
              <dl className="mx-auto mt-12 grid max-w-md grid-cols-3 divide-x divide-ink/10 border-y border-ink/10 lg:mx-0">
                {[
                  ["Free", "to start"],
                  ["No app", "for guests"],
                  ["One link", "anywhere"],
                ].map(([a, b]) => (
                  <div key={a} className="px-2 py-4 text-center lg:text-left lg:first:pl-0 lg:[&:not(:first-child)]:pl-5">
                    <dt className="font-serif text-xl text-ink sm:text-2xl">{a}</dt>
                    <dd className="mt-0.5 text-xs font-medium text-ink-500">{b}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Stage: arch backdrop, a printed card peeking out and the live phone */}
            <div className="relative mx-auto w-full max-w-[440px]">
              <div className="absolute left-1/2 top-8 h-[520px] w-[94%] -translate-x-1/2 rounded-t-full bg-brand-500 sm:top-6 sm:h-[600px]" aria-hidden="true">
                <div className="absolute inset-3 rounded-t-full border border-white/25" />
                <div className="absolute inset-0 rounded-t-full opacity-40" style={{ background: "radial-gradient(circle at 50% 18%, #ffd9b0 0, transparent 55%)" }} />
              </div>
              <div className="absolute -left-10 top-48 hidden w-40 -rotate-[10deg] rounded-md bg-[#fffaf3] p-2 shadow-[0_24px_40px_-20px_rgba(28,26,61,.55)] sm:block" aria-hidden="true">
                <div className="flex aspect-[3/4] flex-col items-center justify-center rounded-sm border border-gold-600/50 text-center">
                  <span className="font-script text-2xl text-brand-600">Save the date</span>
                  <span className="mt-1 font-serif text-3xl text-ink">12 · 12</span>
                  <span className="mt-2 text-[8px] font-bold uppercase tracking-[0.3em] text-ink-500">Ayesha & Ahmed</span>
                </div>
              </div>
              <SeeBadge />
              <div className="relative">
                <LiveDemo className="h-[560px] w-[272px] min-[380px]:h-[600px] min-[380px]:w-[292px] sm:h-[660px] sm:w-[320px]" />
              </div>
            </div>
          </div>
        </section>

        {/* ================= Ticker ================= */}
        <div className="marquee overflow-hidden border-y border-ink bg-ink py-4 text-cream" aria-label="What guests can do">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 || undefined}>
                {MOMENTS.map((m) => (
                  <li key={m} className="flex items-center whitespace-nowrap font-serif text-xl italic sm:text-2xl">
                    <span className="px-6 sm:px-8">{m}</span>
                    <span className="text-gold not-italic">✦</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        {/* ================= I. Entrances ================= */}
        <section id="entrances" className="grain grain-dark relative scroll-mt-16 bg-night py-24 text-cream sm:py-32">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] opacity-60" style={{ background: "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(245,196,81,.16), transparent 70%)" }} />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_.8fr]">
              <Chapter n="I" label="The first impression" title={<>Eight ways to be <em className="text-gold">opened.</em></>} light />
              <p className="max-w-md text-[1.05rem] leading-relaxed text-cream/65 lg:pb-3">
                Every guest begins with something to open: a wax-sealed envelope, a gatefold card or a pair of garden doors. Tap any of them to try it.
              </p>
            </div>
            <div className="mt-14 sm:mt-16">
              <EntranceGallery dark />
            </div>
          </div>
        </section>

        {/* ================= II. Templates ================= */}
        <section id="templates" className="grain relative scroll-mt-16 bg-paper py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_.8fr]">
              <Chapter n="II" label="Design templates" title={<>Ten designs, ready to make <em className="text-brand-600">yours.</em></>} />
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
        <section className="grain relative bg-cream py-24 sm:py-32">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
            <div className="relative order-2 lg:order-1">
              <div className="mx-auto max-w-md -rotate-[1.5deg] rounded-[1.6rem] bg-white p-3 shadow-[0_40px_70px_-40px_rgba(28,26,61,.55)]">
                <ScratchDemo />
              </div>
              <p className="absolute -top-9 right-2 rotate-[6deg] font-script text-3xl text-brand-600 sm:right-10" aria-hidden="true">
                go on, scratch it
                <svg viewBox="0 0 60 40" className="ml-auto mr-10 mt-1 h-8 w-12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M50 4 C 40 22, 26 30, 8 34" />
                  <path d="M8 34 L 16 26 M8 34 L 18 37" />
                </svg>
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <Chapter n="III" label="Little moments of magic" title={<>Let them scratch the gold to find <em className="text-brand-600">the date.</em></>}>
                A tactile surprise on every phone. Then a live countdown, the music you chose, your story as a timeline and a guestbook full of love.
              </Chapter>
              <ul className="mt-10 border-t border-ink/10">
                {[
                  [Ticket, "Scratch-to-reveal date", "Gold foil that clears under a fingertip"],
                  [Stamp, "Doors & envelopes that open", "With a seal in your colours and monogram"],
                  [Music, "Music on opening", "Starts as the envelope lifts"],
                  [Feather, "Your story as a timeline", "From the first meeting to the big day"],
                ].map(([Icon, t, d]) => (
                  <li key={t} className="flex items-center gap-4 border-b border-ink/10 py-4">
                    <Icon className="h-5 w-5 shrink-0 text-brand-600" strokeWidth={1.6} />
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
        <section id="features" className="grain relative scroll-mt-16 bg-paper py-24 sm:py-32">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Chapter n="IV" label="Everything included" title={<>All that goes <em className="text-brand-600">inside</em> the envelope.</>}>
                Twelve pieces of a complete invitation suite, ready the moment you create your page. Use the ones you need and hide the rest.
              </Chapter>
              <Link href="/register" className="btn-primary mt-9 !px-6 !py-3.5">
                Start with a template <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ol className="grid border-t border-ink/10 sm:grid-cols-2 sm:gap-x-10">
              {FEATURES.map(({ Icon, title, text }, i) => (
                <li key={title} className="group flex gap-4 border-b border-ink/10 py-5 sm:py-6">
                  <span className="w-7 shrink-0 pt-0.5 font-serif text-sm italic text-ink/35">{String(i + 1).padStart(2, "0")}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="flex items-center justify-between gap-3 font-serif text-[1.3rem] leading-tight text-ink">
                      {title}
                      <Icon className="h-5 w-5 shrink-0 text-ink/30 transition group-hover:text-brand-600" strokeWidth={1.6} />
                    </h3>
                    <p className="mt-1.5 text-[0.93rem] leading-relaxed text-ink-500">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ================= V. How it works ================= */}
        <section id="how" className="grain grain-dark relative scroll-mt-16 overflow-hidden bg-night py-24 text-cream sm:py-32">
          <div className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-brand-500/20 blur-[110px]" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <Chapter n="V" label="How it works" title={<>Ready in three <em className="text-gold">graceful</em> steps.</>} light />
            <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
              {STEPS.map(({ title, text }, i) => (
                <li key={title} className="relative border-t border-white/15 pt-8">
                  <span className="absolute -top-px left-0 h-px w-16 bg-gold" />
                  <span className="font-serif text-[5.5rem] leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgba(245,196,81,.75)]">{i + 1}</span>
                  <h3 className="mt-6 font-serif text-2xl">{title}</h3>
                  <p className="mt-3 max-w-xs leading-relaxed text-cream/60">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ================= VI. Occasions ================= */}
        <section id="events" className="grain relative scroll-mt-16 bg-cream py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Chapter n="VI" label="For every celebration" title={<>From Nikah to <em className="text-brand-600">first birthdays.</em></>}>
              Each occasion starts with its own theme, entrance and sample sections, so you begin from something beautiful rather than a blank page.
            </Chapter>
            <ul className="mt-12 flex flex-wrap gap-2.5 sm:gap-3">
              {EVENT_TYPES.map(({ id, label, Icon }) => (
                <li key={id}>
                  <Link
                    href="/register"
                    className="group inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-white/70 py-2.5 pl-3 pr-5 font-serif text-lg text-ink transition hover:border-ink hover:bg-ink hover:text-cream sm:py-3 sm:text-xl"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-brand-600 transition group-hover:bg-gold group-hover:text-ink">
                      <Icon className="h-4 w-4" strokeWidth={1.7} />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section id="faq" className="grain relative scroll-mt-16 bg-paper py-24 sm:py-32">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
            <div>
              <Chapter n="VII" label="Questions" title={<>Good to <em className="text-brand-600">know.</em></>}>
                The things people ask before they send their first invitation.
              </Chapter>
            </div>
            <div className="border-t border-ink/15">
              {FAQ.map((f) => (
                <details key={f.q} className="group border-b border-ink/15">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-serif text-xl text-ink sm:text-[1.4rem] [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/15 transition group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-cream">
                      <Plus className="h-4 w-4" />
                    </span>
                  </summary>
                  <p className="-mt-1 max-w-xl pb-6 pr-12 leading-relaxed text-ink-500">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ================= Closing envelope ================= */}
        <section className="bg-paper px-4 pb-24 sm:px-6 sm:pb-32">
          <div className="grain grain-dark relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-ink text-center text-cream shadow-[0_50px_90px_-50px_rgba(28,26,61,.8)]">
            {/* envelope flap */}
            <div className="absolute inset-x-0 top-0 h-36 bg-ink-700 sm:h-44" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} aria-hidden="true" />
            <div className="absolute inset-x-0 top-0 h-36 sm:h-44" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", background: "linear-gradient(180deg, rgba(255,255,255,.06), transparent)" }} aria-hidden="true" />
            <WaxSeal color="#e8544a" icon="heart" className="absolute left-1/2 top-36 w-20 -translate-x-1/2 -translate-y-1/2 sm:top-44 sm:w-24" />
            <div className="relative px-6 pb-16 pt-52 sm:px-12 sm:pb-20 sm:pt-64">
              <h2 className="display mx-auto max-w-3xl text-[2.4rem] leading-[1.02] !text-cream sm:text-6xl">
                Your celebration deserves a <em className="foil-text">grand entrance.</em>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-cream/65">Start free. Make it yours in minutes and share it with everyone you love.</p>
              <Link href="/register" className="btn-coral mt-9 !px-8 !py-4 !text-base">
                Create your invitation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
