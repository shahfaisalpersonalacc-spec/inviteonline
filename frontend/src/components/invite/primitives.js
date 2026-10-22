"use client";

import { useEffect, useRef, useState } from "react";

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

export function SectionHeading({ children, sub }) {
  if (!children && !sub) return null;
  return (
    <div className="mb-8 text-center">
      {children && (
        <h2 className="text-4xl leading-tight @md:text-5xl" style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-primary)" }}>
          {children}
        </h2>
      )}
      <div className="mx-auto mt-3 flex items-center justify-center gap-2" aria-hidden>
        <span className="h-px w-10" style={{ background: "var(--inv-secondary)" }} />
        <span style={{ color: "var(--inv-secondary)" }}>❦</span>
        <span className="h-px w-10" style={{ background: "var(--inv-secondary)" }} />
      </div>
      {sub && <p className="mx-auto mt-4 max-w-md text-sm opacity-80 @md:text-base">{sub}</p>}
    </div>
  );
}

export function Shell({ children, className = "" }) {
  return <div className={`px-5 py-14 @md:px-10 @md:py-20 ${className}`}>{children}</div>;
}

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl p-5 shadow-sm @md:p-7 ${className}`}
      style={{ background: "var(--inv-surface)", border: "1px solid color-mix(in srgb, var(--inv-secondary) 45%, transparent)" }}
    >
      {children}
    </div>
  );
}

export function ThemeButton({ children, href, onClick, type = "button", disabled, variant = "solid", className = "", ...rest }) {
  const style =
    variant === "solid"
      ? { background: "var(--inv-primary)", color: "var(--inv-on-primary)" }
      : { border: "1.5px solid var(--inv-primary)", color: "var(--inv-primary)" };
  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition hover:opacity-90 active:scale-[.98] disabled:opacity-60 ${className}`;
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
      className={`flex items-center justify-center text-xs font-medium opacity-60 ${className}`}
      style={{ background: "color-mix(in srgb, var(--inv-secondary) 30%, transparent)", color: "var(--inv-primary)" }}
    >
      📷 {label}
    </div>
  );
}
