import Link from "next/link";
import Logo from "@/components/ui/Logo";
import WaxSeal from "@/components/invite/entry/WaxSeal";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="main" className="atelier relative flex min-h-screen flex-col overflow-hidden">
      <header className="relative z-10 mx-auto flex h-[4.25rem] w-full max-w-6xl items-center px-4 sm:px-6">
        <Logo />
      </header>
      <section className="at-rise relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-20 text-center">
        <div className="at-float">
          <WaxSeal color="#e8544a" icon="heart" className="w-24 drop-shadow-[0_18px_24px_rgba(232,84,74,.35)] sm:w-28" />
        </div>
        <p className="eyebrow mt-6">Error 404</p>
        <h1 className="display mt-4 max-w-2xl text-[2.6rem] leading-[1.02] sm:text-6xl">
          This page didn&apos;t make the <em>guest list.</em>
        </h1>
        <p className="mt-5 max-w-md leading-relaxed text-ink/65">The link may be mistyped or the page has moved. If you were opening an invitation, check the link with the person who sent it.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            Back to home
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            My invitations
          </Link>
        </div>
      </section>
    </main>
  );
}
