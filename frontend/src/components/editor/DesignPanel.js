"use client";

import { Moon, Play, Sun } from "lucide-react";
import { ANIMATIONS, ENTRY_STYLES, FONTS, GRADIENTS, PATTERNS, SEAL_COLORS, SEAL_ICONS, THEMES, backgroundCss, googleFontsHref } from "@/data/themes";
import WaxSeal from "@/components/invite/entry/WaxSeal";
import { ColorInput, ImageInput, Select, Text, Toggle } from "./fields";

function Group({ title, children, action }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <p className="label !mb-0">{title}</p>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function DesignPanel({ theme, onChange, onPreviewEntry }) {
  const set = (patch) => onChange({ ...theme, ...patch });
  const entry = ENTRY_STYLES.find((e) => e.id === theme.entryStyle) || ENTRY_STYLES[3];
  const isDoor = entry.kind === "door";

  return (
    <div className="space-y-8">
      {/* Load every font so presets and dropdown previews render correctly. */}
      <link rel="stylesheet" href={googleFontsHref(FONTS.map((f) => f.name))} precedence="default" />

      <Group title="Appearance">
        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-ink/[0.06] p-1" role="radiogroup" aria-label="Light or dark invitation">
          {[
            ["light", "Light", Sun],
            ["dark", "Dark", Moon],
          ].map(([v, label, Icon]) => {
            const on = (theme.mode || "light") === v;
            return (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => set({ mode: v })}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${on ? "bg-white text-ink shadow" : "text-ink-500"}`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-ink-500">Dark mode turns any theme into a deep evening version with glowing accents.</p>
      </Group>

      <Group
        title="Entrance"
        action={
          <button type="button" onClick={onPreviewEntry} className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold text-cream">
            <Play className="h-3 w-3" /> Preview opening
          </button>
        }
      >
        <Toggle label="Show an entrance screen" hint="Guests open an envelope or doors first. It also starts your music." checked={theme.envelope !== false} onChange={(v) => set({ envelope: v })} />
        {theme.envelope !== false && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {ENTRY_STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => set({ entryStyle: s.id })}
                className={`overflow-hidden rounded-2xl border text-left transition ${theme.entryStyle === s.id ? "border-ink ring-2 ring-gold/50" : "border-ink/10 hover:border-ink/30"}`}
              >
                <div className="relative h-14" style={{ background: s.swatch }}>
                  {s.kind === "door" ? (
                    <div className="absolute bottom-0 left-1/2 h-11 w-8 -translate-x-1/2 rounded-t-full" style={{ background: s.id === "door-royal" ? "#4a2f22" : "#7fa08f", boxShadow: "0 0 0 3px rgba(255,255,255,.55)" }} />
                  ) : (
                    <div className="absolute inset-0" style={{ background: "rgba(0,0,0,.14)", clipPath: "polygon(0 0, 100% 0, 50% 62%)" }} />
                  )}
                </div>
                <p className="truncate px-2.5 py-2 text-xs font-semibold text-ink">{s.label}</p>
              </button>
            ))}
          </div>
        )}
      </Group>

      {theme.envelope !== false && !isDoor && (
        <Group title="Wax seal">
          <div className="flex items-start gap-4">
            <WaxSeal color={theme.sealColor} icon={theme.sealIcon} monogram={theme.monogram} className="w-20 shrink-0" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {SEAL_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set({ sealColor: c })}
                    className={`h-7 w-7 rounded-full border-2 ${theme.sealColor === c ? "border-ink" : "border-white shadow"}`}
                    style={{ background: c }}
                    aria-label={`Seal colour ${c}`}
                  />
                ))}
              </div>
              <Select label="Seal emblem" value={theme.sealIcon || "monogram"} onChange={(v) => set({ sealIcon: v })} options={SEAL_ICONS.map((s) => ({ value: s.id, label: s.label }))} />
            </div>
          </div>
          {(theme.sealIcon || "monogram") === "monogram" && (
            <div className="mt-3">
              <Text label="Monogram (up to 6 letters)" value={theme.monogram} maxLength={6} onChange={(v) => set({ monogram: v })} placeholder="A&A" />
            </div>
          )}
        </Group>
      )}

      {theme.envelope !== false && isDoor && (
        <Group title="Door colour">
          <div className="flex flex-wrap gap-2">
            {["#8fae9f", "#4f7f7c", "#8fa9c2", "#c98b93", "#e8dcc6", "#b4471a", "#5a3a2a", "#263a5a", "#2b2b2b"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set({ doorColor: c })}
                className={`h-9 w-9 rounded-xl border-2 ${(theme.doorColor || "#8fae9f") === c ? "border-ink ring-2 ring-gold/50" : "border-white shadow"}`}
                style={{ background: c }}
                aria-label={`Door colour ${c}`}
              />
            ))}
          </div>
          <p className="mt-2 text-[11px] text-ink-500">Flowers in the garden scene are tinted with your theme&apos;s primary colour.</p>
        </Group>
      )}

      <Group title="Theme presets">
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(THEMES).map(([id, t]) => {
            const { label, ...values } = t;
            return (
              <button
                key={id}
                type="button"
                onClick={() => set({ ...values, preset: id, bgType: "color", bgValue: "" })}
                className={`overflow-hidden rounded-xl border text-left transition ${theme.preset === id ? "border-ink ring-2 ring-gold/50" : "border-ink/10 hover:border-ink/30"}`}
              >
                <div className="grid h-12 place-items-center" style={{ background: t.background, color: t.primary, fontFamily: `"${t.fontHeading}", cursive` }}>
                  <span className="text-lg">Aa</span>
                </div>
                <div className="flex items-center gap-1 px-1.5 py-1">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.primary }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.secondary }} />
                  <span className="truncate text-[10px] font-semibold">{label}</span>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-ink-500">A preset also sets a matching entrance and seal.</p>
      </Group>

      <Group title="Colours">
        <div className="grid grid-cols-2 gap-3">
          <ColorInput label="Primary" value={theme.primary} onChange={(v) => set({ primary: v })} />
          <ColorInput label="Accent" value={theme.secondary} onChange={(v) => set({ secondary: v })} />
          <ColorInput label="Background" value={theme.background} onChange={(v) => set({ background: v })} />
          <ColorInput label="Cards" value={theme.surface} onChange={(v) => set({ surface: v })} />
          <ColorInput label="Text" value={theme.text} onChange={(v) => set({ text: v })} />
        </div>
      </Group>

      <Group title="Fonts">
        <div className="grid grid-cols-1 gap-3">
          <Select label="Headings" value={theme.fontHeading} onChange={(v) => set({ fontHeading: v })} options={FONTS.map((f) => ({ value: f.name, label: `${f.name} (${f.kind})` }))} />
          <Select label="Body text" value={theme.fontBody} onChange={(v) => set({ fontBody: v })} options={FONTS.map((f) => ({ value: f.name, label: `${f.name} (${f.kind})` }))} />
        </div>
      </Group>

      <Group title="Background">
        <div className="mb-3 grid grid-cols-4 gap-1 rounded-xl bg-ink/[0.06] p-1 text-xs font-semibold">
          {["color", "gradient", "pattern", "image"].map((t) => (
            <button key={t} type="button" onClick={() => set({ bgType: t, bgValue: t === "gradient" ? GRADIENTS[0] : t === "pattern" ? "dots" : "" })} className={`rounded-lg py-1.5 capitalize ${theme.bgType === t ? "bg-white shadow" : "text-ink-500"}`}>
              {t === "color" ? "Plain" : t}
            </button>
          ))}
        </div>
        {theme.bgType === "gradient" && (
          <div className="grid grid-cols-5 gap-2">
            {GRADIENTS.map((g) => (
              <button key={g} type="button" onClick={() => set({ bgValue: g })} className={`h-12 rounded-xl border ${theme.bgValue === g ? "ring-2 ring-ink" : "border-ink/10"}`} style={{ background: g }} aria-label="Gradient" />
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
                className={`flex h-14 items-end justify-center rounded-xl border pb-1 text-[10px] font-semibold ${theme.bgValue === p.id ? "ring-2 ring-ink" : "border-ink/10"}`}
                style={{ background: backgroundCss({ ...theme, bgType: "pattern", bgValue: p.id }) }}
              >
                <span className="rounded bg-white/85 px-1">{p.label}</span>
              </button>
            ))}
          </div>
        )}
        {theme.bgType === "image" && <ImageInput value={theme.bgValue} onChange={(v) => set({ bgValue: v })} hint="A soft, light image works best behind text." />}
      </Group>

      <Select label="Animation" value={theme.animation || "none"} onChange={(v) => set({ animation: v })} options={ANIMATIONS.map((a) => ({ value: a.id, label: a.label }))} />
    </div>
  );
}
