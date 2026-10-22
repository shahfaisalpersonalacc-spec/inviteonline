import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-zinc-600">Beautiful online invitations for weddings, birthdays and every celebration. Create, share the link anywhere, and collect RSVPs.</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            <li><Link href="/#features" className="hover:text-brand-600">Features</Link></li>
            <li><Link href="/#events" className="hover:text-brand-600">Event types</Link></li>
            <li><Link href="/#faq" className="hover:text-brand-600">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            <li><Link href="/register" className="hover:text-brand-600">Create account</Link></li>
            <li><Link href="/login" className="hover:text-brand-600">Log in</Link></li>
            <li><Link href="/dashboard" className="hover:text-brand-600">Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-zinc-100 py-5 text-center text-xs text-zinc-500">© {new Date().getFullYear()} InviteOnline. Made with ❤ for every celebration.</p>
    </footer>
  );
}
