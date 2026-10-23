import Link from "next/link";
import {
  ArrowRight, CalendarHeart, Feather, Gift, Image as ImageIcon, KeyRound, Link2, ListChecks, Lock, MailOpen, MapPin, Music, Palette,
  QrCode, Smartphone, Sparkles, Stamp, Ticket, Wand2, Share2, ChevronDown,
} from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import LiveDemo from "@/components/site/LiveDemo";
import { EntranceGallery, ScratchDemo } from "@/components/site/Showcases";
import { EVENT_TYPES } from "@/data/eventTypes";

const FEATURES = [
  { Icon: Stamp, title: "Wax-sealed entrances", text: "Six envelopes and two garden doors. Guests tap the seal, it cracks open and your invitation unfolds." },
  { Icon: Ticket, title: "Scratch to reveal", text: "A gold-foil card hides your date until guests scratch it with their finger." },
  { Icon: Palette, title: "Couture themes", text: "Twelve palettes with hand-paired fonts, damask, botanical and foil details." },
  { Icon: Feather, title: "Your love story", text: "A timeline of moments, the couple, the families, a verse — every detail of the day." },
  { Icon: ImageIcon, title: "Photos & gallery", text: "Arched portraits, a full gallery with lightbox and decorative vector stickers." },
  { Icon: MapPin, title: "Venues & directions", text: "Every event with its own map, one-tap directions and add-to-calendar." },
  { Icon: ListChecks, title: "RSVP & guest list", text: "Guests reply in seconds. Track headcount and export the list to Excel." },
  { Icon: MailOpen, title: "Guestbook wishes", text: "Friends and family leave heartfelt messages right on your page." },
  { Icon: Music, title: "Background music", text: "Your song starts the moment the envelope opens." },
  { Icon: Gift, title: "Gifts, done gracefully", text: "Share bank or wallet details with one-tap copy, only if you wish." },
  { Icon: Lock, title: "Private if you like", text: "Protect the page with a password, or share it openly." },
  { Icon: QrCode, title: "QR for printed cards", text: "Download a QR code that opens your invitation from any card." },
];

const STEPS = [
  { Icon: Wand2, title: "Choose your entrance", text: "Pick an event, a theme and the envelope or doors your guests will open." },
  { Icon: Palette, title: "Make it yours", text: "Add names, photos, events, music and stickers. Every change previews live." },
  { Icon: Share2, title: "Share one link", text: "Send it on WhatsApp, Instagram or anywhere. No app, no login for guests." },
];

const FAQ = [
  { q: "Do my guests need an account or an app?", a: "No. Anyone with your link opens the invitation in their browser, RSVPs and leaves wishes. Only you can edit it." },
  { q: "Can I change details after sharing?", a: "Yes. Edits appear instantly on the same link, so there's nothing to resend." },
  { q: "Will it look good on every phone?", a: "Every invitation is designed mobile-first and adapts to any screen, from small phones to desktops." },
  { q: "Can I keep my invitation private?", a: "Yes. Add a password in settings and only guests who know it can view the page." },
  { q: "Can I download my RSVP list?", a: "Yes. Export every response to a CSV file that opens in Excel or Google Sheets." },
];

function Eyebrow({ children, light }) {
  return (
    <p className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] ${light ? "text-gold" : "text-brand-600"}`}>
      <span className="h-px w-6 bg-current" />
      {children}
    </p>
  );
}

function GoldRule({ className = "" }) {
  return (
    <svg viewBox="0 0 200 24" className={className} fill="none" stroke="#c9a24a" strokeWidth="1.3" aria-hidden="true">
      <path d="M100 12 C92 2 80 2 76 9 C73 15 80 19 84 14 M100 12 C108 2 120 2 124 9 C127 15 120 19 116 14 M76 12 L8 12 M124 12 L192 12" />
      <path d="M100 6 L104 12 L100 18 L96 12Z" fill="#c9a24a" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" className="overflow-x-clip">
        {/* ---------------- Hero ---------------- */}
        <section className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-200/40 blur-3xl" />
            <div className="absolute -right-32 top-20 h-[460px] w-[460px] rounded-full bg-gold/25 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.35]" style={{ background: "radial-gradient(#1c1a3d14 1px, transparent 1.2px) 0 0/22px 22px" }} />
          </div>
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 md:pt-16 lg:grid-cols-[1.05fr_.95fr] lg:pb-24">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-1.5 text-xs font-semibold text-ink shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-gold-600" /> Digital invitations, beautifully opened
              </span>
              <h1 className="mt-6 text-[2.7rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[4.4rem]">
                Invitations they&apos;ll
                <span className="relative mx-2 inline-block font-script text-[1.25em] font-normal tracking-normal text-brand-600">love</span>
                to open.
              </h1>
              <p className="mx-auto mt-6 max-w-xl font-display text-xl leading-relaxed text-ink/75 sm:text-2xl lg:mx-0">
                A wax-sealed envelope that cracks open, garden doors that swing wide, a gold-foil date to scratch — then your whole celebration, on one beautiful link.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Link href="/register" className="btn-primary !px-7 !py-3.5 !text-base">
                  Create your invitation <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#entrances" className="btn-secondary !px-7 !py-3.5 !text-base">
                  See the entrances
                </a>
              </div>
              <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-500 lg:justify-start">
                <li className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-brand-600" /> No app for guests</li>
                <li className="flex items-center gap-2"><CalendarHeart className="h-4 w-4 text-brand-600" /> Free to start</li>
                <li className="flex items-center gap-2"><Link2 className="h-4 w-4 text-brand-600" /> One link, anywhere</li>
              </ul>
            </div>

            <div className="relative flex justify-center">
              <svg viewBox="0 0 100 100" className="absolute -left-2 top-10 hidden h-16 w-16 animate-[sway_6s_ease-in-out_infinite] lg:block" aria-hidden="true">
                <path d="M50 4 Q54 44 96 50 Q54 56 50 96 Q46 56 4 50 Q46 44 50 4Z" fill="#f5c451" />
              </svg>
              <svg viewBox="0 0 100 100" className="absolute -right-2 bottom-24 hidden h-10 w-10 animate-[sway_5s_ease-in-out_infinite] lg:block" aria-hidden="true">
                <path d="M50 4 Q54 44 96 50 Q54 56 50 96 Q46 56 4 50 Q46 44 50 4Z" fill="#e8544a" />
              </svg>
              <div>
                <LiveDemo />
                <p className="mt-3 text-center text-xs font-medium text-ink-500">Tap the seal to open · pick a colour to try another entrance</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Entrances ---------------- */}
        <section id="entrances" className="scroll-mt-20 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>The first impression</Eyebrow>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                Eight entrances, <span className="font-display font-semibold italic text-brand-600">one unforgettable moment</span>
              </h2>
              <p className="mt-4 font-display text-xl text-ink/70">Every guest begins with something to open. Tap any of them.</p>
            </div>
            <div className="mt-14">
              <EntranceGallery />
            </div>
          </div>
        </section>

        {/* ---------------- Magic moments ---------------- */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <Eyebrow>Little moments of magic</Eyebrow>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">Let them scratch the gold to find the date.</h2>
              <p className="mt-5 font-display text-xl leading-relaxed text-ink/70">
                A tactile surprise on every phone. Then a live countdown, the music you chose, your story told as a timeline, and a guestbook full of love.
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  [Ticket, "Scratch-to-reveal date"],
                  [KeyRound, "Doors & envelopes that open"],
                  [Music, "Music on opening"],
                  [Feather, "Love story timeline"],
                ].map(([Icon, t]) => (
                  <li key={t} className="flex items-center gap-3 font-semibold text-ink">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gold/20 text-gold-600">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2.4rem] bg-white p-3 shadow-[0_30px_70px_-35px_rgba(28,26,61,.45)]">
              <ScratchDemo />
            </div>
          </div>
        </section>

        {/* ---------------- Features ---------------- */}
        <section id="features" className="scroll-mt-20 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>Everything included</Eyebrow>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">All an invitation should be</h2>
            </div>
            <div className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {FEATURES.map(({ Icon, title, text }) => (
                <div key={title} className="group flex gap-4 rounded-3xl border border-ink/[0.06] bg-cream/60 p-4 transition hover:bg-white hover:shadow-[0_24px_50px_-30px_rgba(28,26,61,.4)] sm:block sm:p-6 sm:hover:-translate-y-1">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ink text-gold transition group-hover:bg-brand-500 group-hover:text-white sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-ink sm:mt-5 sm:text-lg">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-500 sm:mt-1.5 sm:text-[0.95rem]">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- How it works ---------------- */}
        <section id="how" className="relative scroll-mt-20 overflow-hidden bg-ink py-20 text-cream sm:py-24">
          <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: "radial-gradient(#f5c45133 1px, transparent 1.2px) 0 0/26px 26px" }} />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <Eyebrow light>How it works</Eyebrow>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Ready in three graceful steps</h2>
              <GoldRule className="mx-auto mt-5 w-48" />
            </div>
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {STEPS.map(({ Icon, title, text }, i) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold text-ink">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <span className="font-display text-5xl font-semibold italic text-white/15">0{i + 1}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold">{title}</h3>
                  <p className="mt-2 text-cream/65">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Events ---------------- */}
        <section id="events" className="scroll-mt-20 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <Eyebrow>For every celebration</Eyebrow>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">From Nikah to first birthdays</h2>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {EVENT_TYPES.map(({ id, label, Icon }) => (
                <Link key={id} href="/register" className="group flex flex-col items-center gap-3 rounded-3xl border border-ink/[0.06] bg-white p-5 text-center transition hover:-translate-y-1 hover:shadow-lg">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <span className="text-sm font-semibold text-ink">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section id="faq" className="scroll-mt-20 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="text-center">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">Good to know</h2>
            </div>
            <div className="mt-10 space-y-3">
              {FAQ.map((f) => (
                <details key={f.q} className="group rounded-3xl border border-ink/[0.07] bg-cream/50 px-6 py-5 open:bg-white open:shadow-[0_20px_40px_-30px_rgba(28,26,61,.4)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-ink">
                    {f.q}
                    <ChevronDown className="h-5 w-5 shrink-0 text-brand-600 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 leading-relaxed text-ink-500">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- CTA ---------------- */}
        <section className="px-4 py-20 sm:px-6">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 text-center text-cream shadow-2xl sm:px-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
            <div className="relative">
              <GoldRule className="mx-auto w-44" />
              <h2 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Your celebration deserves a <span className="foil-text font-script text-[1.3em] font-normal tracking-normal">grand entrance</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-display text-xl text-cream/75">Start free. Make it yours in minutes and share it with everyone you love.</p>
              <Link href="/register" className="btn-coral mt-9 !px-8 !py-3.5 !text-base">
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
