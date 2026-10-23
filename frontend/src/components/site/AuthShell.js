import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/ui/Logo";
import WaxSeal from "@/components/invite/entry/WaxSeal";

// Split layout for login / register / password pages: the form on paper,
// and (from 1024px) an evening panel with the envelope framed in an arch.
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen bg-cream lg:grid-cols-[1fr_1fr]">
      <div className="grain relative flex flex-col px-5 py-6 sm:px-10 sm:py-8">
        <div className="flex items-center justify-between">
          <Logo size={32} />
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-500 transition hover:bg-ink/5 hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> <span className="hidden min-[380px]:inline">Home</span>
          </Link>
        </div>
        <main id="main" className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[400px]">
            <h1 className="display text-[2.6rem] leading-[1.02] sm:text-5xl">{title}</h1>
            {subtitle && <p className="mt-4 leading-relaxed text-ink/65">{subtitle}</p>}
            <div className="mt-9">{children}</div>
            {footer && <div className="mt-8 border-t border-ink/10 pt-6 text-center text-sm text-ink-500">{footer}</div>}
          </div>
        </main>
      </div>

      <div className="grain grain-dark relative hidden overflow-hidden bg-night lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-12">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 45% at 50% 40%, rgba(245,196,81,.14), transparent 70%)" }} />
        {/* Arch window with the envelope inside */}
        <div className="relative aspect-[3/4] w-[min(380px,72%)] overflow-hidden rounded-t-full bg-[#6b1e2a] shadow-[0_50px_90px_-40px_rgba(0,0,0,.7)] ring-1 ring-gold/40 ring-offset-8 ring-offset-night">
          <div className="absolute inset-0" style={{ background: "#5d1824", clipPath: "polygon(0 22%, 0 100%, 51% 66%)" }} />
          <div className="absolute inset-0" style={{ background: "#5d1824", clipPath: "polygon(100% 22%, 100% 100%, 49% 66%)" }} />
          <div className="absolute inset-0" style={{ background: "#661c28", clipPath: "polygon(0 100%, 100% 100%, 52% 62%, 48% 62%)" }} />
          <div className="absolute inset-0 drop-shadow-[0_8px_14px_rgba(0,0,0,.35)]">
            <div className="absolute inset-0" style={{ background: "#74222f", clipPath: "polygon(0 22%, 100% 22%, 54% 64%, 50% 67%, 46% 64%)" }} />
          </div>
          <WaxSeal color="#c9a24a" icon="dove" className="absolute left-1/2 top-[66%] w-28 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative mt-12 max-w-sm text-center">
          <p className="font-serif text-3xl leading-tight text-cream">
            Every celebration begins with <em className="text-gold">an invitation.</em>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-cream/55">Create one your guests will remember from the very first tap.</p>
        </div>
      </div>
    </div>
  );
}
