"use client";

import { Card, Img, Placeholder, Reveal, SectionHeading, Shell } from "../primitives";
import { useInvite } from "../InviteContext";
import { formatDate, videoEmbed } from "@/lib/format";

export function Hero({ data }) {
  const { mode } = useInvite();
  const minH = mode === "public" ? "min-h-[100svh]" : "min-h-[620px]";
  const hasBg = data.image && data.layout !== "portrait";

  return (
    <div className={`relative flex ${minH} flex-col items-center justify-center overflow-hidden px-6 py-20 text-center`}>
      {hasBg && (
        <>
          <Img src={data.image} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
        </>
      )}
      <div className={`relative z-[1] flex max-w-xl flex-col items-center ${hasBg ? "text-white" : ""}`}>
        {data.tagline && <p className="animate-float-up mb-6 text-xs uppercase tracking-[0.25em] opacity-80 @md:text-sm">{data.tagline}</p>}
        {data.layout === "portrait" && (
          <div className="animate-float-up mb-8 rounded-full p-1.5" style={{ background: "linear-gradient(135deg, var(--inv-primary), var(--inv-secondary))" }}>
            {data.image ? (
              <Img src={data.image} className="h-44 w-44 rounded-full object-cover @md:h-56 @md:w-56" />
            ) : (
              <Placeholder className="h-44 w-44 rounded-full bg-white @md:h-56 @md:w-56" />
            )}
          </div>
        )}
        <h1
          className="animate-float-up text-[2.9rem] leading-[1.1] break-words @sm:text-6xl @lg:text-7xl"
          style={{ fontFamily: "var(--inv-font-heading)", color: hasBg ? "#fff" : "var(--inv-primary)", animationDelay: "120ms" }}
        >
          {data.title}
        </h1>
        {data.subtitle && (
          <p className="animate-float-up mt-4 text-lg font-light @md:text-2xl" style={{ animationDelay: "240ms" }}>
            {data.subtitle}
          </p>
        )}
        {data.date && (
          <div className="animate-float-up mt-8 flex items-center gap-3 text-sm font-semibold uppercase tracking-widest @md:text-base" style={{ animationDelay: "360ms" }}>
            <span className="h-px w-8" style={{ background: hasBg ? "#fff" : "var(--inv-secondary)" }} />
            {formatDate(data.date, { day: "numeric", month: "long", year: "numeric" })}
            <span className="h-px w-8" style={{ background: hasBg ? "#fff" : "var(--inv-secondary)" }} />
          </div>
        )}
      </div>
      <div className="absolute bottom-6 left-1/2 z-[1] -translate-x-1/2 animate-bounce text-xl opacity-70" aria-hidden>
        ⌄
      </div>
    </div>
  );
}

export function Hosts({ data }) {
  const people = (data.people || []).filter((p) => p.name || p.photo);
  if (!people.length) return null;
  const pair = people.length === 2;
  return (
    <Shell>
      <SectionHeading>{data.heading}</SectionHeading>
      <div className={`grid items-center gap-10 ${pair ? "@md:grid-cols-[1fr_auto_1fr]" : "@md:grid-cols-2"}`}>
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
      <div className="rounded-full p-1.5" style={{ background: "linear-gradient(135deg, var(--inv-primary), var(--inv-secondary))" }}>
        {p.photo ? (
          <Img src={p.photo} alt={p.name} className="h-40 w-40 rounded-full border-4 border-white object-cover @md:h-48 @md:w-48" />
        ) : (
          <Placeholder className="h-40 w-40 rounded-full border-4 border-white @md:h-48 @md:w-48" />
        )}
      </div>
      <h3 className="mt-5 text-4xl" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
        {p.name}
      </h3>
      {p.role && <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] opacity-70">{p.role}</p>}
      {p.bio && <p className="mt-3 max-w-xs text-sm opacity-80">{p.bio}</p>}
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

export function Story({ data }) {
  if (!data.text && !data.image) return null;
  return (
    <Shell>
      <SectionHeading>{data.heading}</SectionHeading>
      <Reveal className="grid items-center gap-8 @lg:grid-cols-2">
        {data.image && <Img src={data.image} className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-lg" />}
        <p className={`whitespace-pre-line text-base leading-relaxed opacity-90 @md:text-lg ${data.image ? "" : "mx-auto max-w-xl text-center @lg:col-span-2"}`}>{data.text}</p>
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
        <p className="whitespace-pre-line text-base leading-relaxed opacity-90 @md:text-lg">{data.text}</p>
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
