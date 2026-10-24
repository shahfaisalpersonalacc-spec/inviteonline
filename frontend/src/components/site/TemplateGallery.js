"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import TemplatePreview from "./TemplatePreview";
import { TEMPLATES } from "@/data/templates";
import { eventTypeLabel } from "@/data/eventTypes";

// Homepage rail of every design template as a live miniature (swipe on phones, wraps into a grid on desktop).
export default function TemplateGallery() {
  return (
    <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:px-0">
      {TEMPLATES.map((t) => (
        <li key={t.id} className="w-[46vw] max-w-[210px] shrink-0 snap-start sm:w-48 lg:w-auto lg:max-w-none">
          {/* the card is a div with a full-size link on top: previews contain their own links and buttons */}
          <div className="group relative block">
            <span className="block overflow-hidden rounded-[1.1rem] border border-ink/10 bg-white shadow-[0_24px_40px_-30px_rgba(28,26,61,.55)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_30px_50px_-28px_rgba(28,26,61,.6)]">
              <TemplatePreview template={t} />
            </span>
            <span className="mt-3 flex items-start justify-between gap-2">
              <span className="min-w-0">
                <span className="block font-serif text-lg leading-tight text-ink">{t.label}</span>
                <span className="mt-0.5 block truncate text-xs text-ink-500">{t.events.slice(0, 2).map(eventTypeLabel).join(" · ")}</span>
              </span>
              <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-ink/30 transition group-hover:text-brand-600" />
            </span>
            <Link href="/register" className="absolute inset-0 z-10 rounded-[1.1rem]" aria-label={`Start with the ${t.label} template`} />
          </div>
        </li>
      ))}
    </ul>
  );
}
