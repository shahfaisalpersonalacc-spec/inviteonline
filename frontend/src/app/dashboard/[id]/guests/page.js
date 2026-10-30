"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Download, HelpCircle, ListChecks, MailOpen, Pencil, Phone, Search, Sparkles, Trash2, Users, XCircle } from "lucide-react";
import { api, downloadFile } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Spinner from "@/components/ui/Spinner";
import { formatCount, timeAgo, whatsappLink } from "@/lib/format";

const STATUS = {
  yes: { label: "Attending", cls: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500", orb: "from-[#7fe0b3] to-[#2fb27a]" },
  maybe: { label: "Maybe", cls: "bg-amber-50 text-amber-700", dot: "bg-amber-500", orb: "from-[#f8cf6a] to-[#f0a92e]" },
  no: { label: "Not attending", cls: "bg-red-50 text-red-700", dot: "bg-red-500", orb: "from-[#f38a74] to-[#e8544a]" },
};

export default function GuestsPage() {
  const { id } = useParams();
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const [inv, setInv] = useState(null);
  const [rsvp, setRsvp] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [tab, setTab] = useState(params.get("tab") === "wishes" ? "wishes" : "rsvps");
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [pending, setPending] = useState(""); // "csv", or the id being deleted

  useEffect(() => {
    Promise.all([api(`/invitations/${id}`), api(`/invitations/${id}/rsvps`), api(`/invitations/${id}/wishes`)])
      .then(([a, b, c]) => {
        setInv(a.invitation);
        setRsvp(b);
        setWishes(c.wishes);
      })
      .catch((e) => {
        toast(e.message, "error");
        router.replace("/dashboard");
      });
  }, [id, toast, router]);

  const list = useMemo(() => {
    if (!rsvp) return [];
    const term = q.trim().toLowerCase();
    return rsvp.rsvps.filter((r) => (filter === "all" || r.status === filter) && (!term || r.name.toLowerCase().includes(term) || r.phone?.includes(term)));
  }, [rsvp, filter, q]);

  async function delRsvp(rid) {
    if (!confirm("Delete this RSVP?")) return;
    setPending(rid);
    try {
      await api(`/invitations/${id}/rsvps/${rid}`, { method: "DELETE" });
    } catch (e) {
      return toast(e.message, "error");
    } finally {
      setPending("");
    }
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
    setPending(wid);
    try {
      await api(`/invitations/${id}/wishes/${wid}`, { method: "DELETE" });
    } catch (e) {
      return toast(e.message, "error");
    } finally {
      setPending("");
    }
    setWishes((w) => w.filter((x) => x._id !== wid));
  }

  if (!inv || !rsvp) {
    return (
      <div aria-busy="true" aria-label="Loading guests">
        <div className="at-skel h-8 w-36 rounded-full" />
        <div className="at-skel mt-5 h-12 w-[min(30rem,90%)]" />
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="at-skel h-28 rounded-3xl" />)}
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => <div key={i} className="at-skel h-32 rounded-3xl" />)}
        </div>
      </div>
    );
  }
  const s = rsvp.summary;
  const answered = s.yes + s.maybe + s.no;

  return (
    <div>
      <div className="at-rise">
        <Link href="/dashboard" className="at-glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold text-ink-500 transition hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> All invitations
        </Link>
        <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="min-w-0">
            <p className="eyebrow truncate">
              <Sparkles className="h-3.5 w-3.5 shrink-0" /> {inv.title}
            </p>
            <h1 className="display mt-2 text-[2.5rem] leading-none sm:text-6xl">
              Your <em>guests.</em>
            </h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/edit/${id}`} className="btn-secondary flex-1 sm:flex-none">
              <Pencil className="h-4 w-4" /> Edit
            </Link>
            <button
              className="btn-primary flex-1 sm:flex-none"
              disabled={pending === "csv"}
              onClick={() => {
                setPending("csv");
                downloadFile(`/invitations/${id}/rsvps?format=csv`, `rsvps-${inv.slug}.csv`)
                  .catch((e) => toast(e.message, "error"))
                  .finally(() => setPending(""));
              }}
            >
              {pending === "csv" ? <Spinner className="h-4 w-4" /> : <Download className="h-4 w-4" />} Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {[
          ["Attending", s.yes, CheckCircle2, "from-[#c9f2dc] to-[#2fb27a] text-white"],
          ["Guests coming", s.totalGuests, Users, "from-[#f7e2ad] to-[#d9ae55] text-[#6d4c12]"],
          ["Maybe", s.maybe, HelpCircle, "from-[#fde7b0] to-[#f0a92e] text-white"],
          ["Not attending", s.no, XCircle, "from-[#ffc7bb] to-[#e8544a] text-white"],
        ].map(([label, n, Icon, orb], i) => (
          <div key={label} className="at-glass at-rise rounded-3xl p-4 sm:p-5" style={{ "--i": i + 1 }}>
            <span className={`grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br shadow-[0_10px_20px_-12px_rgba(70,45,20,.6)] ${orb}`}>
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a7258] sm:text-[11px]">{label}</p>
            <p className="mt-1 font-serif text-4xl leading-none text-ink tabular-nums" title={n.toLocaleString()}>{formatCount(n)}</p>
          </div>
        ))}
      </div>

      {/* how the answers split */}
      {answered > 0 && (
        <div className="at-rise mt-4" style={{ "--i": 5 }}>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-white/70 ring-1 ring-ink/[0.05]">
            {[
              [s.yes, "bg-gradient-to-r from-[#5fd39e] to-[#2fb27a]"],
              [s.maybe, "bg-gradient-to-r from-[#f8cf6a] to-[#f0a92e]"],
              [s.no, "bg-gradient-to-r from-[#f38a74] to-[#e8544a]"],
            ].map(([n, cls], i) => n > 0 && <span key={i} className={`h-full transition-all duration-700 ${cls}`} style={{ width: `${(n / answered) * 100}%` }} />)}
          </div>
          <p className="mt-2 text-xs text-ink-500">
            {answered} {answered === 1 ? "response" : "responses"} · {Math.round((s.yes / answered) * 100)}% coming
          </p>
        </div>
      )}

      {/* tabs: the gold-edged pill slides to the chosen one */}
      <div className="at-glass relative mt-8 grid grid-cols-2 rounded-full p-1 sm:inline-grid sm:min-w-[22rem]" role="tablist">
        <span
          className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-[0_8px_18px_-10px_rgba(70,45,20,.6)] ring-1 ring-gold-600/30 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ transform: tab === "wishes" ? "translateX(100%)" : "none" }}
          aria-hidden
        />
        {[
          ["rsvps", "RSVPs", rsvp.rsvps.length, ListChecks],
          ["wishes", "Wishes", wishes.length, MailOpen],
        ].map(([k, label, n, Icon]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`relative flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${tab === k ? "text-ink" : "text-ink-500 hover:text-ink"}`}>
            <Icon className={`h-4 w-4 ${tab === k ? "text-gold-600" : ""}`} /> {label}
            <span className={`rounded-full px-2 py-px text-[11px] ${tab === k ? "bg-ink text-cream" : "bg-ink/[0.07]"}`}>{n}</span>
          </button>
        ))}
      </div>

      {tab === "rsvps" ? (
        <>
          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative md:w-80">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
              <input className="input !pl-10" placeholder="Search name or phone…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search guests" />
            </div>
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1" role="radiogroup" aria-label="Show">
              {[
                ["all", "All"],
                ["yes", "Attending"],
                ["maybe", "Maybe"],
                ["no", "Not attending"],
              ].map(([v, label]) => (
                <button
                  key={v}
                  role="radio"
                  aria-checked={filter === v}
                  onClick={() => setFilter(v)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${filter === v ? "bg-ink text-cream shadow-[0_10px_20px_-12px_rgba(28,26,61,.8)]" : "bg-white/70 text-ink-500 ring-1 ring-ink/[0.07] hover:bg-white hover:text-ink"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {list.length === 0 ? (
            <Empty Icon={ListChecks} text={rsvp.rsvps.length ? "No one matches that search." : "No responses yet. Share your invitation link to start collecting RSVPs!"} />
          ) : (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {list.map((r, i) => (
                <div key={r._id} className="at-glass at-rise group rounded-3xl p-4 transition duration-300 hover:-translate-y-0.5 sm:p-5" style={{ "--i": Math.min(i, 8) }}>
                  <div className="flex items-start gap-3">
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br font-serif text-lg text-white ${STATUS[r.status].orb}`}>{r.name.trim()[0]?.toUpperCase()}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate font-semibold text-ink">{r.name}</p>
                        <span className={`chip shrink-0 font-bold ${STATUS[r.status].cls}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${STATUS[r.status].dot}`} /> {STATUS[r.status].label}
                        </span>
                      </div>
                      <p className="text-xs text-ink-500">{timeAgo(r.createdAt)}</p>
                      <div className="mt-2.5 flex flex-wrap gap-2 text-xs font-semibold">
                        {r.status !== "no" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-ink ring-1 ring-ink/[0.06]">
                            <Users className="h-3.5 w-3.5 text-gold-600" /> {r.guests} guest{r.guests > 1 ? "s" : ""}
                          </span>
                        )}
                        {r.phone && (
                          <a href={whatsappLink(r.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-600/15 transition hover:bg-emerald-100">
                            <Phone className="h-3.5 w-3.5" /> {r.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  {r.message && <p className="mt-3 rounded-2xl border-l-2 border-gold-600/60 bg-white/70 px-3.5 py-2.5 font-serif text-[15px] italic leading-relaxed text-ink/80">“{r.message}”</p>}
                  <div className="mt-2 flex justify-end">
                    <button onClick={() => delRsvp(r._id)} disabled={pending === r._id} className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-red-600 opacity-80 transition hover:bg-red-50 hover:opacity-100 disabled:opacity-60">
                      {pending === r._id ? <Spinner className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />} Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : wishes.length === 0 ? (
        <Empty Icon={MailOpen} text="No wishes yet. They'll appear here as guests leave them." />
      ) : (
        // wishes as little letters
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {wishes.map((w, i) => (
            <figure key={w._id} className="at-glass at-rise relative overflow-hidden rounded-3xl p-5 sm:p-6" style={{ "--i": Math.min(i, 8) }}>
              <span className="pointer-events-none absolute -right-1 -top-5 font-serif text-[7rem] leading-none text-gold-600/15" aria-hidden>&rdquo;</span>
              <blockquote className="relative whitespace-pre-line font-serif text-lg italic leading-relaxed text-ink/85">{w.message}</blockquote>
              <figcaption className="relative mt-4 flex items-center justify-between gap-3 text-xs">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="h-px w-6 bg-gold-600/60" />
                  <span className="truncate font-bold text-brand-600">{w.name}</span>
                  <span className="shrink-0 text-ink-500">· {timeAgo(w.createdAt)}</span>
                </span>
                <button onClick={() => delWish(w._id)} disabled={pending === w._id} className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-semibold text-red-600 opacity-80 transition hover:bg-red-50 hover:opacity-100 disabled:opacity-60">
                  {pending === w._id ? <Spinner className="h-3 w-3" /> : <Trash2 className="h-3.5 w-3.5" />} Delete
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

function Empty({ Icon, text }) {
  return (
    <div className="at-glass at-rise mt-5 flex flex-col items-center rounded-[2rem] px-6 py-14 text-center">
      <span className="at-float grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#fff1c9] to-[#d9ae55] text-[#6d4c12] shadow-[0_16px_30px_-16px_rgba(168,122,42,.8)]">
        <Icon className="h-7 w-7" strokeWidth={1.6} />
      </span>
      <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-500">{text}</p>
    </div>
  );
}
