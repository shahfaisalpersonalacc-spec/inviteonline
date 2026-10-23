"use client";

import { useCallback, useEffect, useState } from "react";
import InvitationRenderer, { ThemeFonts, themeVars } from "@/components/invite/InvitationRenderer";
import EntryScreen from "@/components/invite/entry/EntryScreen";
import { CircleAlert, Share2 } from "lucide-react";
import MusicPlayer from "@/components/invite/MusicPlayer";
import ShareSheet from "@/components/invite/ShareSheet";
import PasswordGate from "@/components/invite/PasswordGate";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import { backgroundCss, resolveTheme } from "@/data/themes";

const tokenKey = (slug) => `unlock:${slug}`;

export default function PublicInvitation({ slug, initial }) {
  const [data, setData] = useState(initial);
  const [error, setError] = useState(initial ? "" : "loading");
  const [unlockToken, setUnlockToken] = useState(null);
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [url, setUrl] = useState("");

  const load = useCallback(
    async (token) => {
      try {
        const d = await api(`/public/${slug}`, { auth: false, headers: token ? { "x-unlock-token": token } : {} });
        setData(d);
        setError("");
        return d;
      } catch (e) {
        setError(e.message);
      }
    },
    [slug]
  );

  useEffect(() => {
    setUrl(window.location.href.split("#")[0]);
    let saved = null;
    try {
      saved = sessionStorage.getItem(tokenKey(slug));
    } catch {}
    if (saved) {
      setUnlockToken(saved);
      load(saved);
    } else if (!initial) {
      load(null);
    }
    try {
      if (!sessionStorage.getItem(`viewed:${slug}`)) {
        sessionStorage.setItem(`viewed:${slug}`, "1");
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/public/${slug}/view`, { method: "POST" }).catch(() => {});
      }
    } catch {}
  }, [slug, initial, load]);

  async function unlock(password) {
    const { unlockToken: token } = await api(`/public/${slug}/unlock`, { method: "POST", body: { password }, auth: false });
    try {
      sessionStorage.setItem(tokenKey(slug), token);
    } catch {}
    setUnlockToken(token);
    await load(token);
  }

  if (!data) {
    if (error === "loading") return <FullPageSpinner />;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
        <CircleAlert className="h-12 w-12 text-brand-500" strokeWidth={1.5} />
        <p className="text-lg font-semibold">We couldn&apos;t load this invitation</p>
        <p className="text-sm text-zinc-500">{error}</p>
        <button className="btn-primary mt-2" onClick={() => load(unlockToken)}>
          Try again
        </button>
      </div>
    );
  }

  const inv = data.invitation;
  const theme = resolveTheme(inv.theme || {});

  if (data.locked) {
    return (
      <div style={{ ...themeVars(theme), background: backgroundCss(theme), color: "var(--inv-text)", fontFamily: "var(--inv-font-body)" }}>
        <ThemeFonts theme={theme} />
        <PasswordGate title={inv.title} onUnlock={unlock} />
      </div>
    );
  }

  const hero = inv.sections?.find((s) => s.type === "hero")?.data || {};
  const music = inv.music?.enabled && inv.music?.url ? inv.music : null;
  const showEnvelope = theme.envelope !== false && !opened;

  return (
    <div style={themeVars(theme)}>
      <InvitationRenderer invitation={inv} mode="public" unlockToken={unlockToken} />

      {showEnvelope && (
        <EntryScreen
          theme={theme}
          title={hero.title || inv.title}
          subtitle={hero.tagline}
          date={hero.date}
          onStart={() => music && setPlaying(true)} // user gesture → browsers allow audio
          onOpened={() => setOpened(true)}
        />
      )}

      {music && <MusicPlayer url={music.url} title={music.title} playing={playing} setPlaying={setPlaying} />}

      <button
        onClick={() => setShareOpen(true)}
        className="fixed right-3 top-3 z-[50] grid h-11 w-11 place-items-center rounded-full text-sm font-semibold shadow-lg backdrop-blur md:bottom-5 md:right-4 md:top-auto md:inline-flex md:h-auto md:w-auto md:gap-2 md:px-5 md:py-3"
        aria-label="Share invitation"
        style={{ background: "var(--inv-primary)", color: "var(--inv-on-primary)" }}
      >
        <Share2 className="h-[18px] w-[18px]" /> <span className="hidden md:inline">Share</span>
      </button>
      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} url={url} title={inv.title} />
    </div>
  );
}
