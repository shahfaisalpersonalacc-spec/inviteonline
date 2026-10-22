"use client";

import { useState } from "react";
import { STICKERS, STICKER_CATEGORIES } from "@/data/stickers";
import { SECTION_META } from "@/data/sections";

export default function StickersPanel({ sections, targetSection, setTargetSection, onAdd, count }) {
  const [cat, setCat] = useState("all");
  const list = cat === "all" ? STICKERS : STICKERS.filter((s) => s.category === cat);
  const visible = sections.filter((s) => s.enabled);

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Add stickers to</label>
        <select className="input" value={targetSection} onChange={(e) => setTargetSection(e.target.value)}>
          {visible.map((s) => (
            <option key={s.id} value={s.id}>
              {SECTION_META[s.type]?.label}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-ink-500">
          Tap a sticker to add it, then drag it on the preview. Use the blue handles to resize and rotate.{count > 0 && ` ${count} placed.`}
        </p>
      </div>

      <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {[{ id: "all", label: "All" }, ...STICKER_CATEGORIES].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold ${cat === c.id ? "bg-ink text-cream" : "bg-ink/[0.06] text-ink-500 hover:bg-ink/10"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {list.map((s) => (
          <button
            key={s.id}
            type="button"
            title={s.name}
            onClick={() => onAdd(s)}
            className="grid aspect-square place-items-center rounded-2xl border border-ink/[0.06] bg-cream p-2 transition hover:scale-105 hover:border-gold/60 hover:bg-white hover:shadow"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt={s.name} className="max-h-full w-full object-contain" draggable={false} />
          </button>
        ))}
      </div>
    </div>
  );
}
