import { SITE_URL } from "@/lib/seo";
import { OCCASIONS } from "@/data/occasions";

// The public pages: home, one page per occasion, sign-up. Invitations aren't listed: each belongs to a family and asks not to be indexed.
export default function sitemap() {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/invitations`, changeFrequency: "monthly", priority: 0.9 },
    ...OCCASIONS.map((o) => ({ url: `${SITE_URL}/invitations/${o.slug}`, changeFrequency: "monthly", priority: 0.8 })),
    { url: `${SITE_URL}/register`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/login`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/llms.txt`, changeFrequency: "monthly", priority: 0.3 },
  ];
}
