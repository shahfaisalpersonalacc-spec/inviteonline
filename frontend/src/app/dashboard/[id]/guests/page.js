"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api, downloadFile } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { timeAgo, whatsappLink } from "@/lib/format";

const STATUS = {
  yes: { label: "Attending", cls: "bg-green-100 text-green-700" },
  maybe: { label: "Maybe", cls: "bg-amber-100 text-amber-700" },
  no: { label: "Not attending", cls: "bg-red-100 text-red-700" },
};

export default function GuestsPage() {
  const { id } = useParams();
  const toast = useToast();
  const [inv, setInv] = useState(null);
  const [rsvp, setRsvp] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [tab, setTab] = useState("rsvps");
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    Promise.all([api(`/invitations/${id}`), api(`/invitations/${id}/rsvps`), api(`/invitations/${id}/wishes`)])
      .then(([a, b, c]) => {
        setInv(a.invitation);
        setRsvp(b);
        setWishes(c.wishes);
      })
      .catch((e) => toast(e.message, "error"));
  }, [id, toast]);

  const list = useMemo(() => {
    if (!rsvp) return [];
    const term = q.trim().toLowerCase();
    return rsvp.rsvps.filter((r) => (filter === "all" || r.status === filter) && (!term || r.name.toLowerCase().includes(term) || r.phone?.includes(term)));
  }, [rsvp, filter, q]);

  async function delRsvp(rid) {
    if (!confirm("Delete this RSVP?")) return;
    await api(`/invitations/${id}/rsvps/${rid}`, { method: "DELETE" });
    const rsvps = rsvp.rsvps.filter((r) => r._id !== rid);
    const summary = { yes: 0, no: 0, maybe: 0, totalGuests: 0 };
    rsvps.forEach((r) => {
      summary[r.status]++;
      if (r.status === "yes") summary.totalGuests += r.guests;
    });
    setRsvp({ rsvps, summary });
  }

  async function delWish(wid) {
    if (!confirm("Delete this wish?")) return;
    await api(`/invitations/${id}/wishes/${wid}`, { method: "DELETE" });
    setWishes((w) => w.filter((x) => x._id !== wid));
  }

  if (!inv || !rsvp) return <FullPageSpinner />;
  const s = rsvp.summary;

  return (
    <div>
      <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-brand-600">
        ← All invitations
      </Link>
      <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-zinc-900">{inv.title} — Guests</h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/edit/${id}`} className="btn-secondary">
            Edit invitation
          </Link>
          <button className="btn-primary" onClick={() => downloadFile(`/invitations/${id}/rsvps?format=csv`, `rsvps-${inv.slug}.csv`).catch((e) => toast(e.message, "error"))}>
            ⬇ Export CSV
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Attending", s.yes, "text-green-600"],
          ["Total guests coming", s.totalGuests, "text-brand-600"],
          ["Maybe", s.maybe, "text-amber-600"],
          ["Not attending", s.no, "text-red-600"],
        ].map(([label, n, cls]) => (
          <div key={label} className="card p-4">
            <p className="text-xs text-zinc-500">{label}</p>
            <p className={`mt-1 text-3xl font-bold ${cls}`}>{n}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-1 rounded-full bg-zinc-100 p-1 sm:inline-flex">
        {[
          ["rsvps", `RSVPs (${rsvp.rsvps.length})`],
          ["wishes", `Wishes (${wishes.length})`],
        ].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} className={`flex-1 rounded-full px-5 py-2 text-sm font-semibold ${tab === k ? "bg-white shadow" : "text-zinc-500"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "rsvps" ? (
        <>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input className="input sm:max-w-xs" placeholder="Search name or phone…" value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="input sm:max-w-[200px]" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All responses</option>
              <option value="yes">Attending</option>
              <option value="maybe">Maybe</option>
              <option value="no">Not attending</option>
            </select>
          </div>
          {list.length === 0 ? (
            <p className="card mt-4 p-10 text-center text-sm text-zinc-500">No responses yet. Share your invitation link to start collecting RSVPs!</p>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {list.map((r) => (
                <div key={r._id} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-zinc-900">{r.name}</p>
                      <p className="text-xs text-zinc-500">{timeAgo(r.createdAt)}</p>
                    </div>
                    <span className={`chip shrink-0 ${STATUS[r.status].cls}`}>{STATUS[r.status].label}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600">
                    {r.status !== "no" && <span>👥 {r.guests} guest{r.guests > 1 ? "s" : ""}</span>}
                    {r.phone && (
                      <a href={whatsappLink(r.phone)} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                        📱 {r.phone}
                      </a>
                    )}
                  </div>
                  {r.message && <p className="mt-2 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-700">“{r.message}”</p>}
                  <button onClick={() => delRsvp(r._id)} className="mt-2 text-xs text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : wishes.length === 0 ? (
        <p className="card mt-4 p-10 text-center text-sm text-zinc-500">No wishes yet.</p>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {wishes.map((w) => (
            <div key={w._id} className="card p-4">
              <p className="whitespace-pre-line text-sm text-zinc-800">{w.message}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-700">
                  — {w.name} <span className="font-normal text-zinc-400">· {timeAgo(w.createdAt)}</span>
                </span>
                <button onClick={() => delWish(w._id)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
