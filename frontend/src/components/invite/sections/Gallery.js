"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Img, Placeholder, Reveal, SectionHeading, Shell } from "../primitives";
import { useInvite } from "../InviteContext";

export default function Gallery({ data }) {
  const { mode } = useInvite();
  const images = (data.images || []).filter(Boolean);
  const [open, setOpen] = useState(-1);

  const close = useCallback(() => setOpen(-1), []);
  const step = useCallback((d) => setOpen((i) => (i + d + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (open < 0) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  if (!images.length) {
    if (mode !== "editor") return null;
    return (
      <Shell>
        <SectionHeading>{data.heading}</SectionHeading>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <Placeholder key={i} className="aspect-square rounded-2xl" label="Photo" />
          ))}
        </div>
      </Shell>
    );
  }

  const masonry = data.layout === "masonry";
  return (
    <Shell>
      <SectionHeading>{data.heading}</SectionHeading>
      <div className={masonry ? "columns-2 gap-3 @3xl:columns-3 @5xl:columns-4" : "grid auto-rows-[150px] grid-cols-2 gap-2 @md:gap-3 @3xl:auto-rows-[200px] @3xl:grid-cols-3 @5xl:auto-rows-[220px] @5xl:grid-cols-4 @5xl:gap-4"}>
        {images.map((src, i) => (
          <Reveal key={src + i} delay={(i % 6) * 60} className={masonry ? "mb-3 break-inside-avoid" : i % 5 === 0 || i % 5 === 3 ? "row-span-2" : ""}>
            <button type="button" onClick={() => setOpen(i)} className={`group block w-full overflow-hidden rounded-2xl ${masonry ? "" : "h-full"}`} aria-label={`Open photo ${i + 1}`}>
              <Img src={src} className={`w-full object-cover transition duration-500 group-hover:scale-105 ${masonry ? "" : "h-full"}`} />
            </button>
          </Reveal>
        ))}
      </div>

      {open >= 0 && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-3" onClick={close}>
          <Img src={images[open]} className="max-h-[88vh] max-w-full rounded-lg object-contain" />
          <button className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white" onClick={close} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
          {images.length > 1 && (
            <>
              <button className="absolute left-2 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white" onClick={(e) => (e.stopPropagation(), step(-1))} aria-label="Previous">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white" onClick={(e) => (e.stopPropagation(), step(1))} aria-label="Next">
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <p className="absolute bottom-4 text-sm text-white/70">
            {open + 1} / {images.length}
          </p>
        </div>
      )}
    </Shell>
  );
}
