"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, inviteUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";
import { FullPageSpinner } from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import ShareSheet from "@/components/invite/ShareSheet";
import { eventTypeEmoji, eventTypeLabel } from "@/data/eventTypes";
import { THEMES } from "@/data/themes";
import { timeAgo } from "@/lib/format";

export default function DashboardPage() {
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [items, setItems] = useState(null);
  const [share, setShare] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const load = () =>
    api("/invitations")
      .then((d) => setItems(d.invitations))
      .catch((e) => {
        toast(e.message, "error");
        setItems([]);
      });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <p className="text-sm text-zinc-500">Welcome back,</p>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">{user.name.split(" ")[0]} 👋</h1>
        </div>
        <Link href="/dashboard/new" className="btn-primary self-start sm:self-auto">
          + New invitation
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          ["Total views", totals.views, "👀"],
          ["RSVPs", totals.rsvps, "✅"],
          ["Wishes", totals.wishes, "💌"],
        ].map(([label, n, icon]) => (
          <div key={label} className="card p-4">
            <p className="text-xs text-zinc-500 sm:text-sm">
              {icon} {label}
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">{n}</p>
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center px-6 py-16 text-center">
          <div className="text-6xl">💌</div>
          <h2 className="mt-4 text-xl font-semibold">No invitations yet</h2>
          <p className="mt-1 max-w-sm text-sm text-zinc-600">Create your first invitation — pick an event, personalise it and share the link with everyone.</p>
          <Link href="/dashboard/new" className="btn-primary mt-6">
            Create my first invitation
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((inv) => {
            const color = inv.theme?.primary || THEMES.blush.primary;
            return (
              <div key={inv._id} className="card flex flex-col overflow-hidden">
                <Link href={`/dashboard/edit/${inv._id}`} className="relative block h-36 overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}>
                  {inv.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={inv.coverImage} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-6xl">{eventTypeEmoji(inv.eventType)}</div>
                  )}
                  <span className={`chip absolute left-3 top-3 ${inv.published ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"}`}>{inv.published ? "● Live" : "Draft"}</span>
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs text-zinc-500">
                    {eventTypeLabel(inv.eventType)} · edited {timeAgo(inv.updatedAt)}
                  </p>
                  <h3 className="mt-1 truncate font-semibold text-zinc-900">{inv.title}</h3>
                  <p className="mt-0.5 truncate text-xs text-brand-600">/i/{inv.slug}</p>
                  <div className="mt-3 flex gap-4 text-xs text-zinc-600">
                    <span>👀 {inv.views || 0}</span>
                    <span>✅ {inv.rsvpCount}</span>
                    <span>💌 {inv.wishCount}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link href={`/dashboard/edit/${inv._id}`} className="btn-primary !py-2 !text-xs">
                      ✏️ Edit
                    </Link>
                    <button onClick={() => setShare(inv)} className="btn-secondary !py-2 !text-xs">
                      ↗ Share
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap justify-between gap-1 border-t border-zinc-100 pt-2 text-xs">
                    <a href={`/i/${inv.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-lg px-2 py-1.5 text-zinc-600 hover:bg-zinc-50">
                      View
                    </a>
                    <Link href={`/dashboard/${inv._id}/guests`} className="rounded-lg px-2 py-1.5 text-zinc-600 hover:bg-zinc-50">
                      Guests
                    </Link>
                    <button onClick={() => duplicate(inv._id)} className="rounded-lg px-2 py-1.5 text-zinc-600 hover:bg-zinc-50">
                      Duplicate
                    </button>
                    <button onClick={() => setToDelete(inv)} className="rounded-lg px-2 py-1.5 text-red-600 hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {share && <ShareSheet open onClose={() => setShare(null)} url={inviteUrl(share.slug)} title={share.title} />}

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Delete invitation?">
        <p className="text-sm text-zinc-600">
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
