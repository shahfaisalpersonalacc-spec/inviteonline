import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Plus } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { OCCASIONS, occasionBySlug } from "@/data/occasions";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

// One static page per occasion; any other slug is a 404
export const dynamicParams = false;
export function generateStaticParams() {
  return OCCASIONS.map((o) => ({ occasion: o.slug }));
}

export async function generateMetadata({ params }) {
  const o = occasionBySlug((await params).occasion);
  if (!o) return {};
  const path = `/invitations/${o.slug}`;
  return {
    title: o.title,
    description: o.description,
    alternates: { canonical: path },
    openGraph: { url: path, title: `${o.title} · ${SITE_NAME}`, description: o.description },
    twitter: { title: `${o.title} · ${SITE_NAME}`, description: o.description },
  };
}

function jsonLd(o) {
  const url = `${SITE_URL}/invitations/${o.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: o.title,
        description: o.description,
        inLanguage: "en-IN",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Invitations", item: `${SITE_URL}/invitations` },
          { "@type": "ListItem", position: 3, name: o.h1, item: url },
        ],
      },
      {
        "@type": "HowTo",
        name: `How to make an ${o.h1.charAt(0).toLowerCase()}${o.h1.slice(1).replace(/s$/, "")}`,
        step: o.steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
      },
      { "@type": "FAQPage", mainEntity: o.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };
}

export default async function OccasionPage({ params }) {
  const o = occasionBySlug((await params).occasion);
  if (!o) notFound();
  const others = OCCASIONS.filter((x) => x.slug !== o.slug);
  return (
    <div className="atelier relative min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(o)).replace(/</g, "\\u003c") }} />
      <Navbar />
      <main id="main" className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6 md:pt-14">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-ink">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/invitations" className="hover:text-ink">Invitations</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">{o.label}</li>
          </ol>
        </nav>

        <h1 className="display mt-6 text-[clamp(2.4rem,8vw,4.2rem)] leading-[1]">{o.h1}</h1>
        <p className="mt-6 max-w-2xl text-[1.08rem] leading-relaxed text-ink/75 sm:text-lg">{o.intro}</p>
        <Link href="/register" className="btn-coral mt-8 !px-7 !py-4 !text-base">
          Create your {o.label.toLowerCase()} invitation <ArrowRight className="h-4 w-4" />
        </Link>

        <section className="mt-16">
          <h2 className="font-serif text-3xl text-ink">What to put on your {o.label.toLowerCase()} invitation</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {o.include.map((t) => (
              <li key={t} className="at-glass flex gap-3 rounded-2xl px-4 py-3.5 text-ink/80">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-3xl text-ink">How to make it</h2>
          <ol className="mt-6 space-y-3">
            {o.steps.map((t, i) => (
              <li key={t} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink font-serif text-cream">{i + 1}</span>
                <span className="pt-1 text-ink/80">{t}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-3xl text-ink">Questions</h2>
          <div className="mt-6 space-y-3">
            {o.faq.map((f) => (
              <details key={f.q} className="at-glass group rounded-3xl px-5 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-lg text-ink [&::-webkit-details-marker]:hidden">
                  <h3>{f.q}</h3>
                  <Plus className="h-4 w-4 shrink-0 text-gold-600 transition group-open:rotate-45" />
                </summary>
                <p className="-mt-1 pb-5 pr-10 leading-relaxed text-ink-500">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-2xl text-ink">Invitations for other occasions</h2>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {others.map((x) => (
              <li key={x.slug}>
                <Link href={`/invitations/${x.slug}`} className="at-glass inline-block rounded-full px-4 py-2 text-sm font-medium text-ink/80 hover:text-ink">
                  {x.label} invitations
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
