import { SITE_URL } from "@/lib/seo";

// The public pages. Invitations aren't listed: each belongs to a family and asks not to be indexed.
export default function sitemap() {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/register`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/login`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/llms.txt`, changeFrequency: "monthly", priority: 0.3 },
  ];
}
