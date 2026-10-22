"use client";

import { useMemo } from "react";
import { InviteContext } from "./InviteContext";
import StickerLayer from "./StickerLayer";
import Effects from "./Effects";
import { Hero, Hosts, Story, Note, DressCode, Video, Quote, Families, Closing } from "./sections/basic";
import { Scratch, Timeline, Gifts, Faq } from "./sections/extra";
import { EventDetails, Countdown, Schedule, Venue, Contact } from "./sections/event";
import Gallery from "./sections/Gallery";
import { Rsvp, Wishes } from "./sections/interactive";
import { backgroundCss, googleFontsHref, resolveTheme } from "@/data/themes";
import { luminance, readableOn, shade } from "@/lib/color";
import { InviteFooter, TabBar, TopNav } from "./PageChrome";

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
  quote: Quote,
  families: Families,
  closing: Closing,
  scratch: Scratch,
  timeline: Timeline,
  gifts: Gifts,
  faq: Faq,
};

export { readableOn };

export function themeVars(theme = {}) {
  const bandDark = luminance(theme.background || "#ffffff") < 0.35 ? shade(theme.surface || "#1b2140", -0.25) : shade(theme.primary || "#1c1a3d", -0.3);
  return {
    "--inv-band-dark": bandDark,
    "--inv-on-band-dark": readableOn(bandDark),
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

export function ThemeFonts({ theme, extra = [] }) {
  const href = googleFontsHref([theme?.fontHeading, theme?.fontBody, ...extra]);
  // React 19 hoists stylesheet links with `precedence` into <head>.
  return href ? <link rel="stylesheet" href={href} precedence="default" /> : null;
}

// Sections drawn on a dark full-width band (like the countdown in the design).
const DARK_BANDS = new Set(["countdown"]);

function bandStyle(type, index, theme) {
  if (type === "hero") return undefined;
  if (DARK_BANDS.has(type)) {
    const vars = themeVars(theme);
    const dark = vars["--inv-band-dark"];
    const on = vars["--inv-on-band-dark"];
    return {
      background: dark,
      color: on,
      "--inv-text": on,
      "--inv-primary": theme.secondary,
      "--inv-on-primary": readableOn(theme.secondary || "#c9a24a"),
      "--inv-bg": dark,
      "--inv-surface": shade(dark, 0.06),
    };
  }
  // alternate plain page background and a soft card-coloured band
  return index % 2 ? { background: "color-mix(in srgb, var(--inv-surface) 82%, transparent)" } : undefined;
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
  showChrome = true,
}) {
  const theme = useMemo(() => resolveTheme(invitation.theme || {}), [invitation.theme]);
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

  const hero = sections.find((s) => s.type === "hero")?.data || {};
  const ctx = useMemo(() => ({ mode, slug: invitation.slug, unlockToken, theme }), [mode, invitation.slug, unlockToken, theme]);

  return (
    <InviteContext.Provider value={ctx}>
      <ThemeFonts theme={theme} extra={sections.some((s) => s.type === "quote" && s.data?.arabic) ? ["Amiri"] : []} />
      <div
        className="relative min-h-full w-full"
        style={{ ...themeVars(theme), background: backgroundCss(theme), color: "var(--inv-text)", fontFamily: "var(--inv-font-body)" }}
        onPointerDown={editable ? () => onSelectSticker?.(null) : undefined}
      >
        <Effects kind={theme.animation} theme={theme} fixed={mode === "public"} />
        <div className="@container relative z-[3] w-full overflow-x-clip" style={{ containerType: "inline-size" }}>
          {showChrome && <TopNav sections={sections} title={hero.title || invitation.title} />}
          {sections.map((s, i) => {
            const Comp = COMPONENTS[s.type];
            const band = bandStyle(s.type, i, theme);
            return (
              <section key={s.id} id={`sec-${s.id}`} data-section-id={s.id} className="relative scroll-mt-16" style={band}>
                {s.type === "hero" ? (
                  <Comp data={s.data || {}} />
                ) : (
                  <div className="mx-auto w-full max-w-[1120px]">
                    <Comp data={s.data || {}} />
                  </div>
                )}
                {/* Stickers live in a centred column so they keep their place on every screen size. */}
                <div className="pointer-events-none absolute inset-y-0 left-1/2 w-full max-w-[720px] -translate-x-1/2" style={{ containerType: "inline-size" }}>
                  <StickerLayer
                    stickers={stickersBySection[s.id]}
                    editable={editable}
                    selectedId={selectedStickerId}
                    onSelect={onSelectSticker}
                    onChange={onStickerChange}
                  />
                </div>
              </section>
            );
          })}
          {showFooter ? <InviteFooter title={hero.title || invitation.title} date={hero.date} /> : showChrome && <div className="h-24 @3xl:hidden" />}
          {showChrome && <TabBar sections={sections} />}
        </div>
      </div>
    </InviteContext.Provider>
  );
}
