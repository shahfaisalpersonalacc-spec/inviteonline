"use client";

import { useRef, useState } from "react";
import { uploadFile } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Spinner from "@/components/ui/Spinner";
import { fromInputDate, toInputDate, toInputDateTime } from "@/lib/format";

export function Field({ label, hint, children }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      {children}
      {hint && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}

export function Text({ label, hint, value, onChange, placeholder, maxLength = 200, type = "text" }) {
  return (
    <Field label={label} hint={hint}>
      <input type={type} className="input" value={value ?? ""} maxLength={maxLength} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function TextArea({ label, hint, value, onChange, placeholder, rows = 3, maxLength = 2000 }) {
  return (
    <Field label={label} hint={hint}>
      <textarea className="input resize-y" rows={rows} value={value ?? ""} maxLength={maxLength} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function DateTime({ label, hint, value, onChange, dateOnly = false }) {
  return (
    <Field label={label} hint={hint}>
      <input
        type={dateOnly ? "date" : "datetime-local"}
        className="input"
        value={dateOnly ? toInputDate(value) : toInputDateTime(value)}
        onChange={(e) => onChange(fromInputDate(e.target.value))}
      />
    </Field>
  );
}

export function Toggle({ label, checked, onChange, hint }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-medium text-zinc-800">{label}</span>
        {hint && <span className="block text-xs text-zinc-500">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={!!checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-brand-600" : "bg-zinc-300"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </label>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function ColorInput({ label, value, onChange }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-1.5">
        <input type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} className="h-8 w-10 cursor-pointer rounded-lg border-0 bg-transparent p-0" />
        <input
          className="w-full bg-transparent text-sm uppercase outline-none"
          value={value || ""}
          maxLength={7}
          onChange={(e) => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && e.target.value.length === 7 && onChange(e.target.value)}
        />
      </div>
    </Field>
  );
}

function useUpload(kind) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  async function upload(files) {
    setBusy(true);
    try {
      const urls = [];
      for (const f of files) urls.push((await uploadFile(kind, f)).url);
      return urls;
    } catch (e) {
      toast(e.message, "error");
      return [];
    } finally {
      setBusy(false);
    }
  }
  return { busy, upload };
}

export function ImageInput({ label, hint, value, onChange, shape = "rect" }) {
  const input = useRef(null);
  const { busy, upload } = useUpload("image");
  const [showUrl, setShowUrl] = useState(false);

  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => input.current?.click()}
          className={`relative grid shrink-0 place-items-center overflow-hidden border-2 border-dashed border-zinc-200 bg-zinc-50 text-zinc-400 hover:border-brand-300 ${shape === "circle" ? "h-16 w-16 rounded-full" : "h-16 w-24 rounded-xl"}`}
        >
          {busy ? (
            <Spinner className="h-5 w-5 text-brand-600" />
          ) : value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xl">＋</span>
          )}
        </button>
        <div className="flex flex-wrap gap-1.5 text-xs">
          <button type="button" className="rounded-lg bg-zinc-100 px-2.5 py-1.5 font-medium hover:bg-zinc-200" onClick={() => input.current?.click()}>
            {value ? "Change" : "Upload"}
          </button>
          {value && (
            <button type="button" className="rounded-lg px-2.5 py-1.5 font-medium text-red-600 hover:bg-red-50" onClick={() => onChange("")}>
              Remove
            </button>
          )}
          <button type="button" className="rounded-lg px-2.5 py-1.5 font-medium text-zinc-500 hover:bg-zinc-100" onClick={() => setShowUrl((s) => !s)}>
            Use URL
          </button>
        </div>
      </div>
      {showUrl && <input className="input mt-2" placeholder="https://…" value={value || ""} onChange={(e) => onChange(e.target.value)} />}
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          const [url] = await upload([...e.target.files]);
          e.target.value = "";
          if (url) onChange(url);
        }}
      />
    </Field>
  );
}

export function GalleryInput({ value = [], onChange }) {
  const input = useRef(null);
  const { busy, upload } = useUpload("image");
  const move = (i, d) => {
    const next = [...value];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <Field label={`Photos (${value.length})`} hint="Upload several at once. Use arrows to reorder.">
      <div className="grid grid-cols-3 gap-2">
        {value.map((src, i) => (
          <div key={src + i} className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/50 p-1 text-xs text-white">
              <button type="button" onClick={() => move(i, -1)} aria-label="Move left">
                ◀
              </button>
              <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Remove">
                ✕
              </button>
              <button type="button" onClick={() => move(i, 1)} aria-label="Move right">
                ▶
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-zinc-200 text-zinc-400 hover:border-brand-300 hover:text-brand-600"
        >
          {busy ? <Spinner className="h-5 w-5" /> : <span className="text-center text-xs">＋<br />Add photos</span>}
        </button>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={async (e) => {
          const urls = await upload([...e.target.files].slice(0, 20));
          e.target.value = "";
          if (urls.length) onChange([...value, ...urls]);
        }}
      />
    </Field>
  );
}

export function AudioInput({ value, onChange }) {
  const input = useRef(null);
  const { busy, upload } = useUpload("audio");
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn-secondary !py-2 !text-xs" onClick={() => input.current?.click()} disabled={busy}>
          {busy ? <Spinner className="h-4 w-4" /> : "🎵"} {value ? "Replace song" : "Upload song (MP3)"}
        </button>
        {value && (
          <button type="button" className="text-xs font-medium text-red-600" onClick={() => onChange("")}>
            Remove
          </button>
        )}
      </div>
      {value && <audio src={value} controls className="w-full" />}
      <input className="input" placeholder="…or paste a direct MP3 link" value={value || ""} onChange={(e) => onChange(e.target.value)} />
      <input
        ref={input}
        type="file"
        accept="audio/*"
        hidden
        onChange={async (e) => {
          const [url] = await upload([...e.target.files]);
          e.target.value = "";
          if (url) onChange(url);
        }}
      />
    </div>
  );
}

// Generic editor for arrays of objects (events, people, schedule items…).
export function ListEditor({ label, items = [], onChange, newItem, renderItem, itemLabel = "item", max = 20 }) {
  const update = (i, patch) => onChange(items.map((it, k) => (k === i ? { ...it, ...patch } : it)));
  const remove = (i) => onChange(items.filter((_, k) => k !== i));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div>
      {label && <p className="label">{label}</p>}
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
              <span className="font-semibold">
                {itemLabel} {i + 1}
              </span>
              <span className="flex gap-1">
                <button type="button" className="rounded px-1.5 hover:bg-zinc-200" onClick={() => move(i, -1)} aria-label="Move up">
                  ↑
                </button>
                <button type="button" className="rounded px-1.5 hover:bg-zinc-200" onClick={() => move(i, 1)} aria-label="Move down">
                  ↓
                </button>
                <button type="button" className="rounded px-1.5 text-red-600 hover:bg-red-50" onClick={() => remove(i)} aria-label="Remove">
                  ✕
                </button>
              </span>
            </div>
            <div className="space-y-3">{renderItem(it, (patch) => update(i, patch))}</div>
          </div>
        ))}
      </div>
      {items.length < max && (
        <button type="button" onClick={() => onChange([...items, newItem()])} className="mt-3 w-full rounded-xl border-2 border-dashed border-zinc-200 py-2.5 text-sm font-medium text-zinc-500 hover:border-brand-300 hover:text-brand-600">
          ＋ Add {itemLabel.toLowerCase()}
        </button>
      )}
    </div>
  );
}
