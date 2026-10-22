"use client";

import { useRef } from "react";
import { getSticker } from "@/data/stickers";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const round = (v) => Math.round(v * 10) / 10;

export function StickerVisual({ sticker, size }) {
  const def = getSticker(sticker.stickerId);
  if (!def) return null;
  if (def.emoji)
    return (
      <span className="block select-none text-center leading-none" style={{ fontSize: `${size * 0.82}cqw` }}>
        {def.emoji}
      </span>
    );
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={def.src} alt="" draggable={false} className="block h-auto w-full select-none" />;
}

// Stickers are positioned relative to their section: x/y are % of the section box,
// size is % of the invitation width (cqw), so layouts scale on every screen.
export default function StickerLayer({ stickers, editable, selectedId, onSelect, onChange }) {
  const layerRef = useRef(null);
  const action = useRef(null);

  if (!stickers?.length) return null;

  function begin(e, sticker, kind) {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    onSelect?.(sticker.id);
    const rect = layerRef.current.getBoundingClientRect();
    const cx = rect.left + (sticker.x / 100) * rect.width;
    const cy = rect.top + (sticker.y / 100) * rect.height;
    action.current = {
      kind,
      id: sticker.id,
      rect,
      cx,
      cy,
      px: e.clientX,
      py: e.clientY,
      x: sticker.x,
      y: sticker.y,
      size: sticker.size,
      dist: Math.max(8, Math.hypot(e.clientX - cx, e.clientY - cy)),
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function move(e) {
    const a = action.current;
    if (!a) return;
    e.preventDefault();
    if (a.kind === "move") {
      onChange(a.id, {
        x: round(clamp(a.x + ((e.clientX - a.px) / a.rect.width) * 100, -15, 115)),
        y: round(clamp(a.y + ((e.clientY - a.py) / a.rect.height) * 100, -5, 105)),
      });
    } else if (a.kind === "resize") {
      const dist = Math.hypot(e.clientX - a.cx, e.clientY - a.cy);
      onChange(a.id, { size: round(clamp((a.size * dist) / a.dist, 3, 100)) });
    } else if (a.kind === "rotate") {
      const deg = (Math.atan2(e.clientY - a.cy, e.clientX - a.cx) * 180) / Math.PI + 90;
      let r = ((deg + 540) % 360) - 180;
      if (Math.abs(r) < 4) r = 0; // snap upright
      onChange(a.id, { rotation: Math.round(r) });
    }
  }

  const end = () => (action.current = null);

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 z-[5]">
      {stickers.map((s) => {
        const selected = editable && s.id === selectedId;
        return (
          <div
            key={s.id}
            className={`absolute ${editable ? "pointer-events-auto cursor-move touch-none" : ""}`}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}cqw`,
              zIndex: selected ? 999 : s.zIndex,
              opacity: s.opacity ?? 1,
              transform: `translate(-50%, -50%) rotate(${s.rotation || 0}deg)`,
            }}
            onPointerDown={(e) => begin(e, s, "move")}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
          >
            <div style={{ transform: s.flip ? "scaleX(-1)" : undefined }}>
              <StickerVisual sticker={s} size={s.size} />
            </div>
            {selected && (
              <>
                <div className="pointer-events-none absolute -inset-1.5 rounded-md border-2 border-dashed border-sky-500" />
                <button
                  type="button"
                  aria-label="Rotate sticker"
                  className="absolute -top-8 left-1/2 h-6 w-6 -translate-x-1/2 cursor-grab touch-none rounded-full border-2 border-sky-500 bg-white text-[11px] leading-none text-sky-600 shadow"
                  onPointerDown={(e) => begin(e, s, "rotate")}
                  onPointerMove={move}
                  onPointerUp={end}
                  onPointerCancel={end}
                >
                  ⟳
                </button>
                <button
                  type="button"
                  aria-label="Resize sticker"
                  className="absolute -bottom-3 -right-3 h-6 w-6 cursor-nwse-resize touch-none rounded-full border-2 border-sky-500 bg-white shadow"
                  onPointerDown={(e) => begin(e, s, "resize")}
                  onPointerMove={move}
                  onPointerUp={end}
                  onPointerCancel={end}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
