"use client";

import { ChevronDown } from "lucide-react";
import { Card, FramedCard, Img, Ornament, Placeholder, Reveal, SectionHeading, Shell } from "../primitives";
import { useInvite } from "../InviteContext";
import { formatDate, videoEmbed } from "@/lib/format";

function HeroDate({ date, light }) {
  if (!date) return null;
  return (
    <div className="animate-float-up mt-7 flex flex-col items-center" style={{ animationDelay: "360ms" }}>
      <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.35em] opacity-80 @md:text-xs">
        <span>{formatDate(date, { weekday: "long" })}</span>
      </div>
      <div className="mt-2 flex items-center gap-4" style={{ color: light ? "#fff" : "var(--inv-primary)" }}>
        <span className="h-px w-10 @md:w-16" style={{ background: "currentColor", opacity: 0.5 }} />
        <span className="text-2xl font-semibold tracking-[0.12em] @md:text-3xl" style={{ fontFamily: "var(--inv-font-body)" }}>
          {formatDate(date, { day: "numeric", month: "long", year: "numeric" })}
        </span>
        <span className="h-px w-10 @md:w-16" style={{ background: "currentColor", opacity: 0.5 }} />
      </div>
    </div>
  );
}

function Title({ data, light }) {
  return (
    <h1
      className={`animate-float-up break-words text-[3.1rem] leading-[1.08] @sm:text-[4rem] @lg:text-[4.8rem] @5xl:text-[6.5rem] ${data.foil && !light ? "foil-text" : ""}`}
      style={{ fontFamily: "var(--inv-font-heading)", color: light ? "#fff" : data.foil ? undefined : "var(--inv-primary)", animationDelay: "120ms" }}
    >
      {data.title}
    </h1>
  );
}

export function Hero({ data }) {
  const { mode } = useInvite();
  const minH = mode === "public" ? "min-h-[100svh]" : "min-h-[640px]";
  const layout = data.layout === "portrait" ? "circle" : data.layout === "center" ? "full" : data.layout || "arch";
  const full = layout === "full" && data.image;

  return (
    <div className={`relative flex ${minH} flex-col items-center justify-center overflow-hidden px-6 py-16 text-center`}>
      {full && (
        <>
          <Img src={data.image} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/35 to-black/65" />
        </>
      )}
      {layout === "classic" && (
        <div className="pointer-events-none absolute inset-4 rounded-[2rem] @md:inset-8" style={{ boxShadow: "inset 0 0 0 1px var(--inv-secondary), inset 0 0 0 6px transparent, inset 0 0 0 7px color-mix(in srgb, var(--inv-secondary) 60%, transparent)" }} />
      )}

      <div className={`relative z-[1] flex w-full max-w-xl flex-col items-center ${full ? "text-white" : ""}`}>
        {data.tagline && (
          <p className="animate-float-up mb-5 max-w-sm text-[0.95rem] italic opacity-85 @md:text-lg" style={{ fontFamily: "var(--inv-font-body)" }}>
            {data.tagline}
          </p>
        )}

        {layout === "arch" && (
          <div className="animate-float-up relative mb-8 w-[68%] max-w-[300px] @5xl:max-w-[340px]">
            <div className="absolute -inset-2.5 rounded-t-full" style={{ boxShadow: "inset 0 0 0 1px var(--inv-secondary)" }} />
            <div className="overflow-hidden rounded-t-full p-1.5" style={{ background: "linear-gradient(160deg, var(--inv-secondary), color-mix(in srgb, var(--inv-secondary) 40%, white), var(--inv-secondary))" }}>
              {data.image ? (
                <Img src={data.image} className="aspect-[3/4] w-full rounded-t-full object-cover" />
              ) : (
                <Placeholder className="aspect-[3/4] w-full rounded-t-full" label="Add a couple photo" />
              )}
            </div>
          </div>
        )}
        {layout === "circle" && (
          <div className="animate-float-up mb-8 rounded-full p-1.5" style={{ background: "linear-gradient(135deg, var(--inv-primary), var(--inv-secondary))" }}>
            {data.image ? (
              <Img src={data.image} className="h-48 w-48 rounded-full border-4 border-white object-cover @md:h-60 @md:w-60" />
            ) : (
              <Placeholder className="h-48 w-48 rounded-full border-4 border-white @md:h-60 @md:w-60" />
            )}
          </div>
        )}
        {layout === "classic" && <Ornament className="mb-6 w-48" />}

        <Title data={data} light={full} />
        {data.subtitle && (
          <p className="animate-float-up mt-4 max-w-md text-lg @md:text-xl" style={{ animationDelay: "240ms", fontFamily: "var(--inv-font-body)" }}>
            {data.subtitle}
          </p>
        )}
        <HeroDate date={data.date} light={full} />
        {layout === "classic" && <Ornament className="mt-7 w-48 rotate-180" />}
      </div>

      <ChevronDown className="absolute bottom-6 left-1/2 z-[1] h-6 w-6 -translate-x-1/2 animate-bounce opacity-60" aria-hidden />
    </div>
  );
}

export function Quote({ data }) {
  if (!data.text && !data.arabic) return null;
  return (
    <Shell className="!py-12">
      <Reveal className="mx-auto max-w-lg text-center">
        <Ornament className="mx-auto mb-6 w-28" />
        {data.arabic && (
          <p className="text-3xl leading-loose @md:text-4xl" dir="rtl" style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif", color: "var(--inv-primary)" }}>
            {data.arabic}
          </p>
        )}
        {data.text && <p className="mt-3 text-xl italic leading-relaxed @md:text-2xl">&ldquo;{data.text}&rdquo;</p>}
        {data.source && <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] opacity-60">{data.source}</p>}
      </Reveal>
    </Shell>
  );
}

export function Hosts({ data }) {
  const people = (data.people || []).filter((p) => p.name || p.photo);
  if (!people.length) return null;
  const pair = people.length === 2;
  return (
    <Shell>
      <SectionHeading>{data.heading}</SectionHeading>
      <div className={`mx-auto grid max-w-4xl items-center gap-10 ${pair ? "@md:grid-cols-[1fr_auto_1fr]" : "@md:grid-cols-2"}`}>
        {people.map((p, i) => (
          <PersonBlock key={i} p={p} i={i} pair={pair} />
        ))}
      </div>
    </Shell>
  );
}

function PersonBlock({ p, i, pair }) {
  const block = (
    <Reveal className="flex flex-col items-center text-center" delay={i * 120}>
      <div className="relative">
        <div className="absolute -inset-3 rounded-t-full" style={{ boxShadow: "inset 0 0 0 1px var(--inv-secondary)" }} />
        {p.photo ? (
          <Img src={p.photo} alt={p.name} className="h-56 w-44 rounded-t-full object-cover shadow-lg @md:h-64 @md:w-52 @5xl:h-80 @5xl:w-64" />
        ) : (
          <Placeholder className="h-56 w-44 rounded-t-full @md:h-64 @md:w-52 @5xl:h-80 @5xl:w-64" />
        )}
      </div>
      {p.role && <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em] opacity-60">{p.role}</p>}
      <h3 className="mt-1 text-[2.6rem] leading-tight" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
        {p.name}
      </h3>
      {p.bio && <p className="mt-1 max-w-xs italic opacity-80">{p.bio}</p>}
    </Reveal>
  );
  if (pair && i === 0)
    return (
      <>
        {block}
        <div className="text-center text-6xl" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-secondary)" }}>
          &amp;
        </div>
      </>
    );
  return block;
}

export function Families({ data }) {
  const groups = (data.groups || []).filter((g) => g.title || g.names);
  if (!groups.length) return null;
  return (
    <Shell>
      <SectionHeading>{data.heading}</SectionHeading>
      <div className={`mx-auto grid max-w-2xl gap-5 ${groups.length > 1 ? "@md:grid-cols-2" : ""}`}>
        {groups.map((g, i) => (
          <Reveal key={i} delay={i * 100}>
            <FramedCard className="h-full text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] opacity-60">{g.title}</p>
              <p className="mt-3 whitespace-pre-line text-lg leading-relaxed">{g.names}</p>
            </FramedCard>
          </Reveal>
        ))}
      </div>
    </Shell>
  );
}

export function Story({ data }) {
  if (!data.text && !data.image) return null;
  return (
    <Shell>
      <SectionHeading>{data.heading}</SectionHeading>
      <Reveal className="grid items-center gap-8 @lg:grid-cols-2">
        {data.image && <Img src={data.image} className="aspect-[4/5] w-full rounded-t-full object-cover shadow-lg" />}
        <p className={`whitespace-pre-line text-lg leading-relaxed opacity-90 ${data.image ? "" : "mx-auto max-w-xl text-center @lg:col-span-2"}`}>{data.text}</p>
      </Reveal>
    </Shell>
  );
}

export function Note({ data }) {
  if (!data.text && !data.heading) return null;
  return (
    <Shell>
      <Reveal className="mx-auto max-w-xl text-center">
        {data.heading && <SectionHeading>{data.heading}</SectionHeading>}
        <p className="whitespace-pre-line text-lg leading-relaxed opacity-90">{data.text}</p>
      </Reveal>
    </Shell>
  );
}

export function Closing({ data }) {
  if (!data.text && !data.signature) return null;
  return (
    <Shell className="!pb-6">
      <Reveal className="mx-auto max-w-lg text-center">
        <Ornament className="mx-auto mb-6 w-40" />
        {data.text && <p className="whitespace-pre-line text-xl italic leading-relaxed">{data.text}</p>}
        {data.signature && (
          <p className="mt-6 text-5xl leading-tight" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
            {data.signature}
          </p>
        )}
      </Reveal>
    </Shell>
  );
}

export function DressCode({ data }) {
  return (
    <Shell>
      <SectionHeading sub={data.text}>{data.heading}</SectionHeading>
      {data.colors?.length > 0 && (
        <Reveal className="flex flex-wrap justify-center gap-4">
          {data.colors.map((c, i) => (
            <span key={i} className="h-14 w-14 rounded-full border-4 border-white shadow-md" style={{ background: c }} title={c} />
          ))}
        </Reveal>
      )}
    </Shell>
  );
}

export function Video({ data }) {
  const embed = videoEmbed(data.url);
  if (!embed) return null;
  return (
    <Shell>
      <SectionHeading>{data.heading}</SectionHeading>
      <Reveal>
        <Card className="overflow-hidden !p-0">
          {embed.type === "iframe" ? (
            <iframe
              src={embed.src}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={data.heading || "Video"}
              loading="lazy"
            />
          ) : (
            <video src={embed.src} controls playsInline className="aspect-video w-full bg-black" />
          )}
        </Card>
      </Reveal>
    </Shell>
  );
}
