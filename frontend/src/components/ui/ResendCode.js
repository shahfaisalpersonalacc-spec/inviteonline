"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Spinner from "./Spinner";

const COOLDOWN = 60;

// "Resend code" link with a countdown matching the server's 60s resend cooldown.
// purpose: "verify" | "reset"; or pass onResend to send the code some other way.
export default function ResendCode({ email, purpose, onResend }) {
  const [left, setLeft] = useState(COOLDOWN);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  async function resend() {
    setNote("");
    setSending(true);
    try {
      if (onResend) await onResend();
      else await api("/auth/resend-code", { method: "POST", body: { email, purpose }, auth: false });
      setNote("A new code is on its way.");
    } catch (err) {
      setNote(err.message);
    } finally {
      setSending(false);
      setLeft(COOLDOWN);
    }
  }

  return (
    <p className="text-center text-sm text-zinc-500">
      Didn&apos;t get it? Check spam, or{" "}
      {sending ? (
        <span className="inline-flex items-center gap-1.5 align-middle"><Spinner className="h-3.5 w-3.5" /> sending…</span>
      ) : left > 0 ? (
        <span>resend in {left}s</span>
      ) : (
        <button type="button" onClick={resend} className="font-semibold text-brand-600 hover:underline">
          resend code
        </button>
      )}
      {note && <span className="mt-1 block">{note}</span>}
    </p>
  );
}
