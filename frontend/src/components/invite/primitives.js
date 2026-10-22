"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";

// Fades children in when scrolled into view.
export function Reveal({ children, className = "", as: Tag = "div", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setVisible(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

// Symmetric scrollwork ornament in the theme accent colour.
export function Ornament({ className = "w-40", color = "var(--inv-secondary)" }) {
  return (
    <svg viewBox="0 0 200 24" className={className} fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
      <path d="M100 12 C92 2 80 2 76 9 C73 15 80 19 84 14 C87 10 82 7 80 10" />
      <path d="M100 12 C108 2 120 2 124 9 C127 15 120 19 116 14 C113 10 118 7 120 10" />
      <path d="M76 12 L8 12 M124 12 L192 12" strokeWidth="0.9" />
      <path d="M100 6 L104 12 L100 18 L96 12Z" fill={color} />
      <circle cx="40" cy="12" r="1.6" fill={color} />
      <circle cx="160" cy="12" r="1.6" fill={color} />
    </svg>
  );
}

// align="split": centred on phones, left-aligned beside content on wide screens.
export function SectionHeading({ children, sub, eyebrow, align = "center" }) {
  if (!children && !sub) return null;
  const split = align === "split";
  return (
    <div className={`mb-9 text-center @3xl:mb-12 ${split ? "@5xl:mb-0 @5xl:text-left" : ""}`}>
      {eyebrow && <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.32em] opacity-60">{eyebrow}</p>}
      {children && (
        <h2 className="text-[2.6rem] leading-tight @md:text-[3.4rem] @5xl:text-[3.9rem]" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
          {children}
        </h2>
      )}
      <Ornament className={`mx-auto mt-3 w-36 @md:w-44 ${split ? "@5xl:mx-0" : ""}`} />
      {sub && <p className={`mx-auto mt-4 max-w-md text-[1.05rem] italic opacity-80 @md:text-lg ${split ? "@5xl:mx-0" : ""}`}>{sub}</p>}
    </div>
  );
}

export function Shell({ children, className = "" }) {
  return <div className={`px-5 py-14 @md:px-10 @md:py-20 @5xl:px-12 @5xl:py-24 ${className}`}>{children}</div>;
}

export function Card({ children, className = "", style }) {
  return (
    <div
      className={`relative rounded-[1.75rem] p-5 @md:p-7 ${className}`}
      style={{
        background: "var(--inv-surface)",
        boxShadow: "0 18px 40px -24px color-mix(in srgb, var(--inv-primary) 45%, transparent), inset 0 0 0 1px color-mix(in srgb, var(--inv-secondary) 55%, transparent)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// A card with a thin inner gold frame, like printed stationery.
export function FramedCard({ children, className = "" }) {
  return (
    <Card className={className}>
      <div className="pointer-events-none absolute inset-2 rounded-[1.35rem]" style={{ boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--inv-secondary) 80%, transparent)" }} />
      <div className="relative">{children}</div>
    </Card>
  );
}

export function ThemeButton({ children, href, onClick, type = "button", disabled, variant = "solid", className = "", ...rest }) {
  const style =
    variant === "solid"
      ? { background: "var(--inv-primary)", color: "var(--inv-on-primary)", boxShadow: "0 10px 24px -12px var(--inv-primary)" }
      : { boxShadow: "inset 0 0 0 1.5px var(--inv-primary)", color: "var(--inv-primary)" };
  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition hover:opacity-90 active:scale-[.98] disabled:opacity-60 ${className}`;
  if (href)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style} {...rest}>
        {children}
      </a>
    );
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} style={style} {...rest}>
      {children}
    </button>
  );
}

export function Img({ src, alt = "", className = "", style }) {
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" decoding="async" className={className} style={style} draggable={false} />;
}

export function Placeholder({ label = "Add a photo", className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 text-xs font-medium ${className}`}
      style={{ background: "color-mix(in srgb, var(--inv-secondary) 28%, var(--inv-surface))", color: "var(--inv-primary)" }}
    >
      <ImagePlus className="h-6 w-6 opacity-70" strokeWidth={1.4} />
      <span className="opacity-70">{label}</span>
    </div>
  );
}

// Small round icon badge used in detail rows.
export function IconBadge({ Icon }) {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: "color-mix(in srgb, var(--inv-primary) 10%, transparent)", color: "var(--inv-primary)" }}>
      <Icon className="h-4 w-4" strokeWidth={1.7} />
    </span>
  );
}
