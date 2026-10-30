"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Copy, Eye, Link2, ListChecks, MailOpen, Pencil, Plus, Share2, Sparkles, Trash2, Users } from "lucide-react";
import { api, inviteUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";
import Spinner from "@/components/ui/Spinner";
import DeleteInvitationDialog from "@/components/site/DeleteInvitationDialog";
import ShareSheet from "@/components/invite/ShareSheet";
import WaxSeal from "@/components/invite/entry/WaxSeal";
import { PHOTO_DOORS } from "@/components/invite/entry/PhotoDoorEntry";
import { eventTypeLabel } from "@/data/eventTypes";
import { THEMES } from "@/data/themes";
import { formatCount, timeAgo } from "@/lib/format";
import { shade } from "@/lib/color";

// The card shows the invitation's entrance: its door photo, or a mini envelope. (coverImage is
// the link-preview image for WhatsApp etc., so it isn't used here.)
function Cover({ inv }) {
  const t = { ...THEMES.blush, ...inv.theme };
  const paper = t.primary;
  const door = PHOTO_DOORS[t.entryStyle];
  if (door) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={door.src} alt="" className="h-full w-full object-cover" style={{ objectPosition: `50% ${(door.y0 + door.y1) / 2}%` }} />;
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

// A number that counts up when it first appears (and glides to a new value).
function CountUp({ value }) {
  const [n, setN] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const begin = from.current;
    let raf;
    const tick = (t) => {
      const k = Math.min(1, (t - start) / 900);
      setN(Math.round(begin + (value - begin) * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return formatCount(n);
}

// While the list loads: shimmering placeholders in the shape of the page.
function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your invitations">
      <div className="at-skel h-4 w-40" />
      <div className="at-skel mt-4 h-12 w-[min(28rem,90%)]" />
      <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-5">
        {[0, 1, 2].map((i) => <div key={i} className="at-skel h-24 rounded-3xl sm:h-28" />)}
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => <div key={i} className="at-skel h-80 rounded-[1.75rem]" />)}
      </div>
    </div>
  );
}

const STATS = [
  // label, total, icon, guests tab, icon orb colours
  ["Views", "views", Eye, "rsvps", "from-[#f7e2ad] to-[#d9ae55] text-[#6d4c12]"],
  ["RSVPs", "rsvps", ListChecks, "rsvps", "from-[#ffc7bb] to-[#e8544a] text-white"],
  ["Wishes", "wishes", MailOpen, "wishes", "from-[#e9dcfa] to-[#a58bd6] text-white"],
];

export default function DashboardPage() {
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [items, setItems] = useState(null);
  const [share, setShare] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [pending, setPending] = useState(""); // the action in flight, e.g. "copy:<id>" or "delete"

  useEffect(() => {
    api("/invitations")
      .then((d) => setItems(d.invitations))
      .catch((e) => {
        toast(e.message, "error");
        setItems([]);
      });
  }, [toast]);

  async function duplicate(id) {
    setPending(`copy:${id}`);
    try {
      const d = await api(`/invitations/${id}/duplicate`, { method: "POST" });
      toast("Invitation duplicated");
      router.push(`/dashboard/edit/${d.invitation._id}`);
    } catch (e) {
      toast(e.message, "error");
      setPending("");
    }
  }

  // throws on failure, so the dialog stays open and shows why
  async function remove() {
    await api(`/invitations/${toDelete._id}`, { method: "DELETE" });
    setItems((list) => list.filter((i) => i._id !== toDelete._id));
    setToDelete(null);
    toast("Invitation deleted");
  }

  if (!items) return <DashboardSkeleton />;

  const totals = items.reduce((a, i) => ({ views: a.views + (i.views || 0), rsvps: a.rsvps + i.rsvpCount, wishes: a.wishes + i.wishCount }), { views: 0, rsvps: 0, wishes: 0 });

  const live = items.filter((i) => i.published).length;

  return (
    <div>
      {/* welcome */}
      <section className="at-rise">
        <p className="eyebrow">
          <Sparkles className="h-3.5 w-3.5" /> Your invitations
        </p>
        <h1 className="display mt-3 text-[2.5rem] leading-[1.02] sm:text-6xl">
          Welcome back, <em>{user.name.split(" ")[0]}.</em>
        </h1>
        <p className="mt-3 text-sm text-ink/60 sm:text-base">
          {items.length === 0 ? "Let's make something beautiful together." : `${items.length} ${items.length === 1 ? "invitation" : "invitations"} · ${live} live`}
        </p>
      </section>

      {/* totals: each opens the guests page of the latest invitation */}
      <div className="mt-8 grid grid-cols-3 gap-2.5 sm:mt-10 sm:gap-5">
        {STATS.map(([label, key, Icon, tab, orb], i) => {
          const inner = (
            <>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-gradient-to-br shadow-[0_10px_20px_-12px_rgba(70,45,20,.6)] sm:h-12 sm:w-12 ${orb}`}>
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a7258] sm:text-[11px]">{label}</span>
                <span className="mt-0.5 block font-serif text-3xl leading-none text-ink tabular-nums sm:text-[2.6rem]" title={totals[key].toLocaleString()}>
                  <CountUp value={totals[key]} />
                </span>
              </span>
            </>
          );
          const cls = "at-glass at-rise group relative flex flex-col gap-2.5 rounded-3xl p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-5";
          return items[0] ? (
            // Totals span every invitation; the guests page is per invitation, so open the latest one (list is newest-edited first).
            <Link
              key={label}
              href={`/dashboard/${items[0]._id}/guests${tab === "wishes" ? "?tab=wishes" : ""}`}
              aria-label={`${label}: ${totals[key]}. See them on the guests page`}
              style={{ "--i": i + 1 }}
              className={`${cls} at-ring transition duration-300 hover:-translate-y-1`}
            >
              {inner}
              <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-[#b9a07a] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink sm:right-4 sm:top-4" aria-hidden />
            </Link>
          ) : (
            <div key={label} style={{ "--i": i + 1 }} className={cls}>
              {inner}
            </div>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div className="at-glass at-rise relative mt-10 flex flex-col items-center overflow-hidden rounded-[2rem] px-6 py-16 text-center" style={{ "--i": 4 }}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_50%_30%,rgba(243,213,140,.35),transparent_70%)]" />
          <div className="at-float relative">
            <WaxSeal color="#7a2430" icon="heart" className="w-24 drop-shadow-[0_18px_24px_rgba(122,36,48,.35)]" />
          </div>
          <h2 className="display relative mt-7 text-3xl sm:text-4xl">
            Your first invitation <em>awaits.</em>
          </h2>
          <p className="relative mt-3 max-w-sm leading-relaxed text-ink/65">Pick an event and an entrance, make it yours and share one link with everyone.</p>
          <Link href="/dashboard/new" className="btn-coral relative mt-8 !px-7 !py-3">
            <Plus className="h-4 w-4" /> Create my first invitation
          </Link>
        </div>
      ) : (
        <>
          <div className="at-rise mt-12 flex items-center gap-3" style={{ "--i": 4 }}>
            <h2 className="display text-2xl sm:text-3xl">Your collection</h2>
            <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-bold text-[#8a7258] ring-1 ring-gold-600/25">{items.length}</span>
            <span className="h-px flex-1 bg-gradient-to-r from-gold-600/40 to-transparent" aria-hidden />
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((inv, i) => (
              <article
                key={inv._id}
                style={{ "--i": Math.min(i, 6) + 5 }}
                className="at-glass at-ring at-rise group flex flex-col overflow-hidden rounded-[1.75rem] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_40px_70px_-40px_rgba(70,45,20,.6)]"
              >
                <Link href={`/dashboard/edit/${inv._id}`} className="relative m-2 mb-0 block aspect-[16/10] overflow-hidden rounded-[1.35rem]" aria-label={`Edit ${inv.title}`}>
                  <div className="h-full w-full transition duration-700 ease-out group-hover:scale-[1.06]">
                    <Cover inv={inv} />
                  </div>
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent" aria-hidden />
                  <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur-md ${inv.published ? "bg-white/85 text-emerald-700" : "bg-white/75 text-ink-500"}`}>
                    <span className="relative flex h-2 w-2">
                      {inv.published && <span className="absolute inset-0 animate-[at-ping_2s_ease-out_infinite] rounded-full bg-emerald-400 motion-reduce:hidden" />}
                      <span className={`relative h-2 w-2 rounded-full ${inv.published ? "bg-emerald-500" : "bg-zinc-400"}`} />
                    </span>
                    {inv.published ? "Live" : "Draft"}
                  </span>
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">{eventTypeLabel(inv.eventType)}</span>
                </Link>
                <div className="flex flex-1 flex-col px-5 pb-4 pt-4">
                  <h3 className="truncate font-serif text-[1.5rem] leading-tight text-ink">{inv.title}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
                    <Link2 className="h-3.5 w-3.5 shrink-0 text-gold-600" />
                    <span className="truncate font-medium text-brand-600">/i/{inv.slug}</span>
                    <span className="text-ink/30">·</span>
                    <span className="shrink-0">edited {timeAgo(inv.updatedAt)}</span>
                  </p>
                  <div className="mt-3.5 flex gap-2 text-xs font-semibold text-ink">
                    {[
                      [Eye, inv.views || 0, "views"],
                      [ListChecks, inv.rsvpCount, "RSVPs"],
                      [MailOpen, inv.wishCount, "wishes"],
                    ].map(([Icon, n, what]) => (
                      <span key={what} className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 ring-1 ring-ink/[0.06]" title={`${n} ${what}`}>
                        <Icon className="h-3.5 w-3.5 text-gold-600" /> {formatCount(n)}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link href={`/dashboard/edit/${inv._id}`} className="btn-primary !py-2.5 !text-xs">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <button onClick={() => setShare(inv)} className="btn-secondary !py-2.5 !text-xs">
                      <Share2 className="h-3.5 w-3.5" /> Share
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-1 border-t border-gold-600/15 pt-3 text-[11px] font-semibold sm:text-xs">
                    <a href={`/i/${inv.slug}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-ink-500 transition hover:bg-white/80 hover:text-ink min-[380px]:flex-row">
                      <Eye className="h-3.5 w-3.5" /> View
                    </a>
                    <Link href={`/dashboard/${inv._id}/guests`} className="flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-ink-500 transition hover:bg-white/80 hover:text-ink min-[380px]:flex-row">
                      <Users className="h-3.5 w-3.5" /> Guests
                    </Link>
                    <button onClick={() => duplicate(inv._id)} disabled={!!pending} className="flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-ink-500 transition hover:bg-white/80 hover:text-ink disabled:opacity-60 min-[380px]:flex-row">
                      {pending === `copy:${inv._id}` ? <Spinner className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} Copy
                    </button>
                    <button onClick={() => setToDelete(inv)} className="flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-red-600 transition hover:bg-red-50 min-[380px]:flex-row">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {/* one more card: start another (phones have the round + button instead) */}
            <Link
              href="/dashboard/new"
              style={{ "--i": Math.min(items.length, 6) + 5 }}
              className="at-rise group relative hidden min-h-64 flex-col items-center justify-center gap-4 overflow-hidden rounded-[1.75rem] border-2 border-dashed border-gold-600/35 bg-white/30 p-8 text-center transition duration-500 hover:border-gold-600/70 hover:bg-white/55 sm:flex"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#fff1c9] to-[#d9ae55] text-[#6d4c12] shadow-[0_16px_30px_-16px_rgba(168,122,42,.8)] transition duration-500 group-hover:rotate-90 group-hover:scale-110">
                <Plus className="h-7 w-7" />
              </span>
              <span>
                <span className="block font-serif text-2xl text-ink">Start a new one</span>
                <span className="mt-1 block text-sm text-ink-500">A wedding, a birthday, anything worth celebrating.</span>
              </span>
            </Link>
          </div>
        </>
      )}

      {share && <ShareSheet open onClose={() => setShare(null)} url={inviteUrl(share.slug)} title={share.title} />}

      <DeleteInvitationDialog open={!!toDelete} title={toDelete?.title} onClose={() => setToDelete(null)} onConfirm={remove} />
    </div>
  );
}
