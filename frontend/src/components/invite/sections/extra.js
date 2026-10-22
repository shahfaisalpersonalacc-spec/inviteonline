"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy, Gift, Sparkles } from "lucide-react";
import { FramedCard, Img, Reveal, SectionHeading, Shell } from "../primitives";
import { formatDate } from "@/lib/format";

/* ---------------- Scratch to reveal ---------------- */

const CONFETTI = ["#d9b25f", "#f6e3a1", "#e8544a", "#ffffff", "#c9a24a", "#f4b6c2"];

function paintFoil(canvas) {
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;
  ctx.globalCompositeOperation = "source-over";
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#9c7424");
  g.addColorStop(0.25, "#e9cd7d");
  g.addColorStop(0.45, "#fff3c9");
  g.addColorStop(0.62, "#d4a843");
  g.addColorStop(0.8, "#f3d98f");
  g.addColorStop(1, "#8a6420");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // brushed texture
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = `rgba(255,255,255,${(i % 7) / 40})`;
    ctx.fillRect((i * 97) % w, (i * 53) % h, 1 + (i % 3), 1);
  }
  const dpr = canvas.width / canvas.clientWidth || 1;
  ctx.fillStyle = "rgba(90,60,10,.75)";
  ctx.font = `600 ${13 * dpr}px "Plus Jakarta Sans", system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✦  SCRATCH HERE  ✦", w / 2, h / 2);
}

export function Scratch({ data }) {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const moves = useRef(0);
  const [revealed, setRevealed] = useState(false);

  const setup = useCallback(() => {
    const c = canvas.current;
    const el = wrap.current;
    if (!c || !el) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = el.clientWidth * dpr;
    c.height = el.clientHeight * dpr;
    paintFoil(c);
  }, []);

  useEffect(() => {
    if (revealed) return;
    setup();
    const ro = new ResizeObserver(setup);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [setup, revealed]);

  function point(e) {
    const r = canvas.current.getBoundingClientRect();
    const k = canvas.current.width / r.width;
    return [(e.clientX - r.left) * k, (e.clientY - r.top) * k, k];
  }

  function scratch(e) {
    if (!drawing.current || revealed) return;
    const c = canvas.current;
    const ctx = c.getContext("2d");
    const [x, y, k] = point(e);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 34 * k;
    ctx.beginPath();
    const [lx, ly] = last.current || [x, y];
    ctx.moveTo(lx, ly);
    ctx.lineTo(x, y);
    ctx.stroke();
    last.current = [x, y];
    if (++moves.current % 12 === 0) checkCleared();
  }

  function checkCleared() {
    const c = canvas.current;
    const { data: px } = c.getContext("2d").getImageData(0, 0, c.width, c.height);
    let clear = 0;
    let total = 0;
    for (let i = 3; i < px.length; i += 4 * 40) {
      total++;
      if (px[i] < 40) clear++;
    }
    if (clear / total > 0.45) setRevealed(true);
  }

  const date = data.date;
  return (
    <Shell>
      <SectionHeading sub={!revealed ? data.text : undefined}>{data.heading}</SectionHeading>
      <Reveal className="mx-auto max-w-md">
        <FramedCard className="!p-3">
          <div ref={wrap} className="relative h-44 overflow-hidden rounded-2xl @md:h-52" style={{ background: "color-mix(in srgb, var(--inv-secondary) 18%, var(--inv-surface))" }}>
            {/* the hidden date */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              {date ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] opacity-70">{formatDate(date, { weekday: "long" })}</p>
                  <p className="mt-1 flex items-baseline gap-3" style={{ color: "var(--inv-primary)" }}>
                    <span className="text-xl font-semibold uppercase tracking-[0.2em]">{formatDate(date, { month: "long" })}</span>
                    <span className="text-6xl font-bold leading-none" style={{ fontFamily: "var(--inv-font-body)" }}>
                      {formatDate(date, { day: "numeric" })}
                    </span>
                    <span className="text-xl font-semibold tracking-[0.2em]">{formatDate(date, { year: "numeric" })}</span>
                  </p>
                </>
              ) : (
                <p className="italic opacity-70">Add a date in the editor</p>
              )}
            </div>
            {/* foil */}
            <canvas
              ref={canvas}
              className="absolute inset-0 h-full w-full cursor-pointer touch-none transition-opacity duration-700"
              style={{ opacity: revealed ? 0 : 1, pointerEvents: revealed ? "none" : "auto" }}
              onPointerDown={(e) => {
                drawing.current = true;
                last.current = null;
                e.currentTarget.setPointerCapture?.(e.pointerId);
                scratch(e);
              }}
              onPointerMove={scratch}
              onPointerUp={() => {
                drawing.current = false;
                checkCleared();
              }}
              onPointerCancel={() => (drawing.current = false)}
              aria-label="Scratch to reveal the date"
              role="img"
            />
            {revealed && (
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                {Array.from({ length: 22 }, (_, i) => (
                  <span
                    key={i}
                    className="absolute left-1/2 top-1/2 h-2 w-1.5 rounded-sm"
                    style={{
                      background: CONFETTI[i % CONFETTI.length],
                      "--dx": `${Math.cos((i / 22) * Math.PI * 2) * (90 + (i % 4) * 30)}px`,
                      "--dy": `${Math.sin((i / 22) * Math.PI * 2) * (60 + (i % 3) * 25)}px`,
                      "--r": `${i * 47}deg`,
                      animation: "burst 1.1s cubic-bezier(.2,.7,.3,1) forwards",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </FramedCard>
        {!revealed && (
          <button type="button" onClick={() => setRevealed(true)} className="mx-auto mt-4 flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--inv-primary)" }}>
            <Sparkles className="h-4 w-4" /> Quick reveal
          </button>
        )}
      </Reveal>
    </Shell>
  );
}

/* ---------------- Love story timeline ---------------- */

export function Timeline({ data }) {
  const items = (data.items || []).filter((x) => x.title || x.text || x.date);
  if (!items.length) return null;
  return (
    <Shell>
      <SectionHeading>{data.heading}</SectionHeading>
      <ol className="relative mx-auto max-w-xl">
        <span className="absolute bottom-0 left-6 top-0 w-px @md:left-1/2" style={{ background: "linear-gradient(transparent, var(--inv-secondary) 10%, var(--inv-secondary) 90%, transparent)" }} aria-hidden />
        {items.map((x, i) => {
          const right = i % 2 === 1;
          return (
            <Reveal as="li" key={i} delay={i * 90} className={`relative mb-10 pl-16 last:mb-0 @md:w-1/2 @md:pl-0 ${right ? "@md:ml-auto @md:pl-12" : "@md:pr-12 @md:text-right"}`}>
              <span
                className={`absolute left-6 top-1 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full @md:left-auto ${right ? "@md:-left-[18px] @md:translate-x-0" : "@md:-right-[18px] @md:translate-x-0"}`}
                style={{ background: "var(--inv-surface)", boxShadow: "0 0 0 1.5px var(--inv-secondary), 0 0 0 6px var(--inv-bg)", color: "var(--inv-primary)" }}
                aria-hidden
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.5 3 4.5 6.9 4.5c2 0 3.5 1.1 5.1 3 1.6-1.9 3.1-3 5.1-3 3.9 0 6 4 4.5 7.3C19.5 16.4 12 21 12 21Z" />
                </svg>
              </span>
              {x.date && <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "var(--inv-primary)" }}>{x.date}</p>}
              <h3 className="mt-1 text-3xl leading-tight" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
                {x.title}
              </h3>
              {x.image && <Img src={x.image} className={`mt-3 aspect-[4/3] w-full rounded-2xl object-cover shadow-md ${right ? "" : "@md:ml-auto"}`} />}
              {x.text && <p className="mt-2 text-lg leading-relaxed opacity-85">{x.text}</p>}
            </Reveal>
          );
        })}
      </ol>
    </Shell>
  );
}

/* ---------------- Gifts ---------------- */

function CopyButton({ value }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {}
      }}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
      style={{ background: "color-mix(in srgb, var(--inv-primary) 10%, transparent)", color: "var(--inv-primary)" }}
    >
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

export function Gifts({ data }) {
  const accounts = (data.accounts || []).filter((a) => a.number || a.title);
  return (
    <Shell>
      <SectionHeading sub={data.text}>{data.heading}</SectionHeading>
      <div className="mx-auto grid max-w-md gap-4">
        {accounts.map((a, i) => (
          <Reveal key={i} delay={i * 80}>
            <FramedCard>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full" style={{ background: "color-mix(in srgb, var(--inv-primary) 10%, transparent)", color: "var(--inv-primary)" }}>
                  <Gift className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] opacity-60">{a.label}</p>
                  <p className="truncate font-semibold">{a.title}</p>
                </div>
              </div>
              {a.number && (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl px-3 py-2.5" style={{ background: "color-mix(in srgb, var(--inv-secondary) 20%, transparent)" }}>
                  <span className="min-w-0 break-all font-mono text-sm tracking-wide">{a.number}</span>
                  <CopyButton value={a.number} />
                </div>
              )}
              {a.note && <p className="mt-2 text-sm italic opacity-70">{a.note}</p>}
            </FramedCard>
          </Reveal>
        ))}
      </div>
    </Shell>
  );
}

/* ---------------- FAQ ---------------- */

export function Faq({ data }) {
  const items = (data.items || []).filter((x) => x.q);
  if (!items.length) return null;
  return (
    <Shell>
      <SectionHeading>{data.heading}</SectionHeading>
      <div className="mx-auto max-w-lg space-y-3">
        {items.map((x, i) => (
          <Reveal key={i} delay={i * 60}>
            <details className="group rounded-2xl px-5 py-4" style={{ background: "var(--inv-surface)", boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--inv-secondary) 55%, transparent)" }}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                {x.q}
                <ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" style={{ color: "var(--inv-primary)" }} />
              </summary>
              <p className="mt-2 leading-relaxed opacity-80">{x.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </Shell>
  );
}
