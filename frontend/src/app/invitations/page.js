import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { OCCASIONS } from "@/data/occasions";
import { SITE_URL } from "@/lib/seo";

const DESCRIPTION =
  "Online invitations for weddings, nikah, walima, mehndi, engagements, birthdays, baby showers and anniversaries. Pick your occasion, design it in minutes and share one link with RSVP.";

export const metadata = {
  title: "Online Invitations for Every Occasion",
  description: DESCRIPTION,
  alternates: { canonical: "/invitations" },
  openGraph: { url: "/invitations", description: DESCRIPTION },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  url: `${SITE_URL}/invitations`,
  name: "Online invitations for every occasion",
  description: DESCRIPTION,
  isPartOf: { "@id": `${SITE_URL}/#website` },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: OCCASIONS.map((o, i) => ({ "@type": "ListItem", position: i + 1, name: o.h1, url: `${SITE_URL}/invitations/${o.slug}` })),
  },
};

export default function InvitationsIndex() {
  return (
    <div className="atelier relative min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }} />
      <Navbar />
      <main id="main" className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 md:pt-14">
        <h1 className="display text-[clamp(2.4rem,8vw,4.2rem)] leading-[1]">Online invitations for every occasion</h1>
        <p className="mt-6 max-w-2xl text-[1.08rem] leading-relaxed text-ink/75 sm:text-lg">{DESCRIPTION}</p>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {OCCASIONS.map((o) => (
            <li key={o.slug}>
              <Link href={`/invitations/${o.slug}`} className="at-glass group block h-full rounded-3xl p-6 transition hover:shadow-[0_0_0_1px_rgba(201,162,74,.35)]">
                <h2 className="font-serif text-2xl text-ink">{o.h1}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{o.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                  See how <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
