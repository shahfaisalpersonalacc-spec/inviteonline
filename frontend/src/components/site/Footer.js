import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      ["/#entrances", "Entrances"],
      ["/#features", "Features"],
      ["/#how", "How it works"],
      ["/#faq", "FAQ"],
    ],
  },
  {
    title: "Account",
    links: [
      ["/register", "Create account"],
      ["/login", "Log in"],
      ["/dashboard", "My invitations"],
      ["/forgot-password", "Reset password"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="grain grain-dark relative overflow-hidden bg-night text-cream">
      <div className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <LogoMark size={44} onDark />
            <p className="mt-6 max-w-sm font-serif text-2xl leading-snug text-cream/85">
              Online invitations for weddings, nikah, birthdays and <em className="text-gold">every celebration.</em>
            </p>
          </div>
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">{c.title}</p>
              <ul className="mt-5 space-y-3 text-[0.95rem] text-cream/65">
                {c.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="transition hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-cream/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} InviteOnline</p>
          <p>Made for every celebration</p>
        </div>
      </div>
      {/* Oversized wordmark, cropped by the bottom edge */}
      <p className="pointer-events-none -mb-[0.22em] select-none text-center text-[clamp(4rem,19vw,16rem)] font-extrabold leading-none tracking-[-0.06em] text-white/[0.045]" aria-hidden="true">
        InviteOnline
      </p>
    </footer>
  );
}
