import Logo from "@/components/ui/Logo";
import WaxSeal from "@/components/invite/entry/WaxSeal";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <div className="relative flex flex-col px-4 py-8 sm:px-10">
        <div className="pointer-events-none absolute -left-24 -top-24 -z-10 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl" />
        <Logo />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
            {subtitle && <p className="mt-2 font-display text-lg text-ink/65">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-7 text-center text-sm text-ink-500">{footer}</div>}
          </div>
        </div>
      </div>

      {/* Envelope art */}
      <div className="relative hidden overflow-hidden bg-[#6b1e2a] lg:block">
        <div
          className="absolute inset-0"
          style={{
            background:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.3'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute inset-0" style={{ background: "#5d1824", clipPath: "polygon(0 0, 0 100%, 51% 56%)" }} />
        <div className="absolute inset-0" style={{ background: "#5d1824", clipPath: "polygon(100% 0, 100% 100%, 49% 56%)" }} />
        <div className="absolute inset-0" style={{ background: "#661c28", clipPath: "polygon(0 100%, 100% 100%, 52% 52%, 48% 52%)" }} />
        <div className="absolute inset-0 drop-shadow-[0_8px_14px_rgba(0,0,0,.35)]">
          <div className="absolute inset-0" style={{ background: "#74222f", clipPath: "polygon(0 0, 100% 0, 53.5% 55%, 50% 57%, 46.5% 55%)" }} />
        </div>
        <WaxSeal color="#c9a24a" icon="dove" className="absolute left-1/2 top-[56%] w-40 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-x-0 bottom-14 px-12 text-center text-[#f3d9a4]">
          <p className="font-script text-6xl">Celebrate together</p>
          <p className="mx-auto mt-3 max-w-sm font-display text-lg text-[#f3d9a4]/80">Create an invitation your guests will remember from the very first tap.</p>
        </div>
      </div>
    </div>
  );
}
