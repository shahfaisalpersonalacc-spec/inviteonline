"use client";

import { useEffect, useState } from "react";
import { Lock, Trash2 } from "lucide-react";
import { api, inviteUrl } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Spinner from "@/components/ui/Spinner";
import { EVENT_TYPES } from "@/data/eventTypes";
import { AudioInput, Field, ImageInput, Select, Text, TextArea, Toggle } from "./fields";
import MusicLibrary from "./MusicLibrary";
import { musicTrack } from "@/data/music";

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,58}[a-z0-9])$/;

export default function SettingsPanel({ inv, set, saveNow, savedAt, onDelete }) {
  const toast = useToast();
  const [slug, setSlug] = useState(inv.slug);
  const [slugState, setSlugState] = useState("same"); // same | checking | ok | taken | invalid
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(""); // "slug" | "password" | "remove"

  useEffect(() => setSlug(inv.slug), [inv.slug]);

  useEffect(() => {
    if (slug === inv.slug) return setSlugState("same");
    if (!SLUG_RE.test(slug)) return setSlugState("invalid");
    setSlugState("checking");
    const t = setTimeout(() => {
      api(`/invitations/slug-available/${slug}?exclude=${inv._id}`)
        .then((d) => setSlugState(d.available ? "ok" : "taken"))
        .catch(() => setSlugState("invalid"));
    }, 400);
    return () => clearTimeout(t);
  }, [slug, inv.slug, inv._id]);

  async function saveSlug() {
    setPending("slug");
    try {
      await saveNow({ slug });
      toast("Link updated");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setPending("");
    }
  }

  async function savePassword(value) {
    setPending(value ? "password" : "remove");
    try {
      await saveNow({ password: value });
      setPassword("");
      toast(value ? "Password set — share it with your guests" : "Password removed");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setPending("");
    }
  }

  const music = inv.music || {};

  return (
    <div className="space-y-7">
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-ink">Publishing</h3>
        <Toggle
          label={inv.published ? "Published — anyone with the link can view" : "Draft — link is hidden"}
          hint="Turn off to temporarily hide your invitation."
          checked={inv.published}
          onChange={(v) => set({ published: v })}
        />
        <Field label="Your invitation link" hint="Lowercase letters, numbers and hyphens.">
          <div className="flex items-center overflow-hidden rounded-xl border border-ink/15 bg-white focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100">
            <span className="hidden shrink-0 bg-cream px-3 py-2.5 text-xs text-ink-500 sm:block">/i/</span>
            <input
              className="w-full min-w-0 bg-transparent px-3 py-2.5 text-sm outline-none"
              value={slug}
              maxLength={60}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2 text-xs">
            <span
              className={
                { ok: "text-green-600", taken: "text-red-600", invalid: "text-red-600", checking: "text-ink-500", same: "text-ink-500" }[slugState]
              }
            >
              {{ ok: "Available", taken: "Already taken", invalid: "3–60 characters, can't start or end with -", checking: "Checking…", same: inviteUrl(inv.slug) }[slugState]}
            </span>
            {slugState === "ok" && (
              <button className="btn-primary !px-3 !py-1 !text-xs" onClick={saveSlug} disabled={pending === "slug"}>
                {pending === "slug" && <Spinner className="h-3 w-3" />} Save link
              </button>
            )}
          </div>
          {slugState === "ok" && <p className="mt-1 text-xs text-amber-600">Note: the old link will stop working.</p>}
        </Field>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-ink">Details</h3>
        <Text label="Invitation name" value={inv.title} onChange={(v) => set({ title: v })} maxLength={120} />
        <Select label="Event type" value={inv.eventType} onChange={(v) => set({ eventType: v })} options={EVENT_TYPES.map((e) => ({ value: e.id, label: e.label }))} />
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-ink">Link preview (WhatsApp, Facebook…)</h3>
        <LinkPreview inv={inv} savedAt={savedAt} />
        <ImageInput label="Preview image" hint="Optional. Without it, the cover photo is used, or a card made from your names and date." value={inv.coverImage} onChange={(v) => set({ coverImage: v })} />
        <TextArea label="Preview description" rows={2} maxLength={300} value={inv.description} onChange={(v) => set({ description: v })} placeholder="Join us to celebrate…" />
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-ink">Background music</h3>
        <Toggle label="Play music" hint="Plays softly once guests open the invitation; they can pause anytime." checked={music.enabled} onChange={(v) => set({ music: { ...music, enabled: v } })} />
        <MusicLibrary eventType={inv.eventType} value={music.url} onPick={(t) => set({ music: { ...music, url: t.src, title: t.title, enabled: true } })} />
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">Or your own song</p>
        {/* a library track is shown in the list above, so this box is only for the user's own file or link */}
        <AudioInput value={musicTrack(music.url) ? "" : music.url} onChange={(v) => set({ music: { ...music, url: v, enabled: v ? true : music.enabled } })} />
        <Text label="Song title (optional)" value={music.title} onChange={(v) => set({ music: { ...music, title: v } })} maxLength={120} />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-ink">Password protection</h3>
        <p className="text-xs text-ink-500">{inv.hasPassword ? (<span className="inline-flex items-center gap-1.5 font-semibold text-ink"><Lock className="h-3.5 w-3.5" /> This invitation is password protected.</span>) : "Anyone with the link can view. Add a password to keep it private."}</p>
        <div className="flex gap-2">
          <input className="input" type="text" minLength={4} maxLength={64} placeholder={inv.hasPassword ? "New password" : "Set a password"} value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn-primary shrink-0 !py-2" disabled={password.length < 4 || pending === "password"} onClick={() => savePassword(password)}>
            {pending === "password" && <Spinner className="h-4 w-4" />} Save
          </button>
        </div>
        {inv.hasPassword && (
          <button className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:underline disabled:opacity-60" disabled={pending === "remove"} onClick={() => savePassword(null)}>
            {pending === "remove" && <Spinner className="h-3 w-3" />} Remove password
          </button>
        )}
      </section>

      <section className="rounded-2xl border border-red-100 bg-red-50/50 p-4">
        <h3 className="text-sm font-bold text-red-700">Danger zone</h3>
        <p className="mt-1 text-xs text-red-600/80">Deleting removes the invitation, all RSVPs and wishes. This can&apos;t be undone.</p>
        <button className="btn-danger mt-3 !py-2 !text-xs" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" /> Delete invitation
        </button>
      </section>
    </div>
  );
}

// What a shared link looks like: the same image and text the public page gives WhatsApp (see app/i/[slug]).
function LinkPreview({ inv, savedAt }) {
  const hero = inv.sections?.find((x) => x.type === "hero")?.data || {};
  // the generated card reads the saved invitation, so it's reloaded after each save
  const image = inv.coverImage || hero.image || `/i/${encodeURIComponent(inv.slug)}/preview-image?v=${savedAt || 0}`;
  const [failed, setFailed] = useState("");
  const description = inv.description || hero.tagline || "You're invited! Open to see all the details.";
  return (
    <div className="overflow-hidden rounded-xl bg-[#e7f6dd] p-1.5 ring-1 ring-ink/10 dark:bg-[#0b3b33]">
      <div className="overflow-hidden rounded-lg bg-white/70">
        {failed === image ? (
          <p className="grid aspect-[1200/630] place-items-center px-4 text-center text-xs text-ink-500">The preview image appears once the invitation is published.</p>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="Link preview image" onError={() => setFailed(image)} className="aspect-[1200/630] w-full bg-ink/5 object-cover" />
        )}
        <div className="px-3 py-2">
          <p className="truncate text-[13px] font-semibold text-ink">{inv.title}</p>
          <p className="line-clamp-2 text-xs text-ink-500">{description}</p>
          <p className="mt-0.5 truncate text-[11px] text-ink-500/80">{new URL(inviteUrl(inv.slug)).host}</p>
        </div>
      </div>
    </div>
  );
}
