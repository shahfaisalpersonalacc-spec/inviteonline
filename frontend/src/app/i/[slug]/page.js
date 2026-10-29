import { headers } from "next/headers";
import { notFound } from "next/navigation";
import PublicInvitation from "./PublicInvitation";
import { fetchInvite, heroOf } from "./invite-data";

// WhatsApp skips preview images over ~300 KB, so Cloudinary photos are served as a 1200×630 JPEG
// (the standard link-preview size, typically under 150 KB). Other URLs are left as they are.
function previewImage(url) {
  if (!url?.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", "/upload/c_fill,g_auto,w_1200,h_630,q_auto:good,f_jpg/");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await fetchInvite(slug);
  if (!data?.invitation) return { title: "Invitation" };
  const inv = data.invitation;
  const hero = heroOf(inv);
  const photo = previewImage(inv.coverImage || hero.image);
  // no photo: a card made for this invitation (names and date in its colours), see preview-image/route.js.
  // Its full address uses the domain this page was opened on, so WhatsApp can fetch it even when
  // NEXT_PUBLIC_SITE_URL still says localhost.
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto")?.split(",")[0] || (/^(localhost|127\.)/.test(host || "") ? "http" : "https");
  const card = `${host ? `${proto}://${host}` : ""}/i/${encodeURIComponent(slug)}/preview-image`;
  const image = photo || card;
  const sized = !photo || photo.includes("w_1200,h_630");
  const description = inv.description || hero.tagline || "You're invited! Open to see all the details.";
  return {
    title: { absolute: inv.title },
    description,
    openGraph: { title: inv.title, description, type: "website", images: [{ url: image, ...(sized ? { width: 1200, height: 630 } : {}), ...(photo ? {} : { type: "image/png" }) }] },
    twitter: { card: "summary_large_image", title: inv.title, description, images: [image] },
    robots: { index: false },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const data = await fetchInvite(slug);
  if (data.notFound) notFound();
  return <PublicInvitation slug={slug} initial={data.error ? null : data} />;
}
