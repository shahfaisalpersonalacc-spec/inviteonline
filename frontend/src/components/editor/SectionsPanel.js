"use client";

import { useState } from "react";
import SectionForm from "./SectionForms";
import { SECTION_META, SECTION_TYPES, newId } from "@/data/sections";

export default function SectionsPanel({ sections, onChange, onFocusSection }) {
  const [open, setOpen] = useState(sections[0]?.id || null);
  const [adding, setAdding] = useState(false);

  const update = (id, patch) => onChange(sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (id) => {
    if (!confirm("Remove this section? Stickers placed on it will move to the first section.")) return;
    onChange(sections.filter((s) => s.id !== id));
  };
  const add = (type) => {
    const s = { id: newId(), type, enabled: true, data: SECTION_META[type].data() };
    onChange([...sections, s]);
    setOpen(s.id);
    setAdding(false);
    setTimeout(() => onFocusSection?.(s.id), 50);
  };

  return (
    <div className="space-y-2.5">
      <p className="text-xs text-zinc-500">Tap a section to edit it. Use the switch to hide it, arrows to reorder.</p>
      {sections.map((s, i) => {
        const meta = SECTION_META[s.type] || { label: s.type, icon: "▫️" };
        const isOpen = open === s.id;
        return (
          <div key={s.id} className={`rounded-2xl border bg-white transition ${isOpen ? "border-brand-200 shadow-md" : "border-zinc-200"}`}>
            <div className="flex items-center gap-2 p-2.5 pl-3">
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                onClick={() => {
                  setOpen(isOpen ? null : s.id);
                  if (!isOpen) onFocusSection?.(s.id);
                }}
              >
                <span className="text-lg">{meta.icon}</span>
                <span className={`truncate text-sm font-semibold ${s.enabled ? "text-zinc-800" : "text-zinc-400 line-through"}`}>{meta.label}</span>
              </button>
              <button type="button" onClick={() => move(i, -1)} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700" aria-label="Move up">
                ↑
              </button>
              <button type="button" onClick={() => move(i, 1)} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700" aria-label="Move down">
                ↓
              </button>
              <button
                type="button"
                role="switch"
                aria-checked={s.enabled}
                aria-label={s.enabled ? "Hide section" : "Show section"}
                onClick={() => update(s.id, { enabled: !s.enabled })}
                className={`relative h-5 w-9 shrink-0 rounded-full transition ${s.enabled ? "bg-brand-600" : "bg-zinc-300"}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${s.enabled ? "left-[18px]" : "left-0.5"}`} />
              </button>
            </div>
            {isOpen && (
              <div className="border-t border-zinc-100 p-4">
                <SectionForm section={s} onChange={(data) => update(s.id, { data })} />
                {s.type !== "hero" && (
                  <button type="button" onClick={() => remove(s.id)} className="mt-5 text-xs font-medium text-red-600 hover:underline">
                    Remove section
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {adding ? (
        <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold">Add a section</p>
            <button className="text-xs text-zinc-500" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SECTION_TYPES.filter((t) => t !== "hero").map((t) => (
              <button key={t} type="button" onClick={() => add(t)} className="flex items-center gap-2 rounded-xl bg-white p-2.5 text-left text-xs font-medium shadow-sm hover:ring-2 hover:ring-brand-200">
                <span className="text-base">{SECTION_META[t].icon}</span>
                {SECTION_META[t].label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="w-full rounded-2xl border-2 border-dashed border-zinc-200 py-3 text-sm font-semibold text-zinc-500 hover:border-brand-300 hover:text-brand-600">
          ＋ Add section
        </button>
      )}
    </div>
  );
}
