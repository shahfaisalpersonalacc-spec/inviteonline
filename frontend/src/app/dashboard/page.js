"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Copy, Eye, ListChecks, MailOpen, Pencil, Plus, Share2, Trash2, Users } from "lucide-react";
import { api, inviteUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";
import { FullPageSpinner } from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import ShareSheet from "@/components/invite/ShareSheet";
import WaxSeal from "@/components/invite/entry/WaxSeal";
import { eventTypeLabel } from "@/data/eventTypes";
import { THEMES } from "@/data/themes";
import { timeAgo } from "@/lib/format";
import { shade } from "@/lib/color";

// Mini envelope cover for an invitation card.
function Cover({ inv }) {
  const t = { ...THEMES.blush, ...inv.theme };
  const paper = t.primary;
  if (inv.coverImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={inv.coverImage} alt="" className="h-full w-full object-cover" />;
  }
  return (
    <div className="relative h-full w-full" style={{ background: shade(paper, -0.1) }}>
      <div className="absolute inset-0" style={{ background: shade(paper, -0.18), clipPath: "polygon(0 0, 0 100%, 51% 58%)" }} />
      <div className="absolute inset-0" style={{ background: shade(paper, -0.18), clipPath: "polygon(100% 0, 100% 100%, 49% 58%)" }} />
      <div className="absolute inset-0 drop-shadow-[0_4px_6px_rgba(0,0,0,.3)]">
        <div className="absolute inset-0" style={{ background: paper, clipPath: "polygon(0 0, 100% 0, 54% 56%, 50% 60%, 46% 56%)" }} />
      </div>
      <WaxSeal color={t.sealColor || "#c9a24a"} icon={t.sealIcon || "monogram"} monogram={t.monogram} className="absolute left-1/2 top-[58%] w-16 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [items, setItems] = useState(null);
  const [share, setShare] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    api("/invitations")
      .then((d) => setItems(d.invitations))
      .catch((e) => {
        toast(e.message, "error");
        setItems([]);
      });
  }, [toast]);

  async function duplicate(id) {
    try {
      const d = await api(`/invitations/${id}/duplicate`, { method: "POST" });
      toast("Invitation duplicated");
      router.push(`/dashboard/edit/${d.invitation._id}`);
    } catch (e) {
      toast(e.message, "error");
    }
  }

  async function remove() {
    try {
      await api(`/invitations/${toDelete._id}`, { method: "DELETE" });
      setItems((list) => list.filter((i) => i._id !== toDelete._id));
      toast("Invitation deleted");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setToDelete(null);
    }
  }

  if (!items) return <FullPageSpinner />;

  const totals = items.reduce((a, i) => ({ views: a.views + (i.views || 0), rsvps: a.rsvps + i.rsvpCount, wishes: a.wishes + i.wishCount }), { views: 0, rsvps: 0, wishes: 0 });

  return (
    <div>
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">
            <span className="h-px w-8 bg-brand-600/40" /> Your invitations
          </p>
          <h1 className="display mt-4 text-[2.6rem] leading-[1.02] sm:text-6xl">
            Welcome back, <em className="text-brand-600">{user.name.split(" ")[0]}.</em>
          </h1>
        </div>
      </div>

      <dl className="mt-10 grid grid-cols-3 divide-x divide-ink/10 border-y border-ink/10">
        {[
          ["Views", totals.views, Eye, "rsvps"],
          ["RSVPs", totals.rsvps, ListChecks, "rsvps"],
          ["Wishes", totals.wishes, MailOpen, "wishes"],
        ].map(([label, n, Icon, tab]) => (
          <div key={label} className="relative flex items-center gap-4 px-3 py-5 transition first:pl-0 hover:bg-ink/3 sm:px-6 sm:py-6 sm:first:pl-0">
            <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/10 text-brand-600 sm:grid">
              <Icon className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-500">{label}</dt>
              <dd className="mt-0.5 font-serif text-3xl leading-none text-ink sm:text-4xl">{n}</dd>
            </div>
            {/* Totals span every invitation; the guests page is per invitation, so open the latest one (list is newest-edited first). */}
            {items[0] && (
              <Link href={`/dashboard/${items[0]._id}/guests${tab === "wishes" ? "?tab=wishes" : ""}`} aria-label={`See ${label.toLowerCase()} on the guests page`} className="absolute inset-0" />
            )}
          </div>
        ))}
      </dl>

      {items.length === 0 ? (
        <div className="panel mt-10 flex flex-col items-center px-6 py-16 text-center">
          <WaxSeal color="#7a2430" icon="heart" className="w-24" />
          <h2 className="display mt-6 text-3xl sm:text-4xl">Your first invitation <em className="text-brand-600">awaits.</em></h2>
          <p className="mt-3 max-w-sm leading-relaxed text-ink/65">Pick an event and an entrance, make it yours and share one link with everyone.</p>
          <Link href="/dashboard/new" className="btn-primary mt-7">
            <Plus className="h-4 w-4" /> Create my first invitation
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((inv) => (
            <div key={inv._id} className="panel group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-36px_rgba(28,26,61,.5)]">
              <Link href={`/dashboard/edit/${inv._id}`} className="relative block aspect-[16/10] overflow-hidden" aria-label={`Edit ${inv.title}`}>
                <Cover inv={inv} />
                <span className={`chip absolute left-3 top-3 backdrop-blur ${inv.published ? "bg-emerald-50/90 text-emerald-700" : "bg-white/90 text-ink-500"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${inv.published ? "bg-emerald-500" : "bg-zinc-400"}`} />
                  {inv.published ? "Live" : "Draft"}
                </span>
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-medium text-ink-500">
                  {eventTypeLabel(inv.eventType)} · edited {timeAgo(inv.updatedAt)}
                </p>
                <h3 className="mt-1.5 truncate font-serif text-[1.45rem] leading-tight text-ink">{inv.title}</h3>
                <p className="mt-0.5 truncate text-xs font-medium text-brand-600">/i/{inv.slug}</p>
                <div className="mt-3 flex gap-4 text-xs font-semibold text-ink-500">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {inv.views || 0}</span>
                  <span className="flex items-center gap-1"><ListChecks className="h-3.5 w-3.5" /> {inv.rsvpCount}</span>
                  <span className="flex items-center gap-1"><MailOpen className="h-3.5 w-3.5" /> {inv.wishCount}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link href={`/dashboard/edit/${inv._id}`} className="btn-primary !py-2 !text-xs">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                  <button onClick={() => setShare(inv)} className="btn-secondary !py-2 !text-xs">
                    <Share2 className="h-3.5 w-3.5" /> Share
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-1 border-t border-ink/[0.06] pt-3 text-[11px] font-semibold sm:text-xs">
                  <a href={`/i/${inv.slug}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 min-[380px]:flex-row text-ink-500 hover:bg-cream hover:text-ink">
                    <Eye className="h-3.5 w-3.5" /> View
                  </a>
                  <Link href={`/dashboard/${inv._id}/guests`} className="flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 min-[380px]:flex-row text-ink-500 hover:bg-cream hover:text-ink">
                    <Users className="h-3.5 w-3.5" /> Guests
                  </Link>
                  <button onClick={() => duplicate(inv._id)} className="flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 min-[380px]:flex-row text-ink-500 hover:bg-cream hover:text-ink">
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </button>
                  <button onClick={() => setToDelete(inv)} className="flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 min-[380px]:flex-row text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {share && <ShareSheet open onClose={() => setShare(null)} url={inviteUrl(share.slug)} title={share.title} />}

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Delete invitation?">
        <p className="text-sm text-ink-500">
          &ldquo;{toDelete?.title}&rdquo; and all its RSVPs and wishes will be permanently deleted. The link will stop working. This can&apos;t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => setToDelete(null)}>
            Cancel
          </button>
          <button className="btn-danger" onClick={remove}>
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
