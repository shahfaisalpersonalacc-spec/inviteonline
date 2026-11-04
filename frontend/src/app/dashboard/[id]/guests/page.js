"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, LayoutGrid, ListChecks, MailOpen, MessageCircle, Pencil, Search, Share2, Sparkles, Trash2, Users, X } from "lucide-react";
import { api, downloadFile, inviteUrl } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Spinner from "@/components/ui/Spinner";
import ShareSheet from "@/components/invite/ShareSheet";
import { formatCount, timeAgo, whatsappLink } from "@/lib/format";

const STATUS = {
  yes: { label: "Attending", short: "Going", cls: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500", orb: "from-[#7fe0b3] to-[#2fb27a]", bar: "from-[#5fd39e] to-[#2fb27a]" },
  maybe: { label: "Maybe", short: "Maybe", cls: "bg-amber-50 text-amber-700", dot: "bg-amber-500", orb: "from-[#f8cf6a] to-[#f0a92e]", bar: "from-[#f8cf6a] to-[#f0a92e]" },
  no: { label: "Not attending", short: "Declined", cls: "bg-red-50 text-red-700", dot: "bg-red-500", orb: "from-[#f38a74] to-[#e8544a]", bar: "from-[#f38a74] to-[#e8544a]" },
};

const summarize = (rsvps) => {
  const summary = { yes: 0, no: 0, maybe: 0, totalGuests: 0 };
  rsvps.forEach((r) => {
    summary[r.status]++;
    if (r.status === "yes") summary.totalGuests += r.guests;
  });
  return summary;
};
const newestFirst = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
const plural = (n, one, many = `${one}s`) => `${formatCount(n)} ${n === 1 ? one : many}`;
// the switch row scrolls sideways on phones: start with the selected invitation in view, centred
const centerSelected = (row) => {
  const on = row?.querySelector('[aria-selected="true"]');
  if (on) row.scrollLeft = on.offsetLeft - (row.clientWidth - on.offsetWidth) / 2;
};

// /dashboard/<invitation id>/guests: one invitation's replies; /dashboard/all/guests: every invitation's,
// each tagged with the invitation it came from. A fresh page for each (key), so nothing carries over.
export default function GuestsPage() {
  const { id } = useParams();
  return <Guests key={id} id={id} />;
}

function Guests({ id }) {
  const all = id === "all";
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const [invites, setInvites] = useState(null); // every invitation, for the switch
  const [inv, setInv] = useState(null);
  const [rsvp, setRsvp] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [tab, setTab] = useState(params.get("tab") === "wishes" ? "wishes" : "rsvps");
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [pending, setPending] = useState(""); // "csv", or the id being deleted
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    const fail = (e) => {
      toast(e.message, "error");
      router.replace("/dashboard");
    };
    const list = api("/invitations").then((d) => {
      setInvites(d.invitations);
      return d.invitations;
    });
    if (!all) {
      Promise.all([api(`/invitations/${id}`), api(`/invitations/${id}/rsvps`), api(`/invitations/${id}/wishes`)])
        .then(([a, b, c]) => {
          setInv(a.invitation);
          setRsvp(b);
          setWishes(c.wishes);
        })
        .catch(fail);
      list.catch(() => setInvites([])); // the switch just doesn't show
      return;
    }
    // every invitation's replies, tagged with where they came from
    list
      .then((invs) =>
        Promise.all(
          invs.map((x) =>
            Promise.all([api(`/invitations/${x._id}/rsvps`), api(`/invitations/${x._id}/wishes`)]).then(([b, c]) => {
              const from = { invId: x._id, invTitle: x.title };
              return { rsvps: b.rsvps.map((r) => ({ ...r, ...from })), wishes: c.wishes.map((w) => ({ ...w, ...from })) };
            })
          )
        )
      )
      .then((parts) => {
        const rsvps = parts.flatMap((p) => p.rsvps).sort(newestFirst);
        setInv({ title: "All invitations" });
        setRsvp({ rsvps, summary: summarize(rsvps) });
        setWishes(parts.flatMap((p) => p.wishes).sort(newestFirst));
      })
      .catch(fail);
  }, [id, all, toast, router]);

  const list = useMemo(() => {
    if (!rsvp) return [];
    const term = q.trim().toLowerCase();
    return rsvp.rsvps.filter((r) => (filter === "all" || r.status === filter) && (!term || r.name.toLowerCase().includes(term) || r.phone?.includes(term)));
  }, [rsvp, filter, q]);

  async function delRsvp(r) {
    if (!confirm(`Delete ${r.name}'s RSVP?`)) return;
    setPending(r._id);
    try {
      await api(`/invitations/${r.invId || id}/rsvps/${r._id}`, { method: "DELETE" });
    } catch (e) {
      return toast(e.message, "error");
    } finally {
      setPending("");
    }
    const rsvps = rsvp.rsvps.filter((x) => x._id !== r._id);
    setRsvp({ rsvps, summary: summarize(rsvps) });
  }

  async function delWish(w) {
    const wid = w._id;
    if (!confirm(`Delete ${w.name}'s wish?`)) return;
    setPending(wid);
    try {
      await api(`/invitations/${w.invId || id}/wishes/${wid}`, { method: "DELETE" });
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
        <div className="flex items-center gap-3">
          <div className="at-skel h-10 w-10 shrink-0 rounded-full sm:h-12 sm:w-12" />
          <div className="at-skel h-10 w-[min(22rem,70%)]" />
        </div>
        <div className="at-skel mt-4 h-9 w-[min(24rem,90%)] rounded-full sm:mt-6" />
        <div className="at-skel mt-4 h-40 rounded-[1.75rem] sm:mt-6" />
        <div className="at-skel mt-6 h-11 w-full rounded-full sm:w-96" />
        <div className="at-glass mt-4 divide-y divide-ink/[0.06] overflow-hidden rounded-[1.75rem]">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="at-skel h-11 w-11 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="at-skel h-3.5 w-36" />
                <div className="at-skel h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const s = rsvp.summary;
  const answered = s.yes + s.maybe + s.no;
  const share = !all && inv.slug ? () => setSharing(true) : null;

  return (
    <div>
      {/* ---- header: where you are, and this invitation's tools ---- */}
      <div className="at-rise">
        {/* one row: back, where you are, this invitation's tools */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/dashboard" className="at-glass grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-500 transition hover:text-ink sm:h-12 sm:w-12" aria-label="Back to dashboard" title="Dashboard">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="eyebrow !text-[10px] sm:!text-[11px]">
              <Users className="h-3.5 w-3.5 shrink-0" /> Guests &amp; replies
            </p>
            <h1 className="display mt-0.5 truncate text-[1.65rem] leading-tight sm:mt-1 sm:text-5xl" title={inv.title}>
              {inv.title}
            </h1>
          </div>
          {/* phones: icon buttons; wider screens: with their labels */}
          {!all && (
            <div className="flex shrink-0 gap-2">
              <Link href={`/dashboard/edit/${id}`} className="btn-secondary !h-11 !w-11 !p-0 sm:!h-auto sm:!w-auto sm:!px-4 sm:!py-2.5" aria-label="Edit invitation">
                <Pencil className="h-4 w-4" /> <span className="hidden sm:inline">Edit</span>
              </Link>
              <button
                className="btn-primary !h-11 !w-11 !p-0 sm:!h-auto sm:!w-auto sm:!px-4 sm:!py-2.5"
                aria-label="Export RSVPs as CSV"
                disabled={pending === "csv"}
                onClick={() => {
                  setPending("csv");
                  downloadFile(`/invitations/${id}/rsvps?format=csv`, `rsvps-${inv.slug}.csv`)
                    .catch((e) => toast(e.message, "error"))
                    .finally(() => setPending(""));
                }}
              >
                {pending === "csv" ? <Spinner className="h-4 w-4" /> : <Download className="h-4 w-4" />} <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          )}
        </div>

        {/* whose replies: every invitation together, or one of them */}
        {invites?.length > 1 && (
          <div className="relative -mx-4 mt-4 sm:mx-0 sm:mt-6">
            <div ref={centerSelected} className="no-scrollbar relative flex gap-2 overflow-x-auto pb-1 pl-4 pr-10 sm:flex-wrap sm:px-0" role="tablist" aria-label="Show replies for">
              {[{ _id: "all", title: "All invitations", rsvpCount: invites.reduce((n, x) => n + (x.rsvpCount || 0), 0) }, ...invites].map((x) => {
                const on = x._id === id;
                return (
                  <Link
                    key={x._id}
                    href={`/dashboard/${x._id}/guests${tab === "wishes" ? "?tab=wishes" : ""}`}
                    role="tab"
                    aria-selected={on}
                    className={`inline-flex max-w-[15rem] shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition ${on ? "bg-ink text-cream shadow-[0_10px_20px_-12px_rgba(28,26,61,.8)]" : "bg-white/70 text-ink-500 ring-1 ring-ink/[0.07] hover:bg-white hover:text-ink"}`}
                  >
                    {x._id === "all" && <LayoutGrid className="h-4 w-4 shrink-0" />}
                    <span className="truncate">{x.title}</span>
                    <span className={`shrink-0 rounded-full px-1.5 py-px text-[11px] tabular-nums ${on ? "bg-cream/20" : "bg-ink/[0.07]"}`}>{formatCount(x.rsvpCount || 0)}</span>
                  </Link>
                );
              })}
            </div>
            {/* phones: a soft fade says the row scrolls */}
            <span className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--color-cream)] to-transparent sm:hidden" aria-hidden />
          </div>
        )}
      </div>

      {/* ---- the figures: one slim strip, with how the answers split along its bottom edge ---- */}
      <section className="at-glass at-rise relative mt-4 overflow-hidden rounded-3xl sm:mt-6" style={{ "--i": 1 }} aria-label="Overview">
        <dl className="grid grid-cols-4 divide-x divide-ink/[0.07]">
          {[
            ["Coming", formatCount(s.totalGuests), s.totalGuests === 1 ? "guest" : "guests", s.totalGuests.toLocaleString()],
            ["Replies", formatCount(answered), `${formatCount(s.yes)} going · ${formatCount(s.maybe)} maybe`, answered.toLocaleString()],
            ["Attending", answered ? `${Math.round((s.yes / answered) * 100)}%` : "–", `${formatCount(s.no)} declined`],
            ["Wishes", formatCount(wishes.length), wishes.length === 1 ? "message" : "messages", wishes.length.toLocaleString()],
          ].map(([label, value, sub, exact]) => (
            <div key={label} className="min-w-0 px-2.5 py-3 sm:px-6 sm:py-5">
              <dt className="truncate text-[10px] font-bold uppercase tracking-[0.04em] text-[#8a7258] sm:text-[11px] sm:tracking-[0.14em]">{label}</dt>
              <dd className="mt-1 font-serif text-2xl leading-none text-ink tabular-nums sm:text-4xl" title={exact}>
                {value}
              </dd>
              <dd className="mt-1.5 hidden truncate text-xs text-ink-500 sm:block">{sub}</dd>
            </div>
          ))}
        </dl>
        {/* a rounded pill inset from the card's edges; each answer is its own rounded segment */}
        <div className="mx-2.5 mb-3 flex h-2 gap-1 overflow-hidden rounded-full bg-ink/[0.06] sm:mx-6 sm:mb-5" role="img" aria-label={`${s.yes} attending, ${s.maybe} maybe, ${s.no} not attending`}>
          {answered > 0 &&
            ["yes", "maybe", "no"].map((k) => s[k] > 0 && <span key={k} className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${STATUS[k].bar}`} style={{ width: `${(s[k] / answered) * 100}%` }} />)}
        </div>
      </section>

      {/* ---- the replies: one panel with its tabs, search and filters, then the list ---- */}
      <section className="at-glass at-rise mt-5 overflow-hidden rounded-[1.75rem] sm:mt-8" style={{ "--i": 2 }} aria-label="Replies">
        <div className="flex flex-col gap-3 border-b border-ink/[0.07] px-4 pt-2 sm:px-6 md:flex-row md:items-center md:justify-between md:pt-0">
          <div className="-mb-px flex" role="tablist" aria-label="Replies">
            {[
              ["rsvps", "RSVPs", rsvp.rsvps.length, ListChecks],
              ["wishes", "Wishes", wishes.length, MailOpen],
            ].map(([k, label, n, Icon]) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
                className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition md:flex-none ${tab === k ? "border-gold-600 text-ink" : "border-transparent text-ink-500 hover:text-ink"}`}
              >
                <Icon className={`h-4 w-4 ${tab === k ? "text-gold-600" : ""}`} /> {label}
                <span className={`rounded-full px-2 py-px text-[11px] tabular-nums ${tab === k ? "bg-ink text-cream" : "bg-ink/[0.07]"}`}>{formatCount(n)}</span>
              </button>
            ))}
          </div>
          {tab === "rsvps" && rsvp.rsvps.length > 0 && (
            <div className="relative pb-3 md:w-72 md:py-2.5">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 md:top-1/2 max-md:top-[calc(50%-0.375rem)] h-4 w-4 -translate-y-1/2 text-ink-500" />
              <input className="input !rounded-full !py-2 !pl-10 !pr-10" placeholder="Search name or phone…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search guests" />
              {q && (
                <button onClick={() => setQ("")} className="absolute right-2 top-1/2 md:top-1/2 max-md:top-[calc(50%-0.375rem)] grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink-500 hover:bg-ink/5 hover:text-ink" aria-label="Clear search">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {tab === "rsvps" ? (
          rsvp.rsvps.length === 0 ? (
            <Empty Icon={ListChecks} text="No RSVPs yet. Share your invitation and replies will appear here as they come in." onShare={share} />
          ) : (
            <>
              {/* filters, each with how many it shows */}
              <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3 sm:px-6" role="radiogroup" aria-label="Show">
                {[
                  ["all", "All", rsvp.rsvps.length],
                  ["yes", "Attending", s.yes],
                  ["maybe", "Maybe", s.maybe],
                  ["no", "Not attending", s.no],
                ].map(([v, label, n]) => (
                  <button
                    key={v}
                    role="radio"
                    aria-checked={filter === v}
                    onClick={() => setFilter(v)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${filter === v ? "bg-ink text-cream" : "bg-ink/[0.05] text-ink-500 hover:bg-ink/[0.08] hover:text-ink"}`}
                  >
                    {v !== "all" && <span className={`h-1.5 w-1.5 rounded-full ${STATUS[v].dot}`} />}
                    {label}
                    <span className={`tabular-nums ${filter === v ? "text-cream/70" : "text-ink/40"}`}>{formatCount(n)}</span>
                  </button>
                ))}
              </div>

              {list.length === 0 ? (
                <Empty Icon={Search} text="No one matches that. Try another name, or a different filter." />
              ) : (
                <div role="table" aria-label="RSVPs">
                  {/* laptops and up: a table with headings; phones: compact cards */}
                  <div role="row" className={`hidden border-y border-ink/[0.07] bg-ink/[0.025] px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500 lg:grid ${all ? COLS_ALL : COLS_ONE}`}>
                    <span role="columnheader">Guest</span>
                    {all && <span role="columnheader">Invitation</span>}
                    <span role="columnheader">Status</span>
                    <span role="columnheader">Party</span>
                    <span role="columnheader">Contact</span>
                    <span role="columnheader">Replied</span>
                    <span role="columnheader" className="sr-only">Actions</span>
                  </div>
                  <ul className="divide-y divide-ink/[0.06] border-t border-ink/[0.07] lg:border-t-0">
                    {list.map((r) => (
                      <li key={r._id} role="row" className={`px-4 py-3.5 transition hover:bg-white/40 sm:px-6 lg:grid lg:items-center lg:gap-4 lg:py-3 ${all ? COLS_ALL : COLS_ONE}`}>
                        <RsvpRow r={r} all={all} busy={pending === r._id} onDelete={() => delRsvp(r)} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )
        ) : wishes.length === 0 ? (
          <Empty Icon={MailOpen} text="No wishes yet. Guests' messages will appear here as little letters." onShare={share} />
        ) : (
          // wishes as little letters
          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
            {wishes.map((w, i) => (
              <figure key={w._id} className="at-rise relative flex flex-col overflow-hidden rounded-3xl bg-white/60 p-5 ring-1 ring-ink/[0.06]" style={{ "--i": Math.min(i, 8) }}>
                <span className="pointer-events-none absolute -right-1 -top-5 font-serif text-[7rem] leading-none text-gold-600/15" aria-hidden>&rdquo;</span>
                {w.invTitle && <FromTag inv={w} tab="wishes" className="relative mb-2.5 mt-0 self-start" />}
                <blockquote className="relative flex-1 whitespace-pre-line font-serif text-lg italic leading-relaxed text-ink/85">{w.message}</blockquote>
                <figcaption className="relative mt-4 flex items-center justify-between gap-3 text-xs">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="h-px w-6 bg-gold-600/60" />
                    <span className="truncate font-bold text-brand-600">{w.name}</span>
                    <span className="shrink-0 text-ink-500">· {timeAgo(w.createdAt)}</span>
                  </span>
                  <button
                    onClick={() => delWish(w)}
                    disabled={pending === w._id}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                    aria-label={`Delete ${w.name}'s wish`}
                  >
                    {pending === w._id ? <Spinner className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      {sharing && <ShareSheet open onClose={() => setSharing(false)} url={inviteUrl(inv.slug)} title={inv.title} />}
    </div>
  );
}

// RSVP table columns (laptops and up); "All invitations" adds the invitation each reply came from
const COLS_ONE = "lg:grid-cols-[minmax(0,1fr)_9rem_5rem_11rem_6.5rem_2.5rem]";
const COLS_ALL = "lg:grid-cols-[minmax(0,1fr)_minmax(0,11rem)_9rem_5rem_11rem_6.5rem_2.5rem]";

function StatusChip({ status }) {
  return (
    <span className={`chip font-bold ${STATUS[status].cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS[status].dot}`} />
      {/* phones: the short word, so long names keep their room */}
      <span className="sm:hidden">{STATUS[status].short}</span>
      <span className="hidden sm:inline">{STATUS[status].label}</span>
    </span>
  );
}

function Avatar({ r, className = "" }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-serif text-white shadow-[0_8px_16px_-10px_rgba(28,26,61,.6)] ${STATUS[r.status].orb} ${className}`} aria-hidden>
      {r.name.trim()[0]?.toUpperCase()}
    </span>
  );
}

function Phone({ r }) {
  return (
    <a href={whatsappLink(r.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/15 transition hover:bg-emerald-100" aria-label={`WhatsApp ${r.name} on ${r.phone}`}>
      <MessageCircle className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{r.phone}</span>
    </a>
  );
}

function DeleteButton({ r, busy, onDelete }) {
  return (
    <button onClick={onDelete} disabled={busy} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60" aria-label={`Delete ${r.name}'s RSVP`} title="Delete">
      {busy ? <Spinner className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
    </button>
  );
}

// One RSVP: a compact card on phones and tablets, a table row (cells of the <li> grid) on laptops
function RsvpRow({ r, all, busy, onDelete }) {
  const party = r.status === "no" ? "–" : plural(r.guests, "guest");
  return (
    <>
      <div className="flex gap-3 lg:hidden">
        <Avatar r={r} className="h-11 w-11 text-lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink">{r.name}</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-ink-500">
                {r.status !== "no" && (
                  <>
                    <span className="inline-flex items-center gap-1 font-semibold text-ink">
                      <Users className="h-3.5 w-3.5 text-gold-600" /> {party}
                    </span>
                    <span aria-hidden>·</span>
                  </>
                )}
                <span>{timeAgo(r.createdAt)}</span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <StatusChip status={r.status} />
              <DeleteButton r={r} busy={busy} onDelete={onDelete} />
            </div>
          </div>
          {(r.invTitle || r.phone) && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {r.invTitle && <FromTag inv={r} tab="rsvps" className="" />}
              {r.phone && <Phone r={r} />}
            </div>
          )}
          {r.message && <p className="mt-2.5 rounded-2xl border-l-2 border-gold-600/60 bg-white/60 px-3.5 py-2 font-serif text-[15px] italic leading-relaxed text-ink/80">“{r.message}”</p>}
        </div>
      </div>

      <div className="hidden lg:contents">
        <div role="cell" className="flex min-w-0 items-center gap-3">
          <Avatar r={r} className="h-9 w-9 text-base" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">{r.name}</p>
            {r.message ? (
              <p className="truncate font-serif text-sm italic text-ink-500" title={r.message}>
                “{r.message}”
              </p>
            ) : (
              <p className="text-xs text-ink/35">No message</p>
            )}
          </div>
        </div>
        {all && (
          <div role="cell" className="min-w-0">
            <FromTag inv={r} tab="rsvps" className="" />
          </div>
        )}
        <div role="cell">
          <StatusChip status={r.status} />
        </div>
        <div role="cell" className="text-sm font-semibold tabular-nums text-ink">
          {party}
        </div>
        <div role="cell" className="min-w-0">
          {r.phone ? <Phone r={r} /> : <span className="text-xs text-ink/35">Not given</span>}
        </div>
        <div role="cell" className="text-xs text-ink-500" title={new Date(r.createdAt).toLocaleString()}>
          {timeAgo(r.createdAt)}
        </div>
        <div role="cell" className="flex justify-end">
          <DeleteButton r={r} busy={busy} onDelete={onDelete} />
        </div>
      </div>
    </>
  );
}

// "All invitations": the invitation a reply came from, a link to just that invitation's replies
function FromTag({ inv, tab, className = "mt-1.5" }) {
  return (
    <Link
      href={`/dashboard/${inv.invId}/guests${tab === "wishes" ? "?tab=wishes" : ""}`}
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#8a6a2f] ring-1 ring-gold-600/20 transition hover:bg-gold/25 dark:text-[#e2c27a] ${className}`}
    >
      <Sparkles className="h-3 w-3 shrink-0" />
      <span className="truncate">{inv.invTitle}</span>
    </Link>
  );
}

function Empty({ Icon, text, onShare }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center sm:py-16">
      <span className="at-float grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#fff1c9] to-[#d9ae55] text-[#6d4c12] shadow-[0_16px_30px_-16px_rgba(168,122,42,.8)]">
        <Icon className="h-7 w-7" strokeWidth={1.6} />
      </span>
      <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-500">{text}</p>
      {onShare && (
        <button onClick={onShare} className="btn-primary mt-5">
          <Share2 className="h-4 w-4" /> Share invitation
        </button>
      )}
    </div>
  );
}
