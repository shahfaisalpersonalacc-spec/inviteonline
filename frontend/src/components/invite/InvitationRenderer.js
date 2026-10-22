"use client";

import Link from "next/link";
import { useMemo } from "react";
import { InviteContext } from "./InviteContext";
import StickerLayer from "./StickerLayer";
import Effects from "./Effects";
import { Hero, Hosts, Story, Note, DressCode, Video } from "./sections/basic";
import { EventDetails, Countdown, Schedule, Venue, Contact } from "./sections/event";
import Gallery from "./sections/Gallery";
import { Rsvp, Wishes } from "./sections/interactive";
import { backgroundCss, googleFontsHref } from "@/data/themes";

const COMPONENTS = {
  hero: Hero,
  hosts: Hosts,
  story: Story,
  event: EventDetails,
  countdown: Countdown,
  schedule: Schedule,
  venue: Venue,
  gallery: Gallery,
  video: Video,
  dresscode: DressCode,
  rsvp: Rsvp,
  wishes: Wishes,
  contact: Contact,
  note: Note,
};

// Picks black or white text for a given background hex colour.
export function readableOn(hex = "#000000") {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6);
  const n = parseInt(full, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? "#18181b" : "#ffffff";
}

export function themeVars(theme = {}) {
  return {
    "--inv-primary": theme.primary,
    "--inv-secondary": theme.secondary,
    "--inv-bg": theme.background,
    "--inv-surface": theme.surface,
    "--inv-text": theme.text,
    "--inv-on-primary": readableOn(theme.primary),
    "--inv-font-heading": `"${theme.fontHeading}", cursive`,
    "--inv-font-body": `"${theme.fontBody}", system-ui, sans-serif`,
  };
}

export function ThemeFonts({ theme }) {
  const href = googleFontsHref([theme?.fontHeading, theme?.fontBody]);
  // React 19 hoists stylesheet links with `precedence` into <head>.
  return href ? <link rel="stylesheet" href={href} precedence="default" /> : null;
}

/**
 * Renders an invitation. mode "public" for guests, "editor" for the owner's live preview
 * (stickers become draggable and forms don't submit).
 */
export default function InvitationRenderer({
  invitation,
  mode = "public",
  unlockToken = null,
  selectedStickerId,
  onSelectSticker,
  onStickerChange,
  showFooter = true,
}) {
  const theme = useMemo(() => invitation.theme || {}, [invitation.theme]);
  const editable = mode === "editor" && !!onStickerChange;
  const sections = useMemo(() => (invitation.sections || []).filter((s) => s.enabled !== false && COMPONENTS[s.type]), [invitation.sections]);

  const stickersBySection = useMemo(() => {
    const ids = new Set(sections.map((s) => s.id));
    const fallback = sections[0]?.id;
    const map = {};
    for (const st of invitation.stickers || []) {
      const key = ids.has(st.sectionId) ? st.sectionId : fallback;
      (map[key] ||= []).push(st);
    }
    return map;
  }, [invitation.stickers, sections]);

  const ctx = useMemo(() => ({ mode, slug: invitation.slug, unlockToken, theme }), [mode, invitation.slug, unlockToken, theme]);

  return (
    <InviteContext.Provider value={ctx}>
      <ThemeFonts theme={theme} />
      <div
        className="relative min-h-full w-full"
        style={{ ...themeVars(theme), background: backgroundCss(theme), color: "var(--inv-text)", fontFamily: "var(--inv-font-body)" }}
        onPointerDown={editable ? () => onSelectSticker?.(null) : undefined}
      >
        <Effects kind={theme.animation} theme={theme} fixed={mode === "public"} />
        <div className="@container relative z-[3] mx-auto w-full max-w-[720px] overflow-x-clip" style={{ containerType: "inline-size" }}>
          {sections.map((s) => {
            const Comp = COMPONENTS[s.type];
            return (
              <section key={s.id} id={`sec-${s.id}`} data-section-id={s.id} className="relative">
                <Comp data={s.data || {}} />
                <StickerLayer
                  stickers={stickersBySection[s.id]}
                  editable={editable}
                  selectedId={selectedStickerId}
                  onSelect={onSelectSticker}
                  onChange={onStickerChange}
                />
              </section>
            );
          })}
          {showFooter && (
            <footer className="px-6 pb-24 pt-6 text-center text-xs opacity-60">
              Made with ❤ on{" "}
              <Link href="/" className="font-semibold underline">
                InviteOnline
              </Link>
            </footer>
          )}
        </div>
      </div>
    </InviteContext.Provider>
  );
}
