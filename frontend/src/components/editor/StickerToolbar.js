"use client";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BringToFront, Check, CopyPlus, FlipHorizontal, SendToBack, Trash2 } from "lucide-react";
import { SECTION_META } from "@/data/sections";

// Floating controls for the selected sticker (works with touch, where handles are fiddly).
export default function StickerToolbar({ sticker, sections, onChange, onDelete, onDuplicate, onClose }) {
  if (!sticker) return null;
  const step = (k, d, min, max) => onChange({ [k]: Math.min(max, Math.max(min, Math.round((sticker[k] + d) * 10) / 10)) });
  const btn = "grid h-9 w-9 place-items-center rounded-xl bg-ink/[0.06] text-ink hover:bg-ink/10";

  return (
    <div className="absolute inset-x-2 bottom-2 z-[70] mx-auto max-w-md rounded-3xl border border-ink/10 bg-white/95 p-3.5 shadow-2xl backdrop-blur" onPointerDown={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-500">Sticker</p>
        <button className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-cream" onClick={onClose}>
          <Check className="h-3.5 w-3.5" /> Done
        </button>
      </div>
      <div className="mt-3 grid grid-cols-[4.5rem_1fr] items-center gap-x-3 gap-y-2 text-xs font-medium text-ink-500">
        <span>Size</span>
        <input type="range" min={3} max={100} step={0.5} value={sticker.size} onChange={(e) => onChange({ size: Number(e.target.value) })} className="accent-ink" />
        <span>Rotate</span>
        <input type="range" min={-180} max={180} value={sticker.rotation || 0} onChange={(e) => onChange({ rotation: Number(e.target.value) })} className="accent-ink" />
        <span>Opacity</span>
        <input type="range" min={0.1} max={1} step={0.05} value={sticker.opacity ?? 1} onChange={(e) => onChange({ opacity: Number(e.target.value) })} className="accent-ink" />
        <span>Section</span>
        <select className="rounded-lg border border-ink/15 px-2 py-1 text-ink" value={sticker.sectionId} onChange={(e) => onChange({ sectionId: e.target.value, y: 20 })}>
          {sections
            .filter((s) => s.enabled)
            .map((s) => (
              <option key={s.id} value={s.id}>
                {SECTION_META[s.type]?.label}
              </option>
            ))}
        </select>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <button className={btn} onClick={() => step("y", -2, -5, 105)} aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
        <button className={btn} onClick={() => step("y", 2, -5, 105)} aria-label="Move down"><ArrowDown className="h-4 w-4" /></button>
        <button className={btn} onClick={() => step("x", -2, -15, 115)} aria-label="Move left"><ArrowLeft className="h-4 w-4" /></button>
        <button className={btn} onClick={() => step("x", 2, -15, 115)} aria-label="Move right"><ArrowRight className="h-4 w-4" /></button>
        <button className={btn} onClick={() => onChange({ flip: !sticker.flip })} aria-label="Flip"><FlipHorizontal className="h-4 w-4" /></button>
        <button className={btn} onClick={() => onChange({ zIndex: Math.min(999, (sticker.zIndex || 1) + 1) })} aria-label="Bring forward"><BringToFront className="h-4 w-4" /></button>
        <button className={btn} onClick={() => onChange({ zIndex: Math.max(0, (sticker.zIndex || 1) - 1) })} aria-label="Send back"><SendToBack className="h-4 w-4" /></button>
        <button className={btn} onClick={onDuplicate} aria-label="Duplicate"><CopyPlus className="h-4 w-4" /></button>
        <button className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100" onClick={onDelete} aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
