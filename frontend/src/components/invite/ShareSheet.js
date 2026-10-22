"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Modal from "@/components/ui/Modal";

export function shareLinks(url, title) {
  const text = `${title} — you're invited! ${url}`;
  const e = encodeURIComponent;
  return [
    { name: "WhatsApp", color: "#25D366", href: `https://wa.me/?text=${e(text)}`, icon: "🟢" },
    { name: "Facebook", color: "#1877F2", href: `https://www.facebook.com/sharer/sharer.php?u=${e(url)}`, icon: "📘" },
    { name: "X / Twitter", color: "#000000", href: `https://twitter.com/intent/tweet?text=${e(`${title} — you're invited!`)}&url=${e(url)}`, icon: "✖️" },
    { name: "Telegram", color: "#229ED9", href: `https://t.me/share/url?url=${e(url)}&text=${e(title)}`, icon: "✈️" },
    { name: "Email", color: "#6b7280", href: `mailto:?subject=${e(`Invitation: ${title}`)}&body=${e(text)}`, icon: "✉️" },
    { name: "SMS", color: "#16a34a", href: `sms:?&body=${e(text)}`, icon: "💬" },
  ];
}

export default function ShareSheet({ open, onClose, url, title }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const t = document.createElement("textarea");
      t.value = url;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadQr() {
    const canvas = document.getElementById("invite-qr");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "invitation-qr.png";
    a.click();
  }

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <Modal open={open} onClose={onClose} title="Share invitation">
      <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-1.5 pl-3">
        <span className="flex-1 truncate text-sm text-zinc-700">{url}</span>
        <button onClick={copy} className="btn-primary !px-4 !py-2 !text-xs">
          {copied ? "Copied ✓" : "Copy link"}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-3">
        {shareLinks(url, title).map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 rounded-2xl border border-zinc-100 p-3 text-xs font-medium text-zinc-700 transition hover:border-zinc-300"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full text-lg text-white" style={{ background: s.color }}>
              {s.icon}
            </span>
            {s.name}
          </a>
        ))}
      </div>

      {canNativeShare && (
        <button onClick={() => navigator.share({ title, url }).catch(() => {})} className="btn-secondary mt-3 w-full">
          More sharing options…
        </button>
      )}

      <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-zinc-50 p-5">
        <QRCodeCanvas id="invite-qr" value={url} size={168} marginSize={2} />
        <p className="text-center text-xs text-zinc-500">Print this QR code on cards so guests can scan to open the invitation.</p>
        <button onClick={downloadQr} className="btn-secondary !py-2 !text-xs">
          Download QR code
        </button>
      </div>
    </Modal>
  );
}
