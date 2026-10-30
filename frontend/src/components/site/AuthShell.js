import Link from "next/link";
import { ArrowLeft, Check, Eye, Heart } from "lucide-react";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import WaxSeal from "@/components/invite/entry/WaxSeal";

// Login / register / password pages: the form in a frosted glass card on soft white, and
// (from 1024px) an evening showcase: the envelope floating in an arch inside turning gold rings, with
// little notes of what happens after sharing (an RSVP, wishes, views) drifting around it.
export default function AuthShell({ title, subtitle, children, footer }) {
  // the title's last word in coral italic: "Welcome *back*"
  const words = String(title).split(" ");
  const lastWord = words.pop();

  return (
    <div className="atelier relative min-h-screen overflow-hidden">
      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
        <div className="flex flex-col px-4 py-4 sm:px-10 sm:py-7">
          <div className="flex items-center justify-between">
            <Logo size={32} />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/" className="at-glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-ink-500 transition hover:text-ink">
                <ArrowLeft className="h-4 w-4" /> <span className="hidden min-[380px]:inline">Home</span>
              </Link>
            </div>
          </div>
          <main id="main" className="flex flex-1 items-center justify-center py-8 sm:py-12">
            <div className="at-glass-strong at-ring at-rise w-full max-w-[440px] rounded-[2rem] px-5 py-7 sm:px-9 sm:py-10">
              <h1 className="display text-[2.4rem] leading-[1.04] sm:text-[2.9rem]">
                {words.join(" ")} <em>{lastWord}</em>
              </h1>
              {subtitle && <p className="mt-3 leading-relaxed text-ink/65">{subtitle}</p>}
              <div className="mt-8">{children}</div>
              {footer && <div className="mt-8 border-t border-gold-600/20 pt-6 text-center text-sm text-ink-500">{footer}</div>}
            </div>
          </main>
        </div>

        <aside className="relative m-4 hidden overflow-hidden rounded-[2.5rem] bg-night ring-white/[0.06] dark:ring-1 lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-12" aria-hidden>
          {/* glows and slowly turning gold rings */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_38%,rgba(245,196,81,.2),transparent_70%),radial-gradient(ellipse_50%_40%_at_15%_90%,rgba(232,84,74,.22),transparent_70%),radial-gradient(ellipse_45%_35%_at_90%_10%,rgba(165,139,214,.25),transparent_70%)]" />
          <div className="absolute left-1/2 top-[40%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 animate-[spin_60s_linear_infinite] rounded-full border border-dashed border-gold/20 motion-reduce:animate-none" />
          <div className="absolute left-1/2 top-[40%] h-[27rem] w-[27rem] -translate-x-1/2 -translate-y-1/2 animate-[spin_40s_linear_infinite_reverse] rounded-full border border-gold/15 motion-reduce:animate-none" />
          {[
            ["18%", "16%", "0s"],
            ["82%", "24%", "-1.4s"],
            ["74%", "70%", "-2.6s"],
            ["22%", "64%", "-3.2s"],
            ["50%", "8%", "-0.6s"],
          ].map(([left, top, delay]) => (
            <span key={left} className="absolute h-2.5 w-2.5 animate-[twinkle_3.6s_ease-in-out_infinite] bg-gold [clip-path:polygon(50%_0,62%_38%,100%_50%,62%_62%,50%_100%,38%_62%,0_50%,38%_38%)]" style={{ left, top, animationDelay: delay }} />
          ))}

          {/* the envelope in an arch, floating */}
          <div className="at-float relative">
            <div className="relative aspect-[3/4] w-[min(330px,30vw)] overflow-hidden rounded-t-full bg-[#6b1e2a] shadow-[0_50px_90px_-40px_rgba(0,0,0,.8)] ring-1 ring-gold/40 ring-offset-8 ring-offset-night">
              <div className="absolute inset-0" style={{ background: "#5d1824", clipPath: "polygon(0 22%, 0 100%, 51% 66%)" }} />
              <div className="absolute inset-0" style={{ background: "#5d1824", clipPath: "polygon(100% 22%, 100% 100%, 49% 66%)" }} />
              <div className="absolute inset-0" style={{ background: "#661c28", clipPath: "polygon(0 100%, 100% 100%, 52% 62%, 48% 62%)" }} />
              <div className="absolute inset-0 drop-shadow-[0_8px_14px_rgba(0,0,0,.35)]">
                <div className="absolute inset-0" style={{ background: "#74222f", clipPath: "polygon(0 22%, 100% 22%, 54% 64%, 50% 67%, 46% 64%)" }} />
              </div>
              <WaxSeal color="#c9a24a" icon="dove" className="absolute left-1/2 top-[66%] w-24 -translate-x-1/2 -translate-y-1/2 animate-[loader-breathe_3s_ease-in-out_infinite]" />
            </div>

            {/* what happens after you share: notes drifting around the arch */}
            <div className="at-glass-strong absolute -left-24 top-[18%] flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-xl [animation:at-float_7s_ease-in-out_infinite]" style={{ "--r": "-3deg" }}>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              <span className="text-left">
                <span className="block text-xs font-bold text-ink">Sara is coming</span>
                <span className="block text-[11px] text-ink-500">RSVP · 3 guests</span>
              </span>
            </div>
            <div className="at-glass-strong absolute -right-20 top-[46%] flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-xl [animation:at-float_8s_ease-in-out_infinite_-2s]" style={{ "--r": "3deg" }}>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#ffc7bb] to-[#e8544a] text-white">
                <Heart className="h-4 w-4" fill="currentColor" />
              </span>
              <span className="text-left">
                <span className="block text-xs font-bold text-ink">12 new wishes</span>
                <span className="block text-[11px] text-ink-500">&ldquo;Mubarak ho!&rdquo;</span>
              </span>
            </div>
            <div className="at-glass-strong absolute -left-14 bottom-[6%] flex items-center gap-2 rounded-full px-3.5 py-2 shadow-xl [animation:at-float_6.5s_ease-in-out_infinite_-4s]">
              <Eye className="h-4 w-4 text-gold-600" />
              <span className="text-xs font-bold text-ink">Opened 148 times</span>
            </div>
          </div>

          <div className="relative mt-14 max-w-sm text-center">
            <p className="font-serif text-3xl leading-tight text-[#fff8f1]">
              Every celebration begins with <em className="at-gold-text">an invitation.</em>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#fff8f1]/55">Create one your guests will remember from the very first tap.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
