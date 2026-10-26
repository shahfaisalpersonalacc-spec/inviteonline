"use client";

import { Fragment, useEffect, useState } from "react";
import { CalendarDays, CalendarPlus, Clock, MapPin, Navigation, Phone, PartyPopper } from "lucide-react";
import { Card, IconBadge, Img, Reveal, SectionHeading, Shell, ThemeButton } from "../primitives";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { formatDate, googleCalendarLink, mapEmbedUrl, mapLink, phoneDigits, whatsappLink } from "@/lib/format";

function Row({ Icon, children, muted }) {
  return (
    <p className={`flex items-start gap-3 text-left ${muted ? "opacity-75" : ""}`}>
      <IconBadge Icon={Icon} />
      <span className="pt-1">{children}</span>
    </p>
  );
}

// Weekday | big day | month and year, like a page of a desk calendar.
function DateBlock({ date, size = "md" }) {
  if (!date) return null;
  const big = size === "lg" ? "text-[3.6rem] @sm:text-[4.5rem] @3xl:text-[5.5rem]" : "text-[3.2rem]";
  return (
    <div className="relative mt-5 flex items-center justify-center gap-2.5 @sm:gap-4">
      <span className="text-right text-[10px] font-semibold uppercase tracking-[0.16em] opacity-75 @sm:text-[11px] @sm:tracking-[0.26em]">{formatDate(date, { weekday: "long" })}</span>
      <span className={`px-3 leading-none tabular-nums @sm:px-4 ${big}`} style={{ color: "var(--inv-primary)", boxShadow: "inset 1px 0 0 var(--inv-secondary), inset -1px 0 0 var(--inv-secondary)" }}>
        {formatDate(date, { day: "numeric" })}
      </span>
      <span className="text-left text-[10px] font-semibold uppercase tracking-[0.16em] opacity-75 @sm:text-[11px] @sm:tracking-[0.26em]">
        {formatDate(date, { month: "long" })}
        <br />
        {formatDate(date, { year: "numeric" })}
      </span>
    </div>
  );
}

const PANEL = { background: "linear-gradient(150deg, color-mix(in srgb, var(--inv-primary) 16%, transparent), color-mix(in srgb, var(--inv-secondary) 22%, transparent))" };

// One event of several, as a ticket: name and date on a tinted stub, a perforated tear line with
// notches, then time, venue and the two actions pinned to the bottom so cards in a row line up.
function EventTicket({ e }) {
  const where = [e.venue, e.address].filter(Boolean).join(", ");
  const cal = googleCalendarLink({ title: e.name, date: e.date, location: where });
  return (
    <Card className="flex h-full flex-col !p-0">
      <div className="relative overflow-hidden rounded-t-[1.75rem] px-6 pb-8 pt-8 text-center" style={PANEL}>
        {/* a closed inner frame with the same inset on every side, ending above the tear line */}
        <div className="pointer-events-none absolute inset-3 rounded-[1.25rem]" style={{ boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--inv-secondary) 80%, transparent)" }} />
        <h3 className="relative break-words text-[2.3rem] leading-tight" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
          {e.name}
        </h3>
        <DateBlock date={e.date} />
      </div>
      {/* perforation */}
      <div className="relative h-0" aria-hidden>
        <span className="absolute inset-x-5 top-0 border-t-2 border-dashed" style={{ borderColor: "color-mix(in srgb, var(--inv-secondary) 70%, transparent)" }} />
        <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full" style={{ background: "var(--inv-section-bg, var(--inv-bg))", boxShadow: "inset -1px 0 0 color-mix(in srgb, var(--inv-secondary) 55%, transparent)" }} />
        <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full" style={{ background: "var(--inv-section-bg, var(--inv-bg))", boxShadow: "inset 1px 0 0 color-mix(in srgb, var(--inv-secondary) 55%, transparent)" }} />
      </div>
      <div className="flex flex-1 flex-col gap-3.5 px-6 pb-6 pt-6">
        {e.time && <Row Icon={Clock}>{e.time}</Row>}
        {e.venue && (
          <Row Icon={MapPin}>
            <span className="font-semibold">{e.venue}</span>
            {e.address && <span className="block text-sm opacity-75">{e.address}</span>}
          </Row>
        )}
        {e.note && <p className="italic opacity-75">{e.note}</p>}
        {(where || cal) && (
          <div className={`mt-auto grid gap-2 pt-3 ${where && cal ? "grid-cols-2" : "grid-cols-1"}`}>
            {where && (
              <ThemeButton href={mapLink(where)} className="!px-2 !py-2.5 !text-xs">
                <Navigation className="h-3.5 w-3.5 shrink-0" /> Directions
              </ThemeButton>
            )}
            {cal && (
              <ThemeButton href={cal} variant="outline" className="!px-2 !py-2.5 !text-xs">
                <CalendarPlus className="h-3.5 w-3.5 shrink-0" /> Calendar
              </ThemeButton>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

const GRID = {
  1: "mx-auto max-w-md",
  2: "@3xl:grid-cols-2 @5xl:mx-auto @5xl:max-w-4xl",
  3: "@3xl:grid-cols-2 @5xl:grid-cols-3",
  4: "@3xl:grid-cols-2 @5xl:grid-cols-4",
};

// A single event gets a wide two-part card: a tinted panel with the name and a large
// calendar-style date, and the details beside it (stacked on phones).
function SingleEvent({ e }) {
  const where = [e.venue, e.address].filter(Boolean).join(", ");
  const cal = googleCalendarLink({ title: e.name, date: e.date, location: where });
  return (
    <Reveal className="mx-auto max-w-4xl">
      <Card className="!p-0 overflow-hidden">
        <div className="grid @3xl:grid-cols-[0.95fr_1.05fr]">
          <div
            className="relative flex flex-col items-center justify-center px-6 py-10 text-center @3xl:py-14"
            style={{ background: "linear-gradient(150deg, color-mix(in srgb, var(--inv-primary) 16%, transparent), color-mix(in srgb, var(--inv-secondary) 22%, transparent))" }}
          >
            <div className="pointer-events-none absolute inset-2.5 rounded-[1.35rem] @3xl:rounded-r-none" style={{ boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--inv-secondary) 80%, transparent)" }} />
            <h3 className="relative break-words text-[2.4rem] leading-tight @3xl:text-[3rem]" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
              {e.name}
            </h3>
            {e.date && (
              <div className="relative mt-6 flex items-center gap-2.5 @sm:gap-5">
                <span className="text-right text-[10px] font-semibold uppercase tracking-[0.16em] opacity-75 @sm:text-[11px] @sm:tracking-[0.3em]">{formatDate(e.date, { weekday: "long" })}</span>
                <span className="px-3 text-[3.6rem] leading-none tabular-nums @sm:px-5 @sm:text-[4.5rem] @3xl:text-[5.5rem]" style={{ color: "var(--inv-primary)", boxShadow: "inset 1px 0 0 var(--inv-secondary), inset -1px 0 0 var(--inv-secondary)" }}>
                  {formatDate(e.date, { day: "numeric" })}
                </span>
                <span className="text-left text-[10px] font-semibold uppercase tracking-[0.16em] opacity-75 @sm:text-[11px] @sm:tracking-[0.3em]">
                  {formatDate(e.date, { month: "long" })}
                  <br />
                  {formatDate(e.date, { year: "numeric" })}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center gap-4 px-6 py-8 @3xl:px-10 @3xl:py-12">
            {e.date && <Row Icon={CalendarDays}>{formatDate(e.date)}</Row>}
            {e.time && <Row Icon={Clock}>{e.time}</Row>}
            {e.venue && (
              <Row Icon={MapPin}>
                <span className="font-semibold">{e.venue}</span>
                {e.address && <span className="block text-sm opacity-75">{e.address}</span>}
              </Row>
            )}
            {e.note && <p className="italic opacity-75">{e.note}</p>}
            <div className="mt-2 flex flex-wrap justify-center gap-2 @3xl:justify-start">
              {where && (
                <ThemeButton href={mapLink(where)} className="!px-5 !py-2.5 !text-xs">
                  <Navigation className="h-3.5 w-3.5" /> Directions
                </ThemeButton>
              )}
              {cal && (
                <ThemeButton href={cal} variant="outline" className="!px-5 !py-2.5 !text-xs">
                  <CalendarPlus className="h-3.5 w-3.5" /> Add to calendar
                </ThemeButton>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Reveal>
  );
}

export function EventDetails({ data }) {
  const items = (data.items || []).filter((e) => e.name || e.venue || e.date);
  if (!items.length) return null;
  if (items.length === 1)
    return (
      <Shell>
        <SectionHeading>{data.heading}</SectionHeading>
        <SingleEvent e={items[0]} />
      </Shell>
    );
  return (
    <Shell>
      <SectionHeading>{data.heading}</SectionHeading>
      <div className={`grid gap-5 ${GRID[Math.min(items.length, 4)]}`}>
        {items.map((e, i) => {
          const lastOdd = items.length === 3 && i === 2; // centre the odd card on the 2-column tablet grid
          return (
            <Reveal key={i} delay={i * 100} className={lastOdd ? "@3xl:col-span-2 @3xl:mx-auto @3xl:w-1/2 @5xl:col-span-1 @5xl:w-full" : ""}>
              <EventTicket e={e} />
            </Reveal>
          );
        })}
      </div>
    </Shell>
  );
}

function diff(target) {
  const ms = new Date(target).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  if (ms <= 0) return { done: true };
  return {
    Days: Math.floor(ms / 86400000),
    Hours: Math.floor((ms / 3600000) % 24),
    Minutes: Math.floor((ms / 60000) % 60),
    Seconds: Math.floor((ms / 1000) % 60),
  };
}

export function Countdown({ data }) {
  // Computed only after mount so server and client markup match.
  const [left, setLeft] = useState(null);
  useEffect(() => {
    if (!data.target) return;
    const tick = () => setLeft(diff(data.target));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [data.target]);

  if (!data.target) return null;
  return (
    <Shell>
      <SectionHeading>{data.heading}</SectionHeading>
      <Reveal>
        {left?.done ? (
          <p className="flex items-center justify-center gap-3 text-3xl" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
            <PartyPopper className="h-7 w-7" strokeWidth={1.5} /> The celebration has begun!
          </p>
        ) : (
          <div className="mx-auto flex max-w-lg items-center justify-center gap-2.5 @md:gap-4 @3xl:max-w-3xl @3xl:gap-3">
            {["Days", "Hours", "Minutes", "Seconds"].map((k, i) => (
              <Fragment key={k}>
              {i > 0 && (
                <span className="hidden text-5xl opacity-50 @3xl:block" style={{ color: "var(--inv-primary)", fontFamily: "var(--inv-font-body)" }} aria-hidden>
                  :
                </span>
              )}
              <div
                className="relative flex-1 overflow-hidden rounded-2xl py-4 text-center @3xl:rounded-[1.6rem] @3xl:py-8"
                style={{ background: "var(--inv-primary)", color: "var(--inv-on-primary)", boxShadow: "0 14px 30px -16px var(--inv-primary)" }}
              >
                <div className="pointer-events-none absolute inset-1 rounded-xl" style={{ boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--inv-secondary) 60%, transparent)" }} />
                <div className="text-3xl font-semibold tabular-nums @md:text-5xl @3xl:text-7xl" style={{ fontFamily: "var(--inv-font-body)" }}>
                  {left ? String(left[k]).padStart(2, "0") : "--"}
                </div>
                <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] opacity-80 @md:text-[11px] @3xl:mt-2 @3xl:text-xs">{k}</div>
              </div>
              </Fragment>
            ))}
          </div>
        )}
        <p className="mt-5 text-center italic opacity-75 @3xl:mt-8 @3xl:text-lg">{formatDate(data.target)}</p>
        {!left?.done && googleCalendarLink({ title: data.heading || "Celebration", date: data.target }) && (
          <div className="mt-5 flex justify-center">
            <ThemeButton href={googleCalendarLink({ title: data.heading || "Celebration", date: data.target })} variant="outline" className="!px-5 !py-2.5 !text-xs">
              <CalendarPlus className="h-3.5 w-3.5" /> Add to calendar
            </ThemeButton>
          </div>
        )}
      </Reveal>
    </Shell>
  );
}

export function Schedule({ data }) {
  const items = (data.items || []).filter((x) => x.title || x.time);
  if (!items.length) return null;
  return (
    <Shell className="@5xl:grid @5xl:grid-cols-[1fr_1.25fr] @5xl:items-start @5xl:gap-16">
      <SectionHeading align="split" sub={data.text}>{data.heading}</SectionHeading>
      <ol className="relative mx-auto max-w-md @5xl:mx-0 @5xl:max-w-none">
        <span className="absolute bottom-2 left-[5.25rem] top-2 w-px" style={{ background: "var(--inv-secondary)" }} aria-hidden />
        {items.map((x, i) => (
          <Reveal as="li" key={i} delay={i * 80} className="relative mb-8 grid grid-cols-[4.25rem_1fr] gap-8 last:mb-0">
            <span className="whitespace-nowrap pt-0.5 text-right text-[13px] font-bold" style={{ color: "var(--inv-primary)" }}>
              {x.time}
            </span>
            <span
              className="absolute left-[5.25rem] top-1 h-3.5 w-3.5 -translate-x-1/2 rotate-45"
              style={{ background: "var(--inv-primary)", boxShadow: "0 0 0 4px var(--inv-bg)" }}
              aria-hidden
            />
            <div>
              <p className="text-lg font-semibold">{x.title}</p>
              {x.description && <p className="mt-0.5 italic opacity-75">{x.description}</p>}
            </div>
          </Reveal>
        ))}
      </ol>
    </Shell>
  );
}

export function Venue({ data }) {
  const query = data.mapQuery || [data.name, data.address].filter(Boolean).join(", ");
  if (!query && !data.image) return null;
  return (
    <Shell>
      <SectionHeading>{data.heading}</SectionHeading>
      <Reveal>
        <Card className="overflow-hidden !p-0 @5xl:grid @5xl:grid-cols-2">
          <div className="flex flex-col">
            {data.image && <Img src={data.image} className="h-56 w-full object-cover @md:h-72" />}
            <div className="p-6 text-center @md:p-8 @5xl:flex @5xl:flex-1 @5xl:flex-col @5xl:justify-center @5xl:p-12 @5xl:text-left">
              {data.name && (
                <h3 className="text-[2.2rem] leading-tight @5xl:text-[2.8rem]" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
                  {data.name}
                </h3>
              )}
              {data.address && (
                <p className="mt-2 flex items-center justify-center gap-2 opacity-80 @5xl:justify-start">
                  <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.7} /> {data.address}
                </p>
              )}
              {query && (
                <div className="mt-6 hidden @5xl:block">
                  <ThemeButton href={mapLink(query)}>
                    <Navigation className="h-4 w-4" /> Open in Google Maps
                  </ThemeButton>
                </div>
              )}
            </div>
          </div>
          {query && <iframe title="Map" src={mapEmbedUrl(query)} className="h-64 w-full border-0 @md:h-80 @5xl:h-full @5xl:min-h-[420px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
          {query && (
            <div className="p-5 text-center @5xl:hidden">
              <ThemeButton href={mapLink(query)}>
                <Navigation className="h-4 w-4" /> Open in Google Maps
              </ThemeButton>
            </div>
          )}
        </Card>
      </Reveal>
    </Shell>
  );
}

export function Contact({ data }) {
  const people = (data.people || []).filter((p) => p.name || p.phone);
  if (!people.length) return null;
  return (
    <Shell>
      <SectionHeading>{data.heading}</SectionHeading>
      <div className={`mx-auto grid gap-4 ${people.length > 1 ? "max-w-lg @3xl:max-w-3xl @3xl:grid-cols-2" : "max-w-lg"}`}>
        {people.map((p, i) => (
          <Reveal key={i} delay={i * 80}>
            <Card className="flex flex-col items-center justify-between gap-3 text-center @sm:flex-row @sm:text-left">
              <div>
                <p className="text-lg font-semibold">{p.name}</p>
                {p.phone && <p className="opacity-75">{p.phone}</p>}
              </div>
              {p.phone && (
                <div className="flex gap-2">
                  <ThemeButton href={`tel:${phoneDigits(p.phone)}`} className="!px-4 !py-2 !text-xs" target="_self">
                    <Phone className="h-3.5 w-3.5" /> Call
                  </ThemeButton>
                  {p.whatsapp && (
                    <a href={whatsappLink(p.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white">
                      <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                  )}
                </div>
              )}
            </Card>
          </Reveal>
        ))}
      </div>
    </Shell>
  );
}
