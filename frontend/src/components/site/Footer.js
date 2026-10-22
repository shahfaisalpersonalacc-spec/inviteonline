import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm font-display text-lg text-cream/65">
            Breathtaking online invitations for weddings, nikah, birthdays and every celebration. Open, RSVP and celebrate on one link.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Product</p>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
            <li><Link href="/#entrances" className="hover:text-white">Entrances</Link></li>
            <li><Link href="/#features" className="hover:text-white">Features</Link></li>
            <li><Link href="/#faq" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Account</p>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
            <li><Link href="/register" className="hover:text-white">Create account</Link></li>
            <li><Link href="/login" className="hover:text-white">Log in</Link></li>
            <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 py-6 text-center text-xs text-cream/45">© {new Date().getFullYear()} InviteOnline · Made for every celebration</p>
    </footer>
  );
}
