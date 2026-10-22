"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CalendarPlus, Clock, MapPin, Navigation, Phone, PartyPopper } from "lucide-react";
import { Card, FramedCard, IconBadge, Img, Reveal, SectionHeading, Shell, ThemeButton } from "../primitives";
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

const GRID = {
  1: "mx-auto max-w-md",
  2: "@3xl:grid-cols-2 @5xl:mx-auto @5xl:max-w-4xl",
  3: "@3xl:grid-cols-2 @5xl:grid-cols-3",
  4: "@3xl:grid-cols-2 @5xl:grid-cols-4",
};

export function EventDetails({ data }) {
  const items = (data.items || []).filter((e) => e.name || e.venue || e.date);
  if (!items.length) return null;
  return (
    <Shell>
      <SectionHeading>{data.heading}</SectionHeading>
      <div className={`grid gap-5 ${GRID[Math.min(items.length, 4)]}`}>
        {items.map((e, i) => {
          const where = [e.venue, e.address].filter(Boolean).join(", ");
          const cal = googleCalendarLink({ title: e.name, date: e.date, location: where });
          const lastOdd = items.length === 3 && i === 2; // centre the odd card on the 2-column tablet grid
          return (
            <Reveal key={i} delay={i * 100} className={lastOdd ? "@3xl:col-span-2 @3xl:mx-auto @3xl:w-1/2 @5xl:col-span-1 @5xl:w-full" : ""}>
              <FramedCard className="h-full">
                <h3 className="text-center text-[2.4rem] leading-tight" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
                  {e.name}
                </h3>
                <div className="mt-5 space-y-3">
                  {e.date && <Row Icon={CalendarDays}>{formatDate(e.date)}</Row>}
                  {e.time && <Row Icon={Clock}>{e.time}</Row>}
                  {e.venue && (
                    <Row Icon={MapPin}>
                      <span className="font-semibold">{e.venue}</span>
                      {e.address && <span className="block text-sm opacity-75">{e.address}</span>}
                    </Row>
                  )}
                  {e.note && <p className="pt-1 text-center italic opacity-75">{e.note}</p>}
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {where && (
                    <ThemeButton href={mapLink(where)} className="!px-4 !py-2 !text-xs">
                      <Navigation className="h-3.5 w-3.5" /> Directions
                    </ThemeButton>
                  )}
                  {cal && (
                    <ThemeButton href={cal} variant="outline" className="!px-4 !py-2 !text-xs">
                      <CalendarPlus className="h-3.5 w-3.5" /> Add to calendar
                    </ThemeButton>
                  )}
                </div>
              </FramedCard>
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
          <div className="mx-auto grid max-w-lg grid-cols-4 gap-2.5 @md:gap-4">
            {["Days", "Hours", "Minutes", "Seconds"].map((k) => (
              <div
                key={k}
                className="relative overflow-hidden rounded-2xl py-4 text-center"
                style={{ background: "var(--inv-primary)", color: "var(--inv-on-primary)", boxShadow: "0 14px 30px -16px var(--inv-primary)" }}
              >
                <div className="pointer-events-none absolute inset-1 rounded-xl" style={{ boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--inv-secondary) 60%, transparent)" }} />
                <div className="text-3xl font-semibold tabular-nums @md:text-5xl" style={{ fontFamily: "var(--inv-font-body)" }}>
                  {left ? String(left[k]).padStart(2, "0") : "--"}
                </div>
                <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] opacity-80 @md:text-[11px]">{k}</div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-5 text-center italic opacity-75">{formatDate(data.target)}</p>
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
        <span className="absolute bottom-2 left-[5.5rem] top-2 w-px" style={{ background: "var(--inv-secondary)" }} aria-hidden />
        {items.map((x, i) => (
          <Reveal as="li" key={i} delay={i * 80} className="relative mb-8 grid grid-cols-[5rem_1fr] gap-6 last:mb-0">
            <span className="pt-0.5 text-right text-sm font-bold tracking-wide" style={{ color: "var(--inv-primary)" }}>
              {x.time}
            </span>
            <span
              className="absolute left-[5.5rem] top-1 h-3.5 w-3.5 -translate-x-1/2 rotate-45"
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
