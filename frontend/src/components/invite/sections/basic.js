"use client";

import { ChevronDown } from "lucide-react";
import { Card, FramedCard, Img, Ornament, Placeholder, Reveal, SectionHeading, Shell } from "../primitives";
import { useInvite } from "../InviteContext";
import Effects from "../Effects";
import { HeroDecor } from "../decor/Decor";
import { FLORA, FloralCorner, FloralGarland } from "../decor/flora";
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

// Splits "Ayesha & Ahmed" / "Ayesha and Ahmed" / "Ayesha weds Ahmed" into two names.
const twoNames = (title = "") => {
  const parts = title.split(/\s+(?:&|and|weds|\+)\s+|\s*&\s*/i).map((x) => x.trim()).filter(Boolean);
  return parts.length === 2 ? parts : null;
};

function EditorHint({ children }) {
  return (
    <p className="absolute left-1/2 top-4 z-[2] -translate-x-1/2 whitespace-nowrap rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
      {children}
    </p>
  );
}

// Photo filling the top of the page, names over it in white (the photo-led templates).
function PhotoTopHero({ data, photo, minH, overlay, theme, mode, design }) {
  const date = data.date && formatDate(data.date, { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, " · ");
  // "stagger" templates: two names in spaced capitals, the first set left and the second right
  const staggered = design?.heroNames === "stagger" ? twoNames(data.title) : null;
  return (
    <div className={`relative flex ${minH} flex-col items-center justify-end overflow-hidden px-6 text-center text-white`} style={{ paddingBottom: "clamp(64px, 16cqw, 120px)" }}>
      {photo ? (
        <Img src={photo} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div
          className="absolute inset-0 grid place-items-center"
          style={{ background: "radial-gradient(120% 80% at 50% 18%, color-mix(in srgb, var(--inv-primary) 78%, white), var(--inv-primary) 55%, color-mix(in srgb, var(--inv-primary) 70%, black))" }}
        >
          <span className="-mt-[30%] select-none opacity-15" style={{ fontFamily: "var(--inv-font-heading)", fontSize: "clamp(6rem, 40cqw, 16rem)" }} aria-hidden>
            {theme.monogram}
          </span>
        </div>
      )}
      {mode === "editor" && !photo && <EditorHint>Add a cover photo in Content → Cover</EditorHint>}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, rgba(0,0,0,${overlay * 0.3}) 0%, transparent 28%, rgba(0,0,0,${overlay * 0.45}) 60%, rgba(0,0,0,${Math.min(0.92, overlay * 1.2)}) 100%)` }}
      />
      <div className="pointer-events-none absolute inset-0 z-0">
        <Effects kind={theme.animation} theme={theme} fixed={false} />
      </div>
      <div className="relative z-[1] flex max-w-2xl flex-col items-center [text-shadow:0_2px_18px_rgba(0,0,0,.35)]">
        {data.tagline && <p className="animate-float-up max-w-sm text-[11px] font-semibold uppercase tracking-[0.34em] opacity-90 @md:text-xs">{data.tagline}</p>}
        {staggered ? (
          <h1 className="animate-float-up mt-4 uppercase leading-[1.05]" style={{ fontSize: "clamp(2.5rem, 13cqw, 6.5rem)", letterSpacing: "0.06em", fontFamily: "var(--inv-font-heading)", fontWeight: 400, animationDelay: "120ms" }}>
            <span className="block" style={{ marginRight: "1.6em" }}>{staggered[0]}</span>
            <span className="block" style={{ marginLeft: "1.6em" }}>{staggered[1]}</span>
          </h1>
        ) : (
          <h1 className="animate-float-up mt-4 break-words leading-[1.02]" style={{ fontSize: "clamp(2.7rem, 15cqw, 7rem)", fontFamily: "var(--inv-font-heading)", animationDelay: "120ms" }}>
            {data.title}
          </h1>
        )}
        {data.subtitle && <p className="animate-float-up mt-3 max-w-md text-base opacity-90 @md:text-lg" style={{ animationDelay: "240ms" }}>{data.subtitle}</p>}
        {date && <p className="animate-float-up mt-5 text-sm font-semibold tracking-[0.4em] @md:text-base" style={{ animationDelay: "320ms" }}>{date}</p>}
      </div>
    </div>
  );
}

// The two names in script with a small "&" between, over a classic printed-invitation date:
//            OCTOBER
//   ─WEDNESDAY─   28   ─ 2026 ─
function MonumentDate({ names, date }) {
  const num = (opts) => formatDate(date, opts);
  const name = { fontFamily: "var(--inv-font-heading)", fontSize: "clamp(2.6rem, 14cqw, 5.5rem)", lineHeight: 1.05, color: "var(--inv-primary)" };
  const side = "w-[6.5rem] border-y py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.28em] @md:w-32 @md:text-xs";
  const rule = { borderColor: "color-mix(in srgb, var(--inv-secondary) 70%, transparent)" };
  return (
    <div className="flex flex-col items-center">
      <div className="animate-float-up flex flex-col items-center" style={{ animationDelay: "120ms" }}>
        <span className="px-[0.2em]" style={name}>{names[0]}</span>
        <span className="my-1 text-2xl italic @md:text-3xl" style={{ fontFamily: "var(--inv-font-body)", color: "var(--inv-secondary)" }}>&amp;</span>
        <span className="px-[0.2em]" style={name}>{names[1]}</span>
      </div>
      <div className="animate-float-up mt-8 flex flex-col items-center" style={{ color: "var(--inv-primary)", animationDelay: "320ms" }}>
        <span className="text-xs font-semibold uppercase tracking-[0.4em] @md:text-sm">{num({ month: "long" })}</span>
        <div className="mt-2 flex items-center gap-4 @md:gap-6">
          <span className={side} style={rule}>{num({ weekday: "long" })}</span>
          <span className="leading-none" style={{ fontFamily: "var(--inv-font-body)", fontSize: "clamp(3rem, 15cqw, 5rem)", fontWeight: 300 }}>
            {num({ day: "numeric" })}
          </span>
          <span className={side} style={rule}>{num({ year: "numeric" })}</span>
        </div>
      </div>
    </div>
  );
}

// Watercolour flowers across the top corners and along the bottom, names in script between.
function FloralHero({ data, photo, minH, theme, design }) {
  const palette = FLORA[design?.decor] ? design.decor : "blush";
  const names = twoNames(data.title);
  const stack = design?.heroDate === "stack" && names && data.date;
  return (
    <div
      className={`relative flex ${minH} flex-col items-center justify-center overflow-hidden px-6 text-center`}
      style={{ paddingTop: "clamp(120px, 34cqw, 290px)", paddingBottom: "clamp(108px, 28cqw, 260px)" }}
    >
      <div className="pointer-events-none absolute -left-[5%] -top-[3%]" style={{ width: "min(54cqw, 400px)" }} aria-hidden>
        <FloralCorner name={palette} className="block w-full" seed={4} />
      </div>
      <div className="pointer-events-none absolute -right-[5%] -top-[3%]" style={{ width: "min(54cqw, 400px)", transform: "scaleX(-1)" }} aria-hidden>
        <FloralCorner name={palette} className="block w-full" seed={9} />
      </div>
      <div className="pointer-events-none absolute -bottom-[2%] left-1/2 -translate-x-1/2" style={{ width: "min(118cqw, 860px)" }} aria-hidden>
        <FloralGarland name={palette} className="block w-full" seed={6} />
      </div>

      <div className="relative z-[1] flex w-full max-w-xl flex-col items-center">
        {data.tagline && (
          <p className="animate-float-up mb-5 max-w-sm text-[0.95rem] italic opacity-85 @md:text-lg" style={{ fontFamily: "var(--inv-font-body)" }}>
            {data.tagline}
          </p>
        )}
        {stack ? <MonumentDate names={names} date={data.date} /> : <Title data={data} />}
        {data.subtitle && (
          <p className="animate-float-up mt-4 max-w-md text-lg @md:text-xl" style={{ animationDelay: "240ms", fontFamily: "var(--inv-font-body)" }}>
            {data.subtitle}
          </p>
        )}
        {photo && (
          <div className="animate-float-up relative mt-8 w-[46%] max-w-[230px]">
            <div className="absolute -inset-2 rounded-t-full" style={{ boxShadow: "inset 0 0 0 1px var(--inv-secondary)" }} />
            <Img src={photo} className="aspect-[3/4] w-full rounded-t-full object-cover" />
          </div>
        )}
        {!stack && <HeroDate date={data.date} />}
      </div>
    </div>
  );
}

export function Hero({ data }) {
  const { mode, theme, design } = useInvite();
  // phones: about three-quarters of the screen so the next section peeks in; full screen from tablets
  const minH = mode === "public" ? "min-h-[76svh] @3xl:min-h-[100svh]" : "min-h-[560px] @3xl:min-h-[640px]";
  const layout = data.layout === "portrait" ? "circle" : data.layout === "center" ? "full" : data.layout || "arch";
  // One cover photo; the layout decides where it goes: inside the arch / round frame, or filling
  // the cover (Full: white text on a dark wash; Classic: a paper card over the photo).
  // bgImage is from an earlier two-photo version and is only a fallback for older invitations.
  const photo = data.image || data.bgImage;
  const full = layout === "full" && photo;
  const bg = layout === "classic" && photo;
  const overlay = (data.overlay ?? 60) / 100;

  if (layout === "photo-top") return <PhotoTopHero data={data} photo={photo} minH={mode === "public" ? "min-h-[72svh] @3xl:min-h-[92svh]" : "min-h-[540px] @3xl:min-h-[620px]"} overlay={overlay} theme={theme} mode={mode} design={design} />;
  if (layout === "floral") return <FloralHero data={data} photo={photo} minH={minH} theme={theme} design={design} />;

  return (
    <div
      className={`relative flex ${minH} flex-col items-center justify-center overflow-hidden ${bg ? "px-4" : "px-6"} pb-14 pt-12 text-center @3xl:py-16`}
      style={design?.toran ? { paddingTop: "clamp(120px, 30cqw, 220px)" } : undefined}
    >
      {!bg && !full && <HeroDecor design={design} theme={theme} layout={layout} />}
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
      <div className={`mx-auto grid max-w-4xl items-start ${pair ? "grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-2 @md:items-center @md:gap-10" : "gap-10 @md:grid-cols-2"}`}>
        {people.map((p, i) => (
          <PersonBlock key={i} p={p} i={i} pair={pair} />
        ))}
      </div>
    </Shell>
  );
}

function PersonBlock({ p, i, pair }) {
  // side-by-side couple: the arches always fill their column (capped as the screen grows), so the pair
  // never runs off the side on in-between widths; a single host keeps the larger fixed arch
  const size = pair ? "aspect-[3/4] w-full" : "h-56 w-44 @md:h-64 @md:w-52 @5xl:h-80 @5xl:w-64";
  const frame = pair ? "relative w-full max-w-[9.5rem] @md:max-w-[13rem] @5xl:max-w-[16rem]" : "relative";
  const block = (
    <Reveal className="flex flex-col items-center text-center" delay={i * 120}>
      <div className={frame}>
        <div className="absolute -inset-3 rounded-t-full" style={{ boxShadow: "inset 0 0 0 1px var(--inv-secondary)" }} />
        {p.photo ? (
          <Img src={p.photo} alt={p.name} className={`${size} rounded-t-full object-cover shadow-lg`} />
        ) : (
          <Placeholder className={`${size} rounded-t-full`} monogram={(p.name || "").trim().charAt(0)} />
        )}
      </div>
      {p.role && <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.24em] opacity-60 @md:mt-6 @md:text-[11px] @md:tracking-[0.3em]">{p.role}</p>}
      <h3 className="mt-1 break-words text-[2rem] leading-tight @md:text-[2.6rem]" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
        {p.name}
      </h3>
      {p.bio && <p className="mt-1 max-w-xs text-sm italic opacity-80 @md:text-base">{p.bio}</p>}
    </Reveal>
  );
  if (pair && i === 0)
    return (
      <>
        {block}
        <div className="self-center text-center text-4xl @md:text-6xl" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-secondary)" }}>
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
  const { design } = useInvite();
  if (!data.text && !data.signature) return null;
  return (
    // classic look: a short gap into the dark footer; templates: balanced above and below
    <Shell className={design ? "" : "!pb-6"}>
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
