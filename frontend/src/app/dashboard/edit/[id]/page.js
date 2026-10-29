"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, inviteUrl } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Spinner, { FullPageSpinner } from "@/components/ui/Spinner";
import LogoLoader from "@/components/ui/LogoLoader";
import EditorTip from "@/components/editor/EditorTip";
import DeleteInvitationDialog from "@/components/site/DeleteInvitationDialog";
import InvitationRenderer from "@/components/invite/InvitationRenderer";
import ShareSheet from "@/components/invite/ShareSheet";
import SectionsPanel from "@/components/editor/SectionsPanel";
import DesignPanel from "@/components/editor/DesignPanel";
import StickersPanel from "@/components/editor/StickersPanel";
import SettingsPanel from "@/components/editor/SettingsPanel";
import StickerToolbar from "@/components/editor/StickerToolbar";
import { newId } from "@/data/sections";
import { templateTheme } from "@/data/templates";
import EntryScreen from "@/components/invite/entry/EntryScreen";
import { ArrowLeft, ExternalLink, FileText, Monitor, Palette, Pencil, Settings2, Share2, Smartphone, Sticker, Users } from "lucide-react";

const TABS = [
  { id: "content", label: "Content", Icon: FileText },
  { id: "design", label: "Design", Icon: Palette },
  { id: "stickers", label: "Stickers", Icon: Sticker },
  { id: "settings", label: "Settings", Icon: Settings2 },
];

// Fields that autosave; slug & password are saved explicitly from Settings.
const AUTOSAVE_FIELDS = ["title", "eventType", "description", "coverImage", "theme", "sections", "stickers", "music", "published"];
// (a blank title isn't sent: the server requires one, and it would reject the whole save)
// Scroll sync: mark a pane as being moved by code, so its scroll events are ignored for a moment.
const lockPane = (ref, pane) => {
  ref.current = { pane, until: performance.now() + 900 };
};

const pick = (o) => Object.fromEntries(AUTOSAVE_FIELDS.filter((k) => k !== "title" || o.title?.trim()).map((k) => [k, o[k]]));

export default function EditorPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  // arriving from "Create": the same loader continues (read once; the ?new=1 is removed after loading)
  const [justCreated] = useState(() => searchParams.get("new") === "1");
  const router = useRouter();
  const toast = useToast();

  const [inv, setInv] = useState(null);
  const [tab, setTab] = useState("content");
  const [status, setStatus] = useState("saved"); // saved | unsaved | saving | error
  const [selected, setSelected] = useState(null);
  const [targetSection, setTargetSection] = useState("");
  const [showTip, setShowTip] = useState(justCreated); // first visit after creating: point out where editing starts
  const [mobileView, setMobileView] = useState(justCreated ? "preview" : "edit"); // edit | preview (phones open a new invitation on its preview)
  const [device, setDevice] = useState("phone"); // phone | desktop
  const [shareOpen, setShareOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [previewEntry, setPreviewEntry] = useState(0); // >0 shows the entrance over the preview

  const latest = useRef(null);
  const timer = useRef(null);
  const inFlight = useRef(false);
  const pending = useRef(false);
  const retries = useRef(0);
  const retryRef = useRef(null);
  const previewRef = useRef(null);
  const panelRef = useRef(null);
  // Content tab: the section open in the panel, kept in step with the preview (see the scroll sync below)
  const [openSection, setOpenSection] = useState(null);
  const syncLock = useRef({ pane: "", until: 0 }); // the pane being scrolled by code, ignored for a moment
  const lastSynced = useRef("");

  useEffect(() => {
    api(`/invitations/${id}`)
      .then((d) => {
        setInv(d.invitation);
        latest.current = d.invitation;
        if (justCreated) window.history.replaceState(null, "", window.location.pathname); // a reload shouldn't say "preparing"
        setTargetSection(d.invitation.sections[0]?.id || "");
        setOpenSection(d.invitation.sections[0]?.id || null);
      })
      .catch((e) => {
        toast(e.message, "error");
        router.replace("/dashboard");
      });
  }, [id, router, toast, justCreated]);

  const flush = useCallback(async () => {
    if (inFlight.current) {
      pending.current = true;
      return;
    }
    inFlight.current = true;
    setStatus("saving");
    try {
      await api(`/invitations/${id}`, { method: "PUT", body: pick(latest.current) });
      retries.current = 0;
      setStatus(pending.current ? "unsaved" : "saved");
    } catch (e) {
      setStatus("error");
      // No status = the server couldn't be reached (e.g. restarting): retry quietly a few times.
      if (!e.status && retries.current < 5) {
        if (retries.current === 0) toast(e.message, "error");
        retries.current += 1;
        clearTimeout(timer.current);
        timer.current = setTimeout(() => retryRef.current?.(), 2000 * retries.current);
      } else {
        retries.current = 0;
        toast(e.message, "error");
      }
    } finally {
      inFlight.current = false;
      if (pending.current) {
        pending.current = false;
        flush();
      }
    }
  }, [id, toast]);
  useEffect(() => {
    retryRef.current = flush;
  }, [flush]);

  // Update local state and schedule an autosave.
  const set = useCallback(
    (patch) => {
      setInv((cur) => {
        const next = { ...cur, ...(typeof patch === "function" ? patch(cur) : patch) };
        latest.current = next;
        return next;
      });
      setStatus("unsaved");
      clearTimeout(timer.current);
      timer.current = setTimeout(flush, 800);
    },
    [flush]
  );

  // Immediate save for slug/password; merges server response.
  const saveNow = useCallback(
    async (body) => {
      const d = await api(`/invitations/${id}`, { method: "PUT", body: { ...pick(latest.current), ...body } });
      setInv((cur) => {
        const next = { ...cur, slug: d.invitation.slug, hasPassword: d.invitation.hasPassword };
        latest.current = next;
        return next;
      });
    },
    [id]
  );

  useEffect(() => {
    const warn = (e) => {
      if (status === "unsaved" || status === "saving") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);

  // ----- stickers -----
  const updateSticker = useCallback((sid, patch) => set((cur) => ({ stickers: cur.stickers.map((s) => (s.id === sid ? { ...s, ...patch } : s)) })), [set]);

  const deleteSticker = useCallback(
    (sid) => {
      set((cur) => ({ stickers: cur.stickers.filter((s) => s.id !== sid) }));
      setSelected(null);
    },
    [set]
  );

  function addSticker(def) {
    const sectionId = targetSection || inv.sections[0]?.id;
    const n = inv.stickers.length;
    const st = {
      id: newId(),
      stickerId: def.id,
      sectionId,
      x: 20 + ((n * 17) % 60),
      y: 15 + ((n * 23) % 50),
      size: def.emoji ? 12 : 22,
      rotation: 0,
      opacity: 1,
      flip: false,
      zIndex: n + 1,
    };
    set((cur) => ({ stickers: [...cur.stickers, st] }));
    setSelected(st.id);
    setMobileView("preview");
    setTimeout(() => focusSection(sectionId), 60);
  }

  function duplicateSticker() {
    const s = inv.stickers.find((x) => x.id === selected);
    if (!s) return;
    const copy = { ...s, id: newId(), x: Math.min(110, s.x + 6), y: Math.min(100, s.y + 4) };
    set((cur) => ({ stickers: [...cur.stickers, copy] }));
    setSelected(copy.id);
  }

  useEffect(() => {
    const onKey = (e) => {
      if (!selected) return;
      const tag = document.activeElement?.tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSticker(selected);
      }
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, deleteSticker]);

  // Scroll the preview to a section. `onlyIfHidden`: leave it alone when the section is already on screen
  // (clicking from field to field in one section shouldn't keep jumping the preview).
  function focusSection(sid, { onlyIfHidden = false } = {}) {
    const root = previewRef.current;
    const el = root?.querySelector(`[data-section-id="${sid}"]`);
    if (!root || !el) return;
    const box = root.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (onlyIfHidden && r.bottom > box.top + 40 && r.top < box.bottom - 40) return;
    lastSynced.current = sid;
    lockPane(syncLock, "preview");
    root.scrollTo({ top: r.top - box.top + root.scrollTop - 12, behavior: "smooth" });
  }

  // Keep the panel and the preview in step on the Content tab: scrolling either one brings the other to the
  // same section. The pane moved by code is ignored briefly so the two don't push each other back and forth.
  const loaded = !!inv;
  useEffect(() => {
    if (tab !== "content" || !loaded) return;
    const pv = previewRef.current;
    const pn = panelRef.current;
    if (!pv || !pn) return;
    const locked = (pane) => syncLock.current.pane === pane && performance.now() < syncLock.current.until;
    let t1, t2;
    const onPreview = () => {
      if (locked("preview")) return;
      clearTimeout(t1);
      t1 = setTimeout(() => {
        const r = pv.getBoundingClientRect();
        if (!r.height) return; // hidden (phone, edit view)
        const line = r.top + r.height * 0.3;
        const hit = [...pv.querySelectorAll("[data-section-id]")].find((el) => {
          const b = el.getBoundingClientRect();
          return b.top <= line && b.bottom > line;
        });
        const sid = hit?.dataset.sectionId;
        if (!sid || sid === lastSynced.current) return;
        lastSynced.current = sid;
        setOpenSection(sid);
        // after the card has opened, bring it to the top of the panel
        setTimeout(() => {
          const card = pn.querySelector(`[data-panel-section="${sid}"]`);
          if (!card) return;
          lockPane(syncLock, "panel");
          pn.scrollTo({ top: card.getBoundingClientRect().top - pn.getBoundingClientRect().top + pn.scrollTop - 8, behavior: "smooth" });
        }, 60);
      }, 160);
    };
    const onPanel = () => {
      if (locked("panel")) return;
      clearTimeout(t2);
      t2 = setTimeout(() => {
        const top = pn.getBoundingClientRect().top + 80;
        const card = [...pn.querySelectorAll("[data-panel-section]")].find((c) => c.getBoundingClientRect().bottom > top);
        const sid = card?.dataset.panelSection;
        if (!sid || sid === lastSynced.current) return;
        const el = pv.querySelector(`[data-section-id="${sid}"]`);
        if (!el) return;
        lastSynced.current = sid;
        lockPane(syncLock, "preview");
        pv.scrollTo({ top: el.getBoundingClientRect().top - pv.getBoundingClientRect().top + pv.scrollTop - 12, behavior: "smooth" });
      }, 160);
    };
    pv.addEventListener("scroll", onPreview, { passive: true });
    pn.addEventListener("scroll", onPanel, { passive: true });
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      pv.removeEventListener("scroll", onPreview);
      pn.removeEventListener("scroll", onPanel);
    };
  }, [tab, loaded]);

  // the cover pill in the preview uploads straight into the cover section
  const setHeroPhoto = useCallback(
    (url) => set((cur) => ({ sections: cur.sections.map((s) => (s.type === "hero" ? { ...s, data: { ...s.data, image: url } } : s)) })),
    [set]
  );

  // throws on failure, so the dialog stays open and shows why
  async function removeInvitation() {
    await api(`/invitations/${id}`, { method: "DELETE" });
    clearTimeout(timer.current); // no autosave to a deleted invitation
    retryRef.current = null;
    toast("Invitation deleted");
    router.replace("/dashboard");
  }

  if (!inv) return justCreated ? <LogoLoader /> : <FullPageSpinner />;

  const selectedSticker = inv.stickers.find((s) => s.id === selected);
  const statusLabel = { saved: "All changes saved", unsaved: "Unsaved changes…", saving: "Saving…", error: "Not saved" }[status];

  return (
    <div className="flex h-[100dvh] flex-col bg-[#f1ece4]">
      {/* Top bar */}
      <header className="z-30 flex h-14 shrink-0 items-center gap-2 border-b border-ink/10 bg-white px-3 sm:px-4">
        <Link href="/dashboard" className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-semibold text-ink-500 hover:bg-ink/5 hover:text-ink" aria-label="Back to dashboard">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-[1.05rem] leading-tight text-ink">{inv.title}</p>
          <p className={`text-[11px] ${status === "error" ? "text-red-600" : "text-ink-500"}`}>
            {statusLabel}
            {status === "error" && (
              <button className="ml-1 underline" onClick={flush}>
                Retry
              </button>
            )}
          </p>
        </div>
        <div className="hidden items-center gap-1 rounded-full bg-ink/[0.06] p-1 lg:flex">
          {[
            ["phone", Smartphone],
            ["desktop", Monitor],
          ].map(([d, Icon]) => (
            <button key={d} onClick={() => setDevice(d)} className={`rounded-full px-3 py-1.5 ${device === d ? "bg-white text-ink shadow" : "text-ink-500"}`} aria-label={`${d} preview`}>
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
        {/* Edit / Preview switch lives in the top bar on small screens, so it never covers the invitation */}
        <div className="flex items-center gap-0.5 rounded-full bg-ink/[0.06] p-1 lg:hidden" role="tablist" aria-label="Editor view">
          {[
            ["edit", "Edit", Pencil],
            ["preview", "Preview", Smartphone],
          ].map(([v, label, Icon]) => (
            <button
              key={v}
              role="tab"
              data-tip={v === "edit" ? "edit" : undefined}
              aria-selected={mobileView === v}
              aria-label={label}
              onClick={() => {
                setMobileView(v);
                // phones: the preview opens where you were editing (once it's on screen)
                if (v === "preview" && tab === "content" && openSection) setTimeout(() => focusSection(openSection), 50);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold sm:px-3.5 ${mobileView === v ? "bg-ink text-cream shadow" : "text-ink-500"}`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <Link href={`/dashboard/${id}/guests`} className="btn-ghost hidden !px-3 !py-2 md:inline-flex">
          <Users className="h-4 w-4" /> Guests
        </Link>
        <a href={`/i/${inv.slug}`} target="_blank" rel="noopener noreferrer" className="btn-secondary !px-3 !py-2" aria-label="View live invitation">
          <ExternalLink className="h-4 w-4" />
          <span className="hidden sm:inline">View live</span>
        </a>
        <button onClick={() => setShareOpen(true)} className="btn-primary !px-3 !py-2">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Panel */}
        <aside className={`${mobileView === "edit" ? "flex" : "hidden"} w-full min-w-0 flex-col border-r border-ink/10 bg-white lg:flex lg:w-[420px] lg:shrink-0`}>
          <nav data-tip="tabs" className="grid shrink-0 grid-cols-4 border-b border-ink/[0.06]">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-col items-center gap-0.5 border-b-2 py-2.5 text-[11px] font-semibold transition ${tab === t.id ? "border-ink text-ink" : "border-transparent text-ink-500 hover:text-ink"}`}
              >
                <t.Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                {t.label}
              </button>
            ))}
          </nav>
          <div ref={panelRef} className="min-h-0 flex-1 overflow-y-auto p-4 pb-8 lg:pb-6">
            {tab === "content" && (
              <SectionsPanel
                sections={inv.sections}
                onChange={(sections) => set({ sections })}
                onFocusSection={focusSection}
                openId={openSection}
                onOpenChange={setOpenSection}
              />
            )}
            {tab === "design" && (
              <DesignPanel
                theme={inv.theme}
                onChange={(theme) => set({ theme })}
                eventType={inv.eventType}
                // a template restyles the page and moves the cover to its layout; content is untouched
                onApplyTemplate={(t) =>
                  set((cur) => ({
                    theme: { ...cur.theme, ...(t ? templateTheme(t) : { template: "" }) },
                    sections: t ? cur.sections.map((s) => (s.type === "hero" ? { ...s, data: { ...s.data, layout: t.heroLayout, foil: !!t.design.foil } } : s)) : cur.sections,
                  }))
                }
                onPreviewEntry={() => {
                  setMobileView("preview");
                  setPreviewEntry((n) => n + 1);
                }}
              />
            )}
            {tab === "stickers" && (
              <StickersPanel sections={inv.sections} targetSection={targetSection} setTargetSection={setTargetSection} onAdd={addSticker} count={inv.stickers.length} />
            )}
            {tab === "settings" && <SettingsPanel inv={inv} set={set} saveNow={saveNow} onDelete={() => setConfirmDelete(true)} />}
          </div>
        </aside>

        {/* Preview */}
        <main className={`${mobileView === "preview" ? "flex" : "hidden"} relative min-w-0 flex-1 justify-center lg:flex lg:p-6`}>
          <div
            className={`relative flex h-full w-full flex-col overflow-hidden bg-white lg:shadow-2xl ${
              device === "phone" ? "lg:max-w-[400px] lg:rounded-[2.2rem] lg:border-[10px] lg:border-ink" : "lg:max-w-[1100px] lg:rounded-2xl"
            }`}
          >
            <div ref={previewRef} className="no-scrollbar relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
              <InvitationRenderer
                invitation={inv}
                mode="editor"
                selectedStickerId={selected}
                onSelectSticker={setSelected}
                onStickerChange={updateSticker}
                onHeroPhoto={setHeroPhoto}
              />
            </div>
            {previewEntry > 0 && (
              <EntryScreen
                key={previewEntry}
                contained
                theme={inv.theme}
                title={inv.sections.find((s) => s.type === "hero")?.data?.title || inv.title}
                subtitle={inv.sections.find((s) => s.type === "hero")?.data?.tagline}
                date={inv.sections.find((s) => s.type === "hero")?.data?.date}
                onOpened={() => setPreviewEntry(0)}
              />
            )}
            <StickerToolbar
              sticker={selectedSticker}
              sections={inv.sections}
              onChange={(patch) => updateSticker(selected, patch)}
              onDelete={() => deleteSticker(selected)}
              onDuplicate={duplicateSticker}
              onClose={() => setSelected(null)}
            />
          </div>
        </main>
      </div>

      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} url={inviteUrl(inv.slug)} title={inv.title} />
      {showTip && (
        <EditorTip
          onClose={() => setShowTip(false)}
          onEdit={() => {
            setMobileView("edit");
            setShowTip(false);
          }}
        />
      )}
      <DeleteInvitationDialog open={confirmDelete} title={inv.title} onClose={() => setConfirmDelete(false)} onConfirm={removeInvitation} />
    </div>
  );
}
