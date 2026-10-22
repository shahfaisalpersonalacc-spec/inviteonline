"use client";

import { SECTION_META } from "@/data/sections";

// Floating controls for the selected sticker (works with touch, where handles are fiddly).
export default function StickerToolbar({ sticker, sections, onChange, onDelete, onDuplicate, onClose }) {
  if (!sticker) return null;
  const step = (k, d, min, max) => onChange({ [k]: Math.min(max, Math.max(min, Math.round((sticker[k] + d) * 10) / 10)) });

  return (
    <div className="absolute inset-x-2 bottom-2 z-[70] mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white/95 p-3 shadow-2xl backdrop-blur" onPointerDown={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-zinc-700">Sticker</p>
        <button className="rounded-full px-2 text-sm text-zinc-500 hover:bg-zinc-100" onClick={onClose} aria-label="Done">
          Done ✓
        </button>
      </div>
      <div className="mt-2 grid grid-cols-[4.5rem_1fr] items-center gap-x-3 gap-y-2 text-xs">
        <span className="text-zinc-500">Size</span>
        <input type="range" min={3} max={100} step={0.5} value={sticker.size} onChange={(e) => onChange({ size: Number(e.target.value) })} className="accent-brand-600" />
        <span className="text-zinc-500">Rotate</span>
        <input type="range" min={-180} max={180} value={sticker.rotation || 0} onChange={(e) => onChange({ rotation: Number(e.target.value) })} className="accent-brand-600" />
        <span className="text-zinc-500">Opacity</span>
        <input type="range" min={0.1} max={1} step={0.05} value={sticker.opacity ?? 1} onChange={(e) => onChange({ opacity: Number(e.target.value) })} className="accent-brand-600" />
        <span className="text-zinc-500">Section</span>
        <select className="rounded-lg border border-zinc-200 px-2 py-1" value={sticker.sectionId} onChange={(e) => onChange({ sectionId: e.target.value, y: 20 })}>
          {sections
            .filter((s) => s.enabled)
            .map((s) => (
              <option key={s.id} value={s.id}>
                {SECTION_META[s.type]?.label}
              </option>
            ))}
        </select>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
        <button className="rounded-lg bg-zinc-100 px-2.5 py-1.5 hover:bg-zinc-200" onClick={() => step("y", -2, -5, 105)}>↑</button>
        <button className="rounded-lg bg-zinc-100 px-2.5 py-1.5 hover:bg-zinc-200" onClick={() => step("y", 2, -5, 105)}>↓</button>
        <button className="rounded-lg bg-zinc-100 px-2.5 py-1.5 hover:bg-zinc-200" onClick={() => step("x", -2, -15, 115)}>←</button>
        <button className="rounded-lg bg-zinc-100 px-2.5 py-1.5 hover:bg-zinc-200" onClick={() => step("x", 2, -15, 115)}>→</button>
        <button className="rounded-lg bg-zinc-100 px-2.5 py-1.5 hover:bg-zinc-200" onClick={() => onChange({ flip: !sticker.flip })}>⇋ Flip</button>
        <button className="rounded-lg bg-zinc-100 px-2.5 py-1.5 hover:bg-zinc-200" onClick={() => onChange({ zIndex: Math.min(999, (sticker.zIndex || 1) + 1) })}>Bring forward</button>
        <button className="rounded-lg bg-zinc-100 px-2.5 py-1.5 hover:bg-zinc-200" onClick={() => onChange({ zIndex: Math.max(0, (sticker.zIndex || 1) - 1) })}>Send back</button>
        <button className="rounded-lg bg-zinc-100 px-2.5 py-1.5 hover:bg-zinc-200" onClick={onDuplicate}>Duplicate</button>
        <button className="rounded-lg bg-red-50 px-2.5 py-1.5 text-red-600 hover:bg-red-100" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}
