"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BookHeart, CalendarDays, Check, Home, Image as ImageIcon, MapPin } from "lucide-react";
import { formatDate } from "@/lib/format";
import { SECTION_META } from "@/data/sections";
import { useInvite } from "./InviteContext";

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

const go = (id) => document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

// Desktop header: a floating glass capsule over the page with a tapered blur behind it
// (strongest at the very top, fading to nothing), so there is never a hard bar edge.
export function TopNav({ sections, title }) {
  const { theme } = useInvite();
  const targets = useTargets(sections).filter((t) => t.key !== "rsvp" && t.key !== "home");
  const rsvp = sections.find((s) => s.type === "rsvp");
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);
  const active = useActiveSection(ids);
  // a link is current from its own section until the next linked section begins
  const order = (id) => ids.indexOf(id);
  const current = targets.filter((t) => order(t.id) <= order(active)).pop()?.key;
  const monogram = theme?.monogram || initials(title);

  return (
    // zero-height sticky wrapper: the header floats over the cover instead of pushing it down
    <div className="sticky top-0 z-40 hidden h-0 @3xl:block">
      {/* tapered blur + soft tint */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          background: "linear-gradient(to bottom, color-mix(in srgb, var(--inv-bg) 55%, transparent), transparent)",
          maskImage: "linear-gradient(to bottom, #000 35%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 35%, transparent)",
        }}
        aria-hidden
      />
      <header className="relative px-6 pt-4">
        <nav
          className="mx-auto flex max-w-[1040px] items-center gap-6 rounded-full py-2 pl-2 pr-2"
          style={{
            background: "color-mix(in srgb, var(--inv-bg) 58%, transparent)",
            backdropFilter: "blur(22px) saturate(1.3)",
            WebkitBackdropFilter: "blur(22px) saturate(1.3)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,.22), 0 0 0 1px color-mix(in srgb, var(--inv-secondary) 45%, transparent), 0 18px 40px -22px rgba(0,0,0,.45)",
          }}
          aria-label="Invitation sections"
        >
          <button onClick={() => go(sections[0]?.id)} className="flex min-w-0 items-center gap-3 rounded-full pr-2" aria-label={`${title} — back to top`}>
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[0.95rem]"
              style={{
                background: "linear-gradient(140deg, var(--inv-primary), color-mix(in srgb, var(--inv-primary) 60%, var(--inv-secondary)))",
                color: "var(--inv-on-primary)",
                fontFamily: "var(--inv-font-heading)",
                boxShadow: "inset 0 0 0 2px color-mix(in srgb, var(--inv-on-primary) 25%, transparent)",
              }}
              aria-hidden
            >
              {monogram}
            </span>
            {/* truncate clips; padding keeps script swashes (e.g. a Great Vibes "I") inside the clip box */}
            <span className="-my-2 truncate px-1.5 py-2 text-[1.6rem] leading-[1.15]" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
              {title}
            </span>
          </button>

          <div className="ml-auto flex items-center gap-1">
            {targets.map((t) => {
              const on = current === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => go(t.id)}
                  aria-current={on ? "true" : undefined}
                  className="group relative rounded-full px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.18em] transition-opacity"
                  style={{ opacity: on ? 1 : 0.72 }}
                >
                  {t.label}
                  {/* hairline that grows from the centre on hover and stays under the current section */}
                  <span
                    className={`absolute bottom-1 left-1/2 h-px -translate-x-1/2 transition-all duration-300 ${on ? "w-6" : "w-0 group-hover:w-6"}`}
                    style={{ background: "var(--inv-primary)" }}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>

          {rsvp && (
            <button
              onClick={() => go(rsvp.id)}
              className="shrink-0 rounded-full px-6 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.22em] transition hover:brightness-110"
              style={{
                background: "linear-gradient(140deg, var(--inv-primary), color-mix(in srgb, var(--inv-primary) 65%, var(--inv-secondary)))",
                color: "var(--inv-on-primary)",
                boxShadow: "0 8px 22px -10px var(--inv-primary)",
              }}
            >
              RSVP
            </button>
          )}
        </nav>
      </header>
    </div>
  );
}

const initials = (title = "") =>
  title
    .split(/\s*(?:&|and|weds|\+)\s*|\s+/i)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("&") || "♥";

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

// light: a soft tinted footer for light-banded templates (a dark block looks heavy under them)
export function InviteFooter({ title, date, light = false }) {
  return (
    <footer
      className="px-6 pb-32 pt-16 text-center @3xl:py-20"
      style={
        light
          ? { background: "color-mix(in srgb, var(--inv-surface), var(--inv-primary) 7%)", color: "var(--inv-primary)", boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--inv-secondary) 50%, transparent)" }
          : { background: "var(--inv-band-dark)", color: "var(--inv-on-band-dark)" }
      }
    >
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
