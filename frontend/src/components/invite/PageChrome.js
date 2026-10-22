"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BookHeart, CalendarDays, Check, Home, Image as ImageIcon, MapPin } from "lucide-react";
import { formatDate } from "@/lib/format";
import { SECTION_META } from "@/data/sections";

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

export function TopNav({ sections, title }) {
  const targets = useTargets(sections).filter((t) => t.key !== "rsvp");
  const rsvp = sections.find((s) => s.type === "rsvp");
  return (
    <header
      className="sticky top-0 z-40 hidden border-b @3xl:block"
      style={{ background: "color-mix(in srgb, var(--inv-bg) 88%, transparent)", borderColor: "color-mix(in srgb, var(--inv-secondary) 45%, transparent)", backdropFilter: "blur(10px)" }}
    >
      <nav className="mx-auto flex max-w-[1120px] items-center justify-between gap-6 px-6 py-4" aria-label="Invitation sections">
        <button onClick={() => go(sections[0]?.id)} className="truncate text-2xl" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
          {title}
        </button>
        <div className="flex flex-wrap items-center gap-7 text-xs font-semibold uppercase tracking-[0.2em]">
          {targets
            .filter((t) => t.key !== "home")
            .map((t) => (
              <button key={t.key} onClick={() => go(t.id)} className="opacity-75 transition hover:opacity-100">
                {t.label}
              </button>
            ))}
        </div>
        {rsvp && (
          <button
            onClick={() => go(rsvp.id)}
            className="shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ boxShadow: "inset 0 0 0 1.5px var(--inv-primary)", color: "var(--inv-primary)" }}
          >
            RSVP
          </button>
        )}
      </nav>
    </header>
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
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id.replace(/^sec-/, ""));
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.5] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(`sec-${id}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
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
  useEffect(() => {
    const box = scroller.current;
    const el = items.current[active];
    if (!box || !el) return;
    box.scrollTo({ left: el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  if (tabs.length < 2) return null;
  return (
    // Floating dock: the negative margin means it overlays the page end instead of adding a strip below the footer.
    <nav
      aria-label="Invitation sections"
      className="pointer-events-none sticky bottom-0 z-40 -mt-[92px] px-3 @3xl:hidden"
      style={{ paddingBottom: "max(0.6rem, env(safe-area-inset-bottom))" }}
    >
      <div
        className="pointer-events-auto mx-auto max-w-md overflow-hidden rounded-[2rem] backdrop-blur-xl"
        style={{
          background: "color-mix(in srgb, var(--inv-surface) 82%, transparent)",
          boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--inv-secondary) 55%, transparent), 0 14px 34px -14px rgba(0,0,0,.45)",
        }}
      >
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
                    className="relative grid h-12 w-12 place-items-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] will-change-transform active:scale-90"
                  style={{ transform: `scale(${on ? 1 : 0.75})` }}
                >
                  {/* resting: frosted glass */}
                  <span
                    className="absolute inset-0 rounded-full backdrop-blur-md transition-opacity duration-300"
                    style={{ opacity: on ? 0 : 1, background: "color-mix(in srgb, var(--inv-surface) 75%, transparent)", boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--inv-secondary) 60%, transparent), 0 4px 14px -6px rgba(0,0,0,.25)" }}
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
                  style={{ color: on ? "var(--inv-primary)" : "color-mix(in srgb, var(--inv-text) 55%, transparent)" }}
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

export function InviteFooter({ title, date }) {
  return (
    <footer className="px-6 pb-32 pt-16 text-center @3xl:py-20" style={{ background: "var(--inv-band-dark)", color: "var(--inv-on-band-dark)" }}>
      <p className="text-5xl leading-tight @3xl:text-6xl" style={{ fontFamily: "var(--inv-font-heading)" }}>
        {title}
      </p>
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
