"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BookHeart, CalendarDays, Check, Home, Image as ImageIcon, MapPin } from "lucide-react";
import { formatDate } from "@/lib/format";
import { SECTION_META } from "@/data/sections";
import { useInvite } from "./InviteContext";
import { Divider } from "./decor/Decor";
import { luminance } from "@/lib/color";

// Which sections the nav / tab bar can jump to (first matching section wins).
const TARGETS = [
  { key: "home", label: "Home", types: ["hero"], Icon: Home },
  { key: "story", label: "Our story", types: ["timeline", "story", "hosts"], Icon: BookHeart },
  { key: "events", label: "Events", types: ["event", "schedule"], Icon: CalendarDays },
  { key: "venue", label: "Venue", types: ["venue"], Icon: MapPin },
  { key: "gallery", label: "Gallery", types: ["gallery"], Icon: ImageIcon },
  { key: "rsvp", label: "RSVP", types: ["rsvp"], Icon: Check },
];

function useTargets(sections) {
  return useMemo(
    () =>
      TARGETS.map((t) => ({ ...t, id: sections.find((s) => t.types.includes(s.type))?.id })).filter((t) => t.id),
    [sections]
  );
}

// Jump to a section by scrolling only the invitation's own scroller. scrollIntoView would also
// scroll every ancestor, so in the editor / landing-page demo it jolted the whole page.
const go = (id) => {
  const el = document.getElementById(`sec-${id}`);
  const box = scrollParent(el);
  if (!box) return el?.scrollIntoView({ behavior: "smooth", block: "start" });
  // rects are in screen pixels; divide by the box's on-screen scale (the demo phone may be scaled down)
  const scale = box.getBoundingClientRect().height / box.offsetHeight || 1;
  const top = (el.getBoundingClientRect().top - box.getBoundingClientRect().top) / scale + box.scrollTop;
  box.scrollTo({ top, behavior: "smooth" });
};

// Desktop navigation: a vertical glass rail on the right edge (the mobile tab bar's sibling).
// One round icon per key section; the current one fills with the theme colour and its name shows beside it (always on wide screens, on hover otherwise).
export function SideNav({ sections }) {
  const layer = useRef(null);
  const [viewH, setViewH] = useState(0); // height of the scrolling preview; 0 = the browser window

  useEffect(() => {
    const sp = scrollParent(layer.current);
    if (!sp) return;
    const ro = new ResizeObserver(() => setViewH(sp.clientHeight));
    ro.observe(sp);
    return () => ro.disconnect();
  }, []);

  const targets = useTargets(sections); // starts with Home (the cover), which takes guests back to the top
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);
  const active = useActiveSection(ids);
  const order = (id) => ids.indexOf(id);
  const current = targets.filter((t) => order(t.id) <= order(active)).pop()?.key;

  const rail = (
    <nav
      aria-label="Invitation sections"
      className="pointer-events-auto flex flex-col items-center gap-1.5 rounded-full p-2"
      style={{
        background: "color-mix(in srgb, var(--inv-bg) 62%, transparent)",
        backdropFilter: "blur(18px) saturate(1.3)",
        WebkitBackdropFilter: "blur(18px) saturate(1.3)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.2), 0 0 0 1px color-mix(in srgb, var(--inv-secondary) 45%, transparent), 0 18px 40px -22px rgba(0,0,0,.45)",
      }}
    >
      {targets.map(({ key, id, label, Icon }) => {
        const on = current === key;
        return (
          <button
            key={key}
            onClick={() => go(id)}
            aria-label={label}
            aria-current={on ? "true" : undefined}
            className="group relative grid h-11 w-11 place-items-center rounded-full transition duration-300"
            style={
              on
                ? { background: "linear-gradient(135deg, var(--inv-primary), color-mix(in srgb, var(--inv-primary) 55%, var(--inv-secondary)))", color: "var(--inv-on-primary)", boxShadow: "0 8px 20px -8px var(--inv-primary)" }
                : { color: "color-mix(in srgb, var(--inv-text) 70%, transparent)" }
            }
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            <span
              className={`pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition duration-300 ${
                on ? "opacity-0 group-hover:opacity-100 @7xl:opacity-100" : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`}
              style={{ background: "color-mix(in srgb, var(--inv-bg) 80%, transparent)", color: "var(--inv-primary)", boxShadow: "0 0 0 1px color-mix(in srgb, var(--inv-secondary) 45%, transparent)" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );

  // A sticky layer exactly as tall as the visible area (the window, or the editor / demo preview
  // that scrolls the invitation), with the rail centred inside it. The equal negative bottom margin
  // means the layer takes no room in the page, so the rail sits mid-screen from the first moment.
  return (
    <div
      ref={layer}
      className="pointer-events-none sticky top-0 z-40 hidden items-center justify-end pr-5 @3xl:flex"
      style={{ height: viewH ? `${viewH}px` : "100svh", marginBottom: viewH ? `-${viewH}px` : "-100svh" }}
    >
      {rail}
    </div>
  );
}

// Short labels for the mobile carousel (one tab per visible section).
const TAB_LABELS = {
  hero: "Home", quote: "Verse", hosts: "Couple", families: "Family", scratch: "Date", countdown: "Countdown",
  event: "Events", schedule: "Programme", timeline: "Story", story: "Story", venue: "Venue", gallery: "Gallery",
  video: "Video", dresscode: "Dress code", gifts: "Gifts", rsvp: "RSVP", wishes: "Wishes", faq: "FAQ",
  contact: "Contact", note: "Note", closing: "Thanks",
};

// Scroll-spy over every section: the one crossing the middle of the screen is active.
// Nearest scrolling ancestor (the editor / demo preview), or null for the page itself.
function scrollParent(el) {
  for (let p = el?.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
    const oy = getComputedStyle(p).overflowY;
    if ((oy === "auto" || oy === "scroll") && p.scrollHeight > p.clientHeight + 1) return p;
  }
  return null; // the page itself scrolls (window)
}

// Position-based scroll-spy: the active section is the last one whose top has passed a reading
// line at 45% of the visible height. It only moves forward as you scroll down, so the tab bar
// never flickers between neighbours (the old ratio-based observer did, which made it jump).
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(`sec-${id}`)).filter(Boolean);
    if (!els.length) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!els[0].offsetParent) return; // hidden (e.g. editor showing the form instead of the preview)
      // looked up each time: the editor preview may have been hidden when this effect started
      const scroller = scrollParent(els[0]);
      const box = scroller ? scroller.getBoundingClientRect() : { top: 0, height: window.innerHeight };
      const line = box.top + box.height * 0.45;
      const atEnd = scroller
        ? scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2
        : window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      let current = els[0];
      if (atEnd) current = els[els.length - 1];
      else for (const el of els) if (el.getBoundingClientRect().top <= line) current = el;
      setActive(current.id.replace(/^sec-/, ""));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    // capture: hears scrolling of the page *and* of any inner scroller (editor / demo preview)
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);
    // re-measure when the preview appears or the layout changes size
    const ro = new ResizeObserver(onScroll);
    ro.observe(els[0]);
    measure();
    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids]);
  return active;
}

// Mobile section navigation: a horizontally scrollable carousel of round icon tabs.
// The active tab grows, fills with the theme colour and is kept centred.
export function TabBar({ sections }) {
  const tabs = useMemo(
    () => sections.map((s) => ({ id: s.id, type: s.type, label: TAB_LABELS[s.type] || "Section", Icon: s.type === "hero" ? Home : SECTION_META[s.type]?.Icon || Home })),
    [sections]
  );
  const ids = useMemo(() => tabs.map((t) => t.id), [tabs]);
  const active = useActiveSection(ids);
  const scroller = useRef(null);
  const items = useRef({});

  // Keep the active tab centred in the carousel (horizontal scroll only, never the page).
  // Waits for the active tab to settle, so a fast scroll past several sections glides once
  // instead of restarting the carousel animation for every section it crosses.
  useEffect(() => {
    const t = setTimeout(() => {
      const box = scroller.current;
      const el = items.current[active];
      if (!box || !el) return;
      box.scrollTo({ left: el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
    }, 140);
    return () => clearTimeout(t);
  }, [active]);

  if (tabs.length < 2) return null;
  return (
    // Floating dock: the negative margin means it overlays the page end instead of adding a strip below the footer.
    <nav
      aria-label="Invitation sections"
      className="pointer-events-none sticky bottom-0 z-40 -mt-[92px] px-3 @3xl:hidden"
      // own compositor layer: the dock stays put while the page scrolls underneath
      style={{ paddingBottom: "max(0.6rem, env(safe-area-inset-bottom))", transform: "translateZ(0)" }}
    >
      {/* soft fade in the page colour behind the dock. (A live backdrop blur here, plus one per tab,
          had to be recomputed every scroll frame and made the dock shimmer and stutter on phones.) */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
        style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--inv-bg) 82%, transparent) 30%, transparent)" }}
        aria-hidden
      />
      <div className="pointer-events-auto relative mx-auto max-w-md">
        <div
          ref={scroller}
          className="no-scrollbar overflow-x-auto overscroll-x-contain"
          style={{ maskImage: "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)" }}
        >
          <ul className="flex w-max gap-2 py-1.5" style={{ paddingInline: "calc(50% - 1.6rem)" }}>
            {tabs.map(({ id, label, Icon, type }) => {
              const on = active === id;
              return (
                <li key={id} ref={(el) => (items.current[id] = el)} className="flex h-[68px] w-[3.2rem] shrink-0 flex-col items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => go(id)}
                    aria-label={label}
                    aria-current={on ? "true" : undefined}
                    className="relative grid h-12 w-12 place-items-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-90"
                  style={{ transform: `scale(${on ? 1 : 0.75})` }}
                >
                  {/* resting: soft paper disc (solid, no per-tab blur) */}
                  <span
                    className="absolute inset-0 rounded-full transition-opacity duration-300"
                    style={{ opacity: on ? 0 : 1, background: "color-mix(in srgb, var(--inv-surface) 94%, transparent)", boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--inv-secondary) 60%, transparent), 0 4px 14px -6px rgba(0,0,0,.25)" }}
                    aria-hidden
                  />
                  {/* active: theme gradient with a glow */}
                  <span
                    className="absolute inset-0 rounded-full transition-opacity duration-300"
                    style={{
                      opacity: on ? 1 : 0,
                      background: "linear-gradient(135deg, var(--inv-primary), color-mix(in srgb, var(--inv-primary) 55%, var(--inv-secondary)))",
                      boxShadow: "0 8px 20px -6px var(--inv-primary)",
                    }}
                    aria-hidden
                  />
                  <Icon
                    className="relative h-5 w-5 transition-colors duration-300"
                    strokeWidth={1.9}
                    style={{ color: on ? "var(--inv-on-primary)" : type === "rsvp" ? "var(--inv-primary)" : "color-mix(in srgb, var(--inv-text) 60%, transparent)" }}
                  />
                </button>
                <span
                  className="w-full truncate text-center text-[10px] font-semibold leading-tight transition-colors duration-300"
                  style={{
                    color: "var(--inv-primary)",
                    opacity: on ? 1 : 0, // only the active tab is labelled, so labels never clutter the page
                    textShadow: "0 0 4px var(--inv-bg), 0 0 8px var(--inv-bg)", // legible over any section without a backing pill
                  }}
                >
                  {label}
                </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

// Template footer: the same compact footer, opening with the template's own section edge
// (torn, wave, cloud, scallop, floral, line) on a tinted band of the theme colour.
function TemplateFooter({ title, date, design, theme }) {
  const dark = design.bands === "alternate";
  const darkPage = luminance(theme.background || "#ffffff") < 0.3;
  const bg = dark ? "var(--inv-band-dark)" : `color-mix(in srgb, var(--inv-bg), var(--inv-primary) ${darkPage ? 20 : 9}%)`;
  return (
    <footer className="relative px-6 pb-32 pt-16 text-center @3xl:py-20" style={{ background: bg, color: dark ? "var(--inv-on-band-dark)" : "var(--inv-primary)" }}>
      <Divider design={design} theme={theme} fill={bg} seed={97} />
      {title && (
        <p className="text-5xl leading-tight @3xl:text-6xl" style={{ fontFamily: "var(--inv-font-heading)" }}>
          {title}
        </p>
      )}
      {date && (
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.4em]" style={{ color: "var(--inv-secondary)" }}>
          {formatDate(date, { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, " · ")}
        </p>
      )}
      <span className="mx-auto mt-6 block h-px w-16" style={{ background: "var(--inv-secondary)" }} />
      <p className="mt-6 text-xs opacity-70">
        Made with{" "}
        <Link href="/" className="font-semibold underline-offset-2 hover:underline">
          InviteOnline
        </Link>
      </p>
    </footer>
  );
}

export function InviteFooter({ title, date }) {
  const { design, theme } = useInvite();
  if (design) return <TemplateFooter title={title} date={date} design={design} theme={theme} />;
  return (
    <footer className="px-6 pb-32 pt-16 text-center @3xl:py-20" style={{ background: "var(--inv-band-dark)", color: "var(--inv-on-band-dark)" }}>
      {title && (
        <p className="text-5xl leading-tight @3xl:text-6xl" style={{ fontFamily: "var(--inv-font-heading)" }}>
          {title}
        </p>
      )}
      {date && (
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.4em]" style={{ color: "var(--inv-secondary)" }}>
          {formatDate(date, { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, " · ")}
        </p>
      )}
      <span className="mx-auto mt-6 block h-px w-16" style={{ background: "var(--inv-secondary)" }} />
      <p className="mt-6 text-xs opacity-70">
        Made with{" "}
        <Link href="/" className="font-semibold underline-offset-2 hover:underline">
          InviteOnline
        </Link>
      </p>
    </footer>
  );
}
