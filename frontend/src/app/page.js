import Link from "next/link";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { EVENT_TYPES } from "@/data/eventTypes";

const FEATURES = [
  { icon: "🎨", title: "12+ gorgeous themes", text: "Hand-picked colours, fonts and backgrounds for weddings, nikah, mehndi, birthdays and more." },
  { icon: "🌸", title: "100+ stickers", text: "Flowers, rings, lanterns, balloons, frames… drag, resize and rotate them anywhere." },
  { icon: "📸", title: "Photos & gallery", text: "Add couple photos, a cover image and a full photo gallery with a lightbox." },
  { icon: "⏳", title: "Live countdown", text: "A ticking countdown to your big day keeps guests excited." },
  { icon: "📍", title: "Venue map & directions", text: "Embedded Google Map, one-tap directions and add-to-calendar for every event." },
  { icon: "✅", title: "RSVP & guest list", text: "Guests respond in seconds. See who's coming and export the list to Excel/CSV." },
  { icon: "💌", title: "Guestbook wishes", text: "Friends and family leave heartfelt wishes right on your invitation." },
  { icon: "🎵", title: "Background music", text: "Upload your favourite song — it starts playing when guests open the envelope." },
  { icon: "🔒", title: "Optional password", text: "Keep it private with a password, or share openly — your choice." },
  { icon: "🔗", title: "Your own link", text: "Pick a custom link like /i/ayesha-weds-ahmed and share it on WhatsApp, Instagram, anywhere." },
  { icon: "📱", title: "Perfect on every phone", text: "Every invitation is fully responsive and loads fast on mobile data." },
  { icon: "🔳", title: "QR code", text: "Download a QR code to print on physical cards that opens your invitation." },
];

const STEPS = [
  { n: "1", title: "Pick your event", text: "Choose wedding, birthday, nikah or any event and a theme you love." },
  { n: "2", title: "Personalise it", text: "Add names, photos, venues, timings, stickers and music — see every change live." },
  { n: "3", title: "Share the link", text: "Send your link on WhatsApp, Facebook or anywhere. Guests open it — no app, no login." },
];

const FAQ = [
  { q: "Do my guests need an account?", a: "No. Anyone with your link can open the invitation, RSVP and leave wishes. Only you can edit it." },
  { q: "Can I edit after sharing?", a: "Yes — edits appear instantly on the same link, so you never need to resend." },
  { q: "Will it look good on phones?", a: "Absolutely. Invitations are designed mobile-first and adapt to every screen size." },
  { q: "Can I keep my invitation private?", a: "Yes. Set a password in settings and only guests who know it can view the page." },
  { q: "Can I download my RSVP list?", a: "Yes, export all responses to a CSV file that opens in Excel or Google Sheets." },
];

function PhoneMock() {
  return (
    <div className="relative mx-auto w-[260px] sm:w-[290px]">
      <div className="absolute -inset-10 -z-10 rounded-full bg-gradient-to-tr from-brand-300/50 via-purple-300/40 to-amber-200/50 blur-3xl" />
      <div className="rounded-[2.6rem] border-[10px] border-zinc-900 bg-zinc-900 shadow-2xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#fff7fb]">
          <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-zinc-900" />
          <div className="px-5 pb-8 pt-14 text-center">
            <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Together with their families</p>
            <div className="mx-auto mt-4 h-24 w-24 rounded-full bg-gradient-to-br from-brand-500 to-amber-300 p-1">
              <div className="grid h-full w-full place-items-center rounded-full bg-white text-4xl">💍</div>
            </div>
            <p className="mt-4 font-script text-4xl text-brand-700">Ayesha & Ahmed</p>
            <p className="mt-1 text-xs text-zinc-600">are getting married</p>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-700">— 21 November 2026 —</p>
            <div className="mt-5 grid grid-cols-4 gap-1.5">
              {[["28", "Days"], ["06", "Hrs"], ["42", "Min"], ["17", "Sec"]].map(([v, l]) => (
                <div key={l} className="rounded-lg bg-brand-700 py-1.5 text-white">
                  <p className="text-sm font-bold">{v}</p>
                  <p className="text-[8px] uppercase">{l}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-brand-100 bg-white p-3 text-left text-[11px] shadow-sm">
              <p className="font-script text-xl text-brand-700">Barat</p>
              <p className="text-zinc-600">📅 Sat, 21 Nov · 7:30 PM</p>
              <p className="text-zinc-600">📍 Royal Palm Marquee</p>
            </div>
            <div className="mt-4 rounded-full bg-brand-700 py-2 text-xs font-semibold text-white">Send RSVP</div>
          </div>
          <span className="absolute left-3 top-24 text-3xl">🌸</span>
          <span className="absolute right-3 top-40 text-2xl">🌺</span>
          <span className="absolute bottom-24 left-4 text-2xl">🕊️</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-12 sm:px-6 md:pt-20 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <span className="chip bg-brand-100 text-brand-700">✨ Free to create · No app for guests</span>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                Invitations your guests will <span className="font-script text-5xl font-normal text-brand-600 sm:text-6xl lg:text-7xl">love</span> to open
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base text-zinc-600 sm:text-lg lg:mx-0">
                Create a beautiful invitation page with photos, stickers, music, countdown and RSVP — then share one link on WhatsApp, Instagram or anywhere.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Link href="/register" className="btn-primary !px-7 !py-3.5 !text-base">
                  Create my invitation
                </Link>
                <a href="#how" className="btn-secondary !px-7 !py-3.5 !text-base">
                  See how it works
                </a>
              </div>
              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-zinc-500 lg:justify-start">
                <span>💍 Weddings</span>
                <span>🎂 Birthdays</span>
                <span>🕌 Nikah</span>
              </div>
            </div>
            <PhoneMock />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Everything you need</p>
              <h2 className="mt-2 text-3xl font-bold text-zinc-900 sm:text-4xl">All the things an invitation needs</h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="card p-6 transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-2xl">{f.icon}</div>
                  <h3 className="mt-4 font-semibold text-zinc-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-zinc-600">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How */}
        <section id="how" className="scroll-mt-20 bg-zinc-950 py-20 text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Ready in 3 simple steps</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="rounded-3xl border border-white/10 bg-white/5 p-7">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-brand-600 text-lg font-bold">{s.n}</div>
                  <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Events */}
        <section id="events" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center text-3xl font-bold text-zinc-900 sm:text-4xl">For every celebration</h2>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {EVENT_TYPES.map((e) => (
                <Link key={e.id} href="/register" className="card flex flex-col items-center gap-2 p-5 text-center transition hover:border-brand-200 hover:shadow-md">
                  <span className="text-3xl">{e.emoji}</span>
                  <span className="text-sm font-semibold text-zinc-800">{e.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 bg-brand-50/60 py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-center text-3xl font-bold text-zinc-900 sm:text-4xl">Questions? Answers.</h2>
            <div className="mt-10 space-y-3">
              {FAQ.map((f) => (
                <details key={f.q} className="card group p-5 open:shadow-md">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-zinc-900">
                    {f.q}
                    <span className="text-brand-600 transition group-open:rotate-45">＋</span>
                  </summary>
                  <p className="mt-3 text-sm text-zinc-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-pink-600 to-purple-700 px-6 py-14 text-center text-white shadow-2xl sm:px-12">
            <h2 className="text-3xl font-bold sm:text-4xl">Your celebration deserves a beautiful invite</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">Start for free. Make it yours in minutes and share it with everyone you love.</p>
            <Link href="/register" className="btn mt-8 bg-white !px-8 !py-3.5 !text-base text-brand-700 hover:bg-brand-50">
              Create my invitation →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
