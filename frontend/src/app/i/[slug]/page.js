import { notFound } from "next/navigation";
import PublicInvitation from "./PublicInvitation";

const API = (process.env.API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

// Server-side fetch so link previews (WhatsApp, Facebook…) get real title/image.
async function fetchInvite(slug) {
  try {
    const res = await fetch(`${API}/public/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (res.status === 404) return { notFound: true };
    if (!res.ok) return { error: true };
    return await res.json();
  } catch {
    return { error: true };
  }
}

function heroOf(invitation) {
  return invitation?.sections?.find((s) => s.type === "hero")?.data || {};
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await fetchInvite(slug);
  if (!data?.invitation) return { title: "Invitation" };
  const inv = data.invitation;
  const hero = heroOf(inv);
  const image = inv.coverImage || hero.image;
  const description = inv.description || hero.tagline || "You're invited! Open to see all the details.";
  return {
    title: { absolute: inv.title },
    description,
    openGraph: { title: inv.title, description, type: "website", images: image ? [{ url: image }] : undefined },
    twitter: { card: image ? "summary_large_image" : "summary", title: inv.title, description, images: image ? [image] : undefined },
    robots: { index: false },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const data = await fetchInvite(slug);
  if (data.notFound) notFound();
  return <PublicInvitation slug={slug} initial={data.error ? null : data} />;
}
