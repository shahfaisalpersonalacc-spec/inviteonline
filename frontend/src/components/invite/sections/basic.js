"use client";

import { ChevronDown } from "lucide-react";
import { Card, FramedCard, Img, Ornament, Placeholder, Reveal, SectionHeading, Shell } from "../primitives";
import { useInvite } from "../InviteContext";
import Effects from "../Effects";
import { formatDate, videoEmbed } from "@/lib/format";

function HeroDate({ date, light }) {
  if (!date) return null;
  return (
    <div className="animate-float-up mt-7 flex flex-col items-center" style={{ animationDelay: "360ms" }}>
      <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.35em] opacity-80 @md:text-xs">
        <span>{formatDate(date, { weekday: "long" })}</span>
      </div>
      <div className="mt-2 flex items-center gap-2.5 @sm:gap-4" style={{ color: light ? "#fff" : "var(--inv-primary)" }}>
        <span className="h-px w-5 shrink-0 @sm:w-10 @md:w-16" style={{ background: "currentColor", opacity: 0.5 }} />
        <span className="whitespace-nowrap font-semibold tracking-[0.08em] @sm:tracking-[0.12em]" style={{ fontSize: "clamp(1.05rem, 6cqw, 1.9rem)", fontFamily: "var(--inv-font-body)" }}>
          {formatDate(date, { day: "numeric", month: "long", year: "numeric" })}
        </span>
        <span className="h-px w-5 shrink-0 @sm:w-10 @md:w-16" style={{ background: "currentColor", opacity: 0.5 }} />
      </div>
    </div>
  );
}

function Title({ data, light }) {
  return (
    <h1
      className={`animate-float-up break-words leading-[1.08] ${data.foil && !light ? "foil-text" : ""}`}
      style={{ fontSize: "clamp(2.2rem, 13cqw, 6.5rem)", fontFamily: "var(--inv-font-heading)", color: light ? "#fff" : data.foil ? undefined : "var(--inv-primary)", animationDelay: "120ms" }}
    >
      {data.title}
    </h1>
  );
}

// Over a background photo the words sit on a frosted paper card with a double stationery border,
// like a printed invitation laid on a photograph, so any photo stays readable without dulling it.
const PHOTO_CARD = {
  containerType: "inline-size", // the title and date scale to the card, not the whole page
  // frosted glass: see-through enough for the blur to read, tinted enough for the text
  background:
    "linear-gradient(160deg, color-mix(in srgb, var(--inv-bg) 72%, transparent), color-mix(in srgb, var(--inv-bg) 58%, transparent))",
  backdropFilter: "blur(26px) saturate(1.35)",
  WebkitBackdropFilter: "blur(26px) saturate(1.35)",
  boxShadow: [
    "inset 0 1px 0 rgba(255,255,255,.28)", // light catching the top edge
    "inset 0 0 0 1px rgba(255,255,255,.10)",
    "0 0 0 1px color-mix(in srgb, var(--inv-secondary) 55%, transparent)", // fine theme-coloured rule
    "0 30px 70px -28px rgba(0,0,0,.55)",
  ].join(", "),
};

export function Hero({ data }) {
  const { mode, theme } = useInvite();
  const minH = mode === "public" ? "min-h-[100svh]" : "min-h-[640px]";
  const layout = data.layout === "portrait" ? "circle" : data.layout === "center" ? "full" : data.layout || "arch";
  // One cover photo; the layout decides where it goes: inside the arch / round frame, or filling
  // the cover (Full: white text on a dark wash; Classic: a paper card over the photo).
  // bgImage is from an earlier two-photo version and is only a fallback for older invitations.
  const photo = data.image || data.bgImage;
  const full = layout === "full" && photo;
  const bg = layout === "classic" && photo;
  const overlay = (data.overlay ?? 60) / 100;

  return (
    <div className={`relative flex ${minH} flex-col items-center justify-center overflow-hidden ${bg ? "px-4" : "px-6"} pb-28 pt-16 text-center @3xl:py-16`}>
      {full && (
        <>
          <Img src={photo} className="absolute inset-0 h-full w-full object-cover" />
          {/* dark wash for the white text; the default 60% strength gives 35% → 65% */}
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,${overlay * 0.58}), rgba(0,0,0,${overlay * 0.58}) 50%, rgba(0,0,0,${Math.min(0.9, overlay * 1.08)}))` }} />
        </>
      )}
      {bg && (
        <>
          <Img src={photo} className="absolute inset-0 h-full w-full object-cover" />
          {/* light tint in the page colour (the slider), so the photo stays rich; the text sits on its own card */}
          <div className="absolute inset-0" style={{ background: "var(--inv-bg)", opacity: overlay * 0.5 }} />
          {/* fade into the next section */}
          <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(to bottom, transparent, var(--inv-bg))" }} />
        </>
      )}
      {(bg || full) && (
        // the theme petals / leaves drift over the photo and pass behind the card
        <div className="pointer-events-none absolute inset-0 z-0">
          <Effects kind={theme.animation} theme={theme} fixed={false} />
        </div>
      )}
      {layout === "classic" && !bg && (
        <div className="pointer-events-none absolute inset-4 rounded-[2rem] @md:inset-8" style={{ boxShadow: "inset 0 0 0 1px var(--inv-secondary), inset 0 0 0 6px transparent, inset 0 0 0 7px color-mix(in srgb, var(--inv-secondary) 60%, transparent)" }} />
      )}

      <div
        className={`relative z-[1] flex w-full flex-col items-center ${full ? "text-white" : ""} ${bg ? "max-w-2xl rounded-[1.75rem] px-5 py-10 @md:px-12 @md:py-14 [&_h1]:drop-shadow-[0_1px_1px_rgba(60,40,10,.28)]" : "max-w-xl"}`}
        style={bg ? PHOTO_CARD : undefined}
      >
        {bg && <span className="pointer-events-none absolute inset-2.5 rounded-[1.3rem]" style={{ boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--inv-secondary) 40%, transparent)" }} aria-hidden />}
        {data.tagline && (
          <p className="animate-float-up mb-5 max-w-sm text-[0.95rem] italic opacity-85 @md:text-lg" style={{ fontFamily: "var(--inv-font-body)" }}>
            {data.tagline}
          </p>
        )}

        {layout === "arch" && (
          <div className="animate-float-up relative mb-7 w-[52%] max-w-[210px] @md:max-w-[280px] @5xl:max-w-[340px]">
            <div className="absolute -inset-2.5 rounded-t-full" style={{ boxShadow: "inset 0 0 0 1px var(--inv-secondary)" }} />
            <div className="overflow-hidden rounded-t-full p-1.5" style={{ background: "linear-gradient(160deg, var(--inv-secondary), color-mix(in srgb, var(--inv-secondary) 40%, white), var(--inv-secondary))" }}>
              {photo ? (
                <Img src={photo} className="aspect-[3/4] w-full rounded-t-full object-cover" />
              ) : (
                <Placeholder className="aspect-[3/4] w-full rounded-t-full" label="Add a couple photo" monogram={theme.monogram} />
              )}
            </div>
          </div>
        )}
        {layout === "circle" && (
          <div className="animate-float-up mb-8 rounded-full p-1.5" style={{ background: "linear-gradient(135deg, var(--inv-primary), var(--inv-secondary))" }}>
            {photo ? (
              <Img src={photo} className="h-48 w-48 rounded-full border-4 border-white object-cover @md:h-60 @md:w-60" />
            ) : (
              <Placeholder className="h-48 w-48 rounded-full border-4 border-white @md:h-60 @md:w-60" monogram={theme.monogram} />
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

      <ChevronDown className="absolute bottom-6 left-1/2 z-[1] hidden h-6 w-6 -translate-x-1/2 animate-bounce opacity-60 @3xl:block" aria-hidden />
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
          <Placeholder className="h-56 w-44 rounded-t-full @md:h-64 @md:w-52 @5xl:h-80 @5xl:w-64" monogram={(p.name || "").trim().charAt(0)} />
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
