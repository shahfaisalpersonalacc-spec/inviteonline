"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import InvitationRenderer from "@/components/invite/InvitationRenderer";
import { templateDemo } from "@/data/demoInvite";

// A live miniature of a design template: the real renderer at phone width (390px) with sample
// content, scaled to fit the card. Rendered only once the card nears the viewport.
export default function TemplatePreview({ template, eventType, className = "" }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const invitation = useMemo(() => templateDemo(template, eventType, { animation: "none" }), [template, eventType]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={{ aspectRatio: "9 / 16", background: template.theme.background }}>
      {visible && width > 0 && (
        <div className="pointer-events-none absolute left-0 top-0 origin-top-left select-none" style={{ width: 390, transform: `scale(${width / 390})` }} aria-hidden inert>
          <InvitationRenderer invitation={invitation} mode="demo" showChrome={false} showFooter={false} />
        </div>
      )}
    </div>
  );
}
