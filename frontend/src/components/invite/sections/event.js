"use client";

import { useEffect, useState } from "react";
import { Card, Img, Reveal, SectionHeading, Shell, ThemeButton } from "../primitives";
import { formatDate, googleCalendarLink, mapEmbedUrl, mapLink, phoneDigits, whatsappLink } from "@/lib/format";

export function EventDetails({ data }) {
  const items = (data.items || []).filter((e) => e.name || e.venue || e.date);
  if (!items.length) return null;
  return (
    <Shell>
      <SectionHeading>{data.heading}</SectionHeading>
      <div className={`grid gap-5 ${items.length > 1 ? "@lg:grid-cols-2" : "mx-auto max-w-md"}`}>
        {items.map((e, i) => {
          const where = [e.venue, e.address].filter(Boolean).join(", ");
          const cal = googleCalendarLink({ title: e.name, date: e.date, location: where });
          return (
            <Reveal key={i} delay={i * 100} className={items.length % 2 === 1 && i === items.length - 1 && items.length > 1 ? "@lg:col-span-2 @lg:mx-auto @lg:w-1/2" : ""}>
              <Card className="h-full text-center">
                <h3 className="text-3xl" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
                  {e.name}
                </h3>
                <div className="mt-4 space-y-2 text-sm">
                  {e.date && <p className="font-semibold">📅 {formatDate(e.date)}</p>}
                  {e.time && <p>🕖 {e.time}</p>}
                  {e.venue && <p className="font-medium">📍 {e.venue}</p>}
                  {e.address && <p className="opacity-75">{e.address}</p>}
                  {e.note && <p className="italic opacity-75">{e.note}</p>}
                </div>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {where && (
                    <ThemeButton href={mapLink(where)} className="!px-4 !py-2 !text-xs">
                      Directions
                    </ThemeButton>
                  )}
                  {cal && (
                    <ThemeButton href={cal} variant="outline" className="!px-4 !py-2 !text-xs">
                      Add to calendar
                    </ThemeButton>
                  )}
                </div>
              </Card>
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
          <p className="text-center text-2xl" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
            The celebration has begun! 🎉
          </p>
        ) : (
          <div className="mx-auto grid max-w-lg grid-cols-4 gap-2 @md:gap-4">
            {["Days", "Hours", "Minutes", "Seconds"].map((k) => (
              <div key={k} className="rounded-2xl py-4 text-center shadow-sm" style={{ background: "var(--inv-primary)", color: "var(--inv-on-primary)" }}>
                <div className="text-2xl font-bold tabular-nums @md:text-4xl">{left ? String(left[k]).padStart(2, "0") : "--"}</div>
                <div className="mt-1 text-[10px] uppercase tracking-widest opacity-80 @md:text-xs">{k}</div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-5 text-center text-sm opacity-75">{formatDate(data.target)}</p>
      </Reveal>
    </Shell>
  );
}

export function Schedule({ data }) {
  const items = (data.items || []).filter((x) => x.title || x.time);
  if (!items.length) return null;
  return (
    <Shell>
      <SectionHeading>{data.heading}</SectionHeading>
      <ol className="relative mx-auto max-w-md">
        <span className="absolute bottom-2 left-[5.5rem] top-2 w-px" style={{ background: "var(--inv-secondary)" }} aria-hidden />
        {items.map((x, i) => (
          <Reveal as="li" key={i} delay={i * 80} className="relative mb-7 grid grid-cols-[5rem_1fr] gap-6 last:mb-0">
            <span className="pt-0.5 text-right text-sm font-semibold" style={{ color: "var(--inv-primary)" }}>
              {x.time}
            </span>
            <span
              className="absolute left-[5.5rem] top-1.5 h-3 w-3 -translate-x-1/2 rounded-full ring-4"
              style={{ background: "var(--inv-primary)", "--tw-ring-color": "var(--inv-bg)" }}
              aria-hidden
            />
            <div>
              <p className="font-semibold">{x.title}</p>
              {x.description && <p className="mt-0.5 text-sm opacity-75">{x.description}</p>}
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
        <Card className="overflow-hidden !p-0">
          {data.image && <Img src={data.image} className="h-56 w-full object-cover @md:h-72" />}
          <div className="p-5 text-center @md:p-7">
            {data.name && (
              <h3 className="text-2xl font-semibold" style={{ color: "var(--inv-primary)" }}>
                {data.name}
              </h3>
            )}
            {data.address && <p className="mt-1 text-sm opacity-80">{data.address}</p>}
          </div>
          {query && (
            <iframe title="Map" src={mapEmbedUrl(query)} className="h-64 w-full border-0 @md:h-80" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          )}
          {query && (
            <div className="p-4 text-center">
              <ThemeButton href={mapLink(query)}>📍 Open in Google Maps</ThemeButton>
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
      <div className="mx-auto grid max-w-lg gap-4">
        {people.map((p, i) => (
          <Reveal key={i} delay={i * 80}>
            <Card className="flex flex-col items-center justify-between gap-3 text-center @sm:flex-row @sm:text-left">
              <div>
                <p className="font-semibold">{p.name}</p>
                {p.phone && <p className="text-sm opacity-75">{p.phone}</p>}
              </div>
              {p.phone && (
                <div className="flex gap-2">
                  <a href={`tel:${phoneDigits(p.phone)}`} className="rounded-full px-4 py-2 text-xs font-semibold" style={{ background: "var(--inv-primary)", color: "var(--inv-on-primary)" }}>
                    📞 Call
                  </a>
                  {p.whatsapp && (
                    <a href={whatsappLink(p.phone)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white">
                      WhatsApp
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
