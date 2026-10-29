// Server-side reads shared by the public page's metadata and its generated preview image.
const API = (process.env.API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

// Server-side fetch so link previews (WhatsApp, Facebook…) get real title/image.
export async function fetchInvite(slug) {
  try {
    const res = await fetch(`${API}/public/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (res.status === 404) return { notFound: true };
    if (!res.ok) return { error: true };
    return await res.json();
  } catch {
    return { error: true };
  }
}

export function heroOf(invitation) {
  return invitation?.sections?.find((s) => s.type === "hero")?.data || {};
}
