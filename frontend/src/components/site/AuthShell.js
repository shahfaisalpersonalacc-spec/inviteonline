import Logo from "@/components/ui/Logo";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-4 py-8 sm:px-10">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-zinc-600">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-center text-sm text-zinc-600">{footer}</div>}
          </div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 via-pink-600 to-purple-700 lg:block">
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(#fff 1.5px, transparent 1.6px) 0 0/22px 22px" }} />
        <div className="relative flex h-full flex-col items-center justify-center p-12 text-center text-white">
          <div className="text-7xl">💌</div>
          <p className="mt-6 font-script text-6xl">Celebrate together</p>
          <p className="mt-4 max-w-sm text-white/85">Create stunning invitation pages, share one link everywhere and keep track of every RSVP.</p>
          <div className="mt-10 flex gap-4 text-4xl">
            <span>🌸</span>
            <span>💍</span>
            <span>🎂</span>
            <span>🕌</span>
            <span>🎉</span>
          </div>
        </div>
      </div>
    </div>
  );
}
