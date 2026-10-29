import { ImageResponse } from "next/og";
import { fetchInvite, heroOf } from "../invite-data";
import { formatDate } from "@/lib/format";

// The link-preview image for an invitation without a photo: a 1200×630 card in its own colours and
// heading font, with the names (cover title) and the date.

const fonts = new Map();

// A Google font as TTF (what the image renderer reads), only the glyphs in `text`. Null if it can't load,
// and the card then uses the built-in sans.
async function googleFont(family, text) {
  const key = `${family}|${text}`;
  if (!fonts.has(key)) {
    fonts.set(
      key,
      (async () => {
        try {
          const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}&text=${encodeURIComponent(text)}`)).text();
          const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
          return url ? await (await fetch(url)).arrayBuffer() : null;
        } catch {
          return null;
        }
      })()
    );
  }
  const data = await fonts.get(key);
  if (!data) fonts.delete(key); // try again next time
  return data;
}

export async function GET(_req, { params }) {
  const { slug } = await params;
  const data = await fetchInvite(slug);
  const inv = data?.invitation;
  if (!inv) return new Response("Not found", { status: 404 });

  const theme = inv.theme || {};
  const hero = heroOf(inv);
  const names = (hero.title || inv.title || "").trim();
  // guest-facing dates are Indian timings
  const date = formatDate(hero.date, { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
  const bg = theme.background || "#fffaf5";
  const ink = theme.text || "#2b1a1a";
  const accent = theme.primary || "#8f1219";
  const invited = "YOU'RE INVITED";

  const [heading, body] = await Promise.all([
    googleFont(theme.fontHeading || "Cormorant Garamond", names),
    googleFont("Cormorant Garamond", `${invited}${date}`),
  ]);
  const loaded = [
    heading && { name: "Heading", data: heading, weight: 400, style: "normal" },
    body && { name: "Body", data: body, weight: 400, style: "normal" },
  ].filter(Boolean);
  const size = Math.max(72, Math.min(156, Math.round(1900 / Math.max(names.length, 8))));
  const rule = { width: 120, height: 2, background: accent, opacity: 0.55 };

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: bg, padding: 28 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${accent}`,
            boxShadow: `0 0 0 10px ${bg}, 0 0 0 13px ${accent}`,
            margin: 13,
            color: ink,
            padding: "0 70px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22, color: accent, fontFamily: "Body", fontSize: 30, letterSpacing: 8 }}>
            <div style={rule} />
            {invited}
            <div style={rule} />
          </div>
          <div style={{ display: "flex", marginTop: 26, fontFamily: "Heading", fontSize: size, lineHeight: 1.15, textAlign: "center", justifyContent: "center" }}>{names}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 30 }}>
            <div style={{ width: 70, height: 1, background: accent, opacity: 0.5 }} />
            <div style={{ width: 12, height: 12, background: accent, transform: "rotate(45deg)" }} />
            <div style={{ width: 70, height: 1, background: accent, opacity: 0.5 }} />
          </div>
          {date && <div style={{ display: "flex", marginTop: 26, fontFamily: "Body", fontSize: 42, letterSpacing: 3 }}>{date}</div>}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // with no font loaded, leave `fonts` out so the built-in one is used
      fonts: loaded.length ? loaded : undefined,
      // previews are cached by WhatsApp/Facebook anyway; a few minutes here keeps edits showing up
      headers: { "cache-control": "public, max-age=300" },
    }
  );
}
