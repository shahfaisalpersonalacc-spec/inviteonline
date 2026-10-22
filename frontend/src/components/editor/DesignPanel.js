"use client";

import { ANIMATIONS, FONTS, GRADIENTS, PATTERNS, THEMES, backgroundCss, googleFontsHref } from "@/data/themes";
import { ColorInput, ImageInput, Select, Toggle } from "./fields";

export default function DesignPanel({ theme, onChange }) {
  const set = (patch) => onChange({ ...theme, ...patch });

  return (
    <div className="space-y-7">
      {/* Load every font so presets and dropdown previews render correctly. */}
      <link rel="stylesheet" href={googleFontsHref(FONTS.map((f) => f.name))} precedence="default" />
      <div>
        <p className="label">Theme presets</p>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(THEMES).map(([id, t]) => {
            const { label, ...values } = t;
            return (
              <button
                key={id}
                type="button"
                onClick={() => set({ ...values, preset: id, bgType: "color", bgValue: "" })}
                className={`overflow-hidden rounded-xl border text-left transition ${theme.preset === id ? "border-brand-500 ring-2 ring-brand-200" : "border-zinc-200 hover:border-zinc-300"}`}
              >
                <div className="grid h-12 place-items-center" style={{ background: t.background, color: t.primary, fontFamily: `"${t.fontHeading}", cursive` }}>
                  <span className="text-lg">Aa</span>
                </div>
                <div className="flex items-center gap-1 px-1.5 py-1">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.primary }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.secondary }} />
                  <span className="truncate text-[10px] font-medium">{label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="label">Colours</p>
        <div className="grid grid-cols-2 gap-3">
          <ColorInput label="Primary" value={theme.primary} onChange={(v) => set({ primary: v })} />
          <ColorInput label="Accent" value={theme.secondary} onChange={(v) => set({ secondary: v })} />
          <ColorInput label="Background" value={theme.background} onChange={(v) => set({ background: v })} />
          <ColorInput label="Cards" value={theme.surface} onChange={(v) => set({ surface: v })} />
          <ColorInput label="Text" value={theme.text} onChange={(v) => set({ text: v })} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Select label="Heading font" value={theme.fontHeading} onChange={(v) => set({ fontHeading: v })} options={FONTS.map((f) => ({ value: f.name, label: `${f.name} (${f.kind})` }))} />
        <Select label="Body font" value={theme.fontBody} onChange={(v) => set({ fontBody: v })} options={FONTS.map((f) => ({ value: f.name, label: `${f.name} (${f.kind})` }))} />
      </div>

      <div>
        <p className="label">Background</p>
        <div className="mb-3 grid grid-cols-4 gap-1 rounded-xl bg-zinc-100 p-1 text-xs font-semibold">
          {["color", "gradient", "pattern", "image"].map((t) => (
            <button key={t} type="button" onClick={() => set({ bgType: t, bgValue: t === "gradient" ? GRADIENTS[0] : t === "pattern" ? "dots" : "" })} className={`rounded-lg py-1.5 capitalize ${theme.bgType === t ? "bg-white shadow" : "text-zinc-500"}`}>
              {t === "color" ? "Plain" : t}
            </button>
          ))}
        </div>
        {theme.bgType === "gradient" && (
          <div className="grid grid-cols-5 gap-2">
            {GRADIENTS.map((g) => (
              <button key={g} type="button" onClick={() => set({ bgValue: g })} className={`h-12 rounded-xl border ${theme.bgValue === g ? "ring-2 ring-brand-500" : "border-zinc-200"}`} style={{ background: g }} aria-label="Gradient" />
            ))}
          </div>
        )}
        {theme.bgType === "pattern" && (
          <div className="grid grid-cols-4 gap-2">
            {PATTERNS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => set({ bgValue: p.id })}
                className={`flex h-14 items-end justify-center rounded-xl border pb-1 text-[10px] font-medium ${theme.bgValue === p.id ? "ring-2 ring-brand-500" : "border-zinc-200"}`}
                style={{ background: backgroundCss({ ...theme, bgType: "pattern", bgValue: p.id }) }}
              >
                <span className="rounded bg-white/80 px-1">{p.label}</span>
              </button>
            ))}
          </div>
        )}
        {theme.bgType === "image" && <ImageInput value={theme.bgValue} onChange={(v) => set({ bgValue: v })} hint="A soft, light image works best behind text." />}
      </div>

      <Select label="Animation" value={theme.animation || "none"} onChange={(v) => set({ animation: v })} options={ANIMATIONS.map((a) => ({ value: a.id, label: a.label }))} />
      <Toggle label="Envelope opening screen" hint="Guests tap 'Open Invitation' first — also starts the music." checked={theme.envelope !== false} onChange={(v) => set({ envelope: v })} />
    </div>
  );
}
