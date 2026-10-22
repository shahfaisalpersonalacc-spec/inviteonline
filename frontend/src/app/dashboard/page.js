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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-display text-xl italic text-ink-500">Welcome back,</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{user.name.split(" ")[0]}</h1>
        </div>
        <Link href="/dashboard/new" className="btn-primary self-start sm:self-auto">
          <Plus className="h-4 w-4" /> New invitation
        </Link>
      </div>

      <div className="mt-7 grid grid-cols-3 gap-3">
        {[
          ["Views", totals.views, Eye],
          ["RSVPs", totals.rsvps, ListChecks],
          ["Wishes", totals.wishes, MailOpen],
        ].map(([label, n, Icon]) => (
          <div key={label} className="card flex items-center gap-3 p-4 sm:p-5">
            <span className="hidden h-11 w-11 place-items-center rounded-2xl bg-gold/20 text-gold-600 sm:grid">
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</p>
              <p className="text-2xl font-extrabold text-ink sm:text-3xl">{n}</p>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center px-6 py-16 text-center">
          <WaxSeal color="#7a2430" icon="heart" className="w-24" />
          <h2 className="mt-5 text-2xl font-extrabold text-ink">Your first invitation awaits</h2>
          <p className="mt-2 max-w-sm font-display text-lg text-ink/65">Pick an event and an entrance, make it yours and share one link with everyone.</p>
          <Link href="/dashboard/new" className="btn-primary mt-7">
            <Plus className="h-4 w-4" /> Create my first invitation
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((inv) => (
            <div key={inv._id} className="card flex flex-col overflow-hidden">
              <Link href={`/dashboard/edit/${inv._id}`} className="relative block h-40 overflow-hidden">
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
                <h3 className="mt-1 truncate text-lg font-bold text-ink">{inv.title}</h3>
                <p className="mt-0.5 truncate text-xs font-medium text-brand-500">/i/{inv.slug}</p>
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
                <div className="mt-3 flex flex-wrap justify-between gap-1 border-t border-ink/[0.06] pt-3 text-xs font-semibold">
                  <a href={`/i/${inv.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-ink-500 hover:bg-cream hover:text-ink">
                    <Eye className="h-3.5 w-3.5" /> View
                  </a>
                  <Link href={`/dashboard/${inv._id}/guests`} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-ink-500 hover:bg-cream hover:text-ink">
                    <Users className="h-3.5 w-3.5" /> Guests
                  </Link>
                  <button onClick={() => duplicate(inv._id)} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-ink-500 hover:bg-cream hover:text-ink">
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </button>
                  <button onClick={() => setToDelete(inv)} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-red-600 hover:bg-red-50">
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
