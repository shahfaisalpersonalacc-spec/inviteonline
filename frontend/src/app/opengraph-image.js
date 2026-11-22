import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// The card shown when inviteonline.in itself is shared (WhatsApp, LinkedIn, X, search results).
// Invitations have their own cards (i/[slug]/preview-image).
export const alt = "InviteOnline: online invitations for weddings, nikah, birthdays and every celebration";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HEADLINE = "Invitations worth opening.";
const LINE = "Weddings · Nikah · Mehndi · Birthdays · Every celebration";

// Fraunces (the site's headline font) as TTF, only the glyphs used; the card falls back to the built-in sans
async function fraunces(text) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Fraunces:ital@1&text=${encodeURIComponent(text)}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Image() {
  const font = await fraunces(`InviteOnline${HEADLINE}`);
  const serif = font ? "Fraunces" : "sans-serif";
  // the same mark as the browser tab (app/icon.svg)
  const logo = `data:image/svg+xml;base64,${(await readFile(join(process.cwd(), "src/app/icon.svg"))).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 96px", background: "radial-gradient(ellipse 70% 80% at 85% 10%, #3a3160, #1C1A3D 60%, #14122c)", color: "#fbf6ee" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- the image renderer only understands <img> */}
          <img src={logo} width={64} height={64} alt="" />
          <div style={{ fontFamily: serif, fontSize: 44, color: "#e9cd84" }}>InviteOnline</div>
        </div>
        <div style={{ fontFamily: serif, fontSize: 96, lineHeight: 1.02, marginTop: 40, maxWidth: 900 }}>{HEADLINE}</div>
        <div style={{ fontSize: 30, marginTop: 36, color: "rgba(251,246,238,.72)" }}>{LINE}</div>
        <div style={{ display: "flex", gap: 16, marginTop: 44 }}>
          {["Opening palace doors", "RSVP & wishes", "Share on WhatsApp"].map((t) => (
            <div key={t} style={{ fontSize: 24, padding: "10px 22px", borderRadius: 999, border: "2px solid rgba(233,205,132,.45)", color: "#e9cd84" }}>{t}</div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Fraunces", data: font, style: "italic" }] : [] }
  );
}
