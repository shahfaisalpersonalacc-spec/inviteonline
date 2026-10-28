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
import { formatTime, videoEmbed } from "@/lib/format";
import { InviteFooter, SideNav, TabBar } from "./PageChrome";
import { Divider, SectionDecor, designFor } from "./decor/Decor";

// The mobile section tab bar (PageChrome TabBar) is switched off for now; set true to bring it back.
const SHOW_TAB_BAR = false;

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

// The cover's event date is the one date of the page: the countdown, the scratch card and a
// single event all show it, so they can never disagree. (Several events keep their own dates.)
function withEventDate(section, date) {
  const d = section.data || {};
  if (!date) return d;
  if (section.type === "countdown") return { ...d, target: date };
  if (section.type === "scratch") return { ...d, date };
  if (section.type === "event" && (d.items || []).length === 1) return { ...d, items: [{ ...d.items[0], date, time: formatTime(date) }] };
  return d;
}

// Sections that would render nothing (mirrors each component's own empty check), e.g. a gallery
// with no photos yet. They are left out up front so band colours and dividers follow only what
// guests see; otherwise an empty section kept a band colour and drew its divider as dark shards.
const some = (list, test) => (list || []).some(test);
function isEmptySection(type, d, mode) {
  switch (type) {
    case "quote": return !d.text && !d.arabic;
    case "hosts": return !some(d.people, (p) => p.name || p.photo);
    case "families": return !some(d.groups, (g) => g.title || g.names);
    case "story": return !d.text && !d.image;
    case "note": return !d.text && !d.heading;
    case "closing": return !d.text && !d.signature;
    case "video": return !videoEmbed(d.url);
    case "event": return !some(d.items, (e) => e.name || e.venue || e.date);
    case "countdown": return !d.target;
    case "schedule": return !some(d.items, (x) => x.title || x.time);
    case "venue": return !(d.mapQuery || d.name || d.address || d.image);
    case "contact": return !some(d.people, (p) => p.name || p.phone);
    case "timeline": return !some(d.items, (x) => x.title || x.text || x.date);
    case "faq": return !some(d.items, (x) => x.q);
    case "gallery": return mode !== "editor" && !some(d.images, Boolean); // the editor shows an upload hint
    default: return false;
  }
}

function darkBand(theme, color, design) {
  const vars = themeVars(theme);
  const dark = color || vars["--inv-band-dark"]; // a template may name its band colour exactly
  const on = design?.bandText || (color ? readableOn(color) : vars["--inv-on-band-dark"]);
  const accent = (luminance(theme.background || "#ffffff") < 0.35 ? theme.primary : theme.secondary) || "#c9a24a";
  return {
    background: dark,
    color: on,
    "--inv-text": on,
    "--inv-primary": accent,
    "--inv-on-primary": readableOn(accent),
    "--inv-bg": dark,
    "--inv-surface": shade(dark, 0.06),
    // a template may give band headings their own colour (e.g. white titles, gold buttons)
    ...(design?.bandHeading ? { "--inv-heading": design.bandHeading } : {}),
  };
}

// Section background for a design template: plain page, soft alternating tint, or light/dark bands.
// Soft tints are opaque so dividers drawn in the same colour blend seamlessly.
function templateBand(design, type, index, theme) {
  if (type === "hero" || design.bands === "plain") return undefined;
  if (design.bands === "alternate") return index % 2 === 0 ? darkBand(theme, design.band, design) : undefined;
  // On dark pages the surface is close to the page colour, so the alternate band needs a stronger
  // tint; otherwise two near-identical colours meet at the divider and it looks like a glitch.
  const tint = luminance(theme.background || "#ffffff") < 0.3 ? 14 : 5;
  return index % 2 ? { background: `color-mix(in srgb, var(--inv-surface), var(--inv-primary) ${tint}%)` } : undefined;
}

function bandStyle(type, index, theme, design) {
  if (design) return templateBand(design, type, index, theme);
  if (type === "hero") return undefined;
  if (DARK_BANDS.has(type)) {
    const vars = themeVars(theme);
    const dark = vars["--inv-band-dark"];
    const on = vars["--inv-on-band-dark"];
    const accent = (luminance(theme.background || "#ffffff") < 0.35 ? theme.primary : theme.secondary) || "#c9a24a";
    return {
      background: dark,
      color: on,
      "--inv-text": on,
      // on an already-dark page keep the glowing primary; on light pages the accent pops on the dark band
      "--inv-primary": accent,
      "--inv-on-primary": readableOn(accent),
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
  const sections = useMemo(() => {
    const date = (invitation.sections || []).find((s) => s.type === "hero")?.data?.date || "";
    return (invitation.sections || []).filter((s) => s.enabled !== false && COMPONENTS[s.type] && !isEmptySection(s.type, withEventDate(s, date), mode));
  }, [invitation.sections, mode]);

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
  const eventDate = (invitation.sections || []).find((s) => s.type === "hero")?.data?.date || "";
  // the closing section already signs off with the names; don't repeat them in the footer
  const hasSignature = sections.some((s) => s.type === "closing" && s.data?.signature);
  const design = useMemo(() => designFor(theme), [theme]);
  const ctx = useMemo(() => ({ mode, slug: invitation.slug, unlockToken, theme, design }), [mode, invitation.slug, unlockToken, theme, design]);
  const heroLayout = sections[0]?.type === "hero" ? sections[0].data?.layout : null;
  const photoCover = (heroLayout === "photo-top" || heroLayout === "full") && !!(hero.image || hero.bgImage || heroLayout === "photo-top");

  // a template divider where the band colour changes (and under a photo cover)
  const dividerAt = (i) => {
    if (!design || i <= 0 || i >= sections.length) return false;
    const band = bandStyle(sections[i].type, i, theme, design);
    const prev = bandStyle(sections[i - 1].type, i - 1, theme, design);
    const changes = (band?.background || "page") !== (prev?.background || "page");
    const afterPhoto = i === 1 && photoCover;
    if (design.divider === "line") return sections[i - 1].type !== "hero";
    if (design.divider === "floral") return (changes && i % 2 === 0) || afterPhoto;
    return changes || afterPhoto;
  };
  // A divider rises into the section above it, so that section gets matching extra bottom space;
  // otherwise its last line (e.g. the closing names) sits on the edge instead of centred.
  const EDGE = { floral: "clamp(40px, 13cqw, 90px)", line: "0px" };
  const edgeBelow = (i) => {
    const next = i < sections.length - 1 ? dividerAt(i + 1) : showFooter && design && design.divider !== "none";
    return next ? EDGE[design.divider] || "clamp(18px, 5cqw, 44px)" : undefined;
  };

  return (
    <InviteContext.Provider value={ctx}>
      <ThemeFonts theme={theme} extra={sections.some((s) => s.type === "quote" && s.data?.arabic) ? ["Amiri"] : []} />
      <div
        className="relative min-h-full w-full"
        data-inv-buttons={design?.buttons || undefined}
        data-inv-numerals={design?.numerals || undefined}
        style={{
          ...themeVars(theme),
          background: backgroundCss(theme),
          color: "var(--inv-text)",
          fontFamily: "var(--inv-font-body)",
          // template typography: body weight, and the face used for big numbers (times, countdown, dates)
          fontWeight: design?.bodyWeight,
          "--inv-font-num": design?.numerals === "heading" ? "var(--inv-font-heading)" : "var(--inv-font-body)",
        }}
        onPointerDown={editable ? () => onSelectSticker?.(null) : undefined}
      >
        <Effects kind={theme.animation} theme={theme} fixed={mode === "public"} />
        <div className="@container relative z-[3] w-full overflow-x-clip" style={{ containerType: "inline-size" }}>
          {showChrome && <SideNav sections={sections} />}
          {sections.map((s, i) => {
            const Comp = COMPONENTS[s.type];
            const band = bandStyle(s.type, i, theme, design);
            const divider = dividerAt(i);
            return (
              <section
                key={s.id}
                id={`sec-${s.id}`}
                data-section-id={s.id}
                className="relative scroll-mt-16 @3xl:scroll-mt-0"
                style={{ ...band, "--inv-section-bg": band?.background || "var(--inv-bg)", paddingBottom: s.type === "hero" ? undefined : edgeBelow(i) }}
              >
                {divider && <Divider design={design} theme={theme} fill={band?.background || "var(--inv-bg)"} seed={i} />}
                {s.type !== "hero" && <SectionDecor design={design} theme={theme} index={i} count={sections.length} />}
                {s.type === "hero" ? (
                  <Comp data={s.data || {}} />
                ) : (
                  <div className="relative z-[1] mx-auto w-full max-w-[1120px] @3xl:px-16 @[86rem]:px-0" /* equal side padding keeps centred content centred while leaving room for the side rail */>
                    <Comp data={withEventDate(s, eventDate)} />
                  </div>
                )}
                {/* Stickers live in a centred column so they keep their place on every screen size.
                    z-10 keeps them above section content (the hero uses z-[1]) so they can be
                    dragged in the editor; the column ignores taps, only stickers take them. */}
                <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-full max-w-[720px] -translate-x-1/2" style={{ containerType: "inline-size" }}>
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
          {showFooter ? <InviteFooter title={hasSignature ? "" : hero.title || invitation.title} date={hero.date} /> : showChrome && SHOW_TAB_BAR && <div className="h-24 @3xl:hidden" />}
          {showChrome && SHOW_TAB_BAR && <TabBar sections={sections} />}
        </div>
      </div>
    </InviteContext.Provider>
  );
}
