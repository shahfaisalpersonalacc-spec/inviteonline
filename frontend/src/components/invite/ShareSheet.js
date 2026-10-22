"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Check, Copy, Download, Mail, MessageSquare, Share2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { FacebookIcon, TelegramIcon, WhatsAppIcon, XIcon } from "@/components/ui/BrandIcons";

export function shareLinks(url, title) {
  const text = `${title} — you're invited! ${url}`;
  const e = encodeURIComponent;
  return [
    { name: "WhatsApp", color: "#25D366", href: `https://wa.me/?text=${e(text)}`, Icon: WhatsAppIcon },
    { name: "Facebook", color: "#1877F2", href: `https://www.facebook.com/sharer/sharer.php?u=${e(url)}`, Icon: FacebookIcon },
    { name: "X", color: "#000000", href: `https://twitter.com/intent/tweet?text=${e(`${title} — you're invited!`)}&url=${e(url)}`, Icon: XIcon },
    { name: "Telegram", color: "#229ED9", href: `https://t.me/share/url?url=${e(url)}&text=${e(title)}`, Icon: TelegramIcon },
    { name: "Email", color: "#1c1a3d", href: `mailto:?subject=${e(`Invitation: ${title}`)}&body=${e(text)}`, Icon: Mail },
    { name: "SMS", color: "#e8544a", href: `sms:?&body=${e(text)}`, Icon: MessageSquare },
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
    <Modal open={open} onClose={onClose} title="Share your invitation">
      <div className="flex items-center gap-2 rounded-2xl border border-ink/10 bg-cream p-1.5 pl-4">
        <span className="flex-1 truncate text-sm text-ink/80">{url}</span>
        <button onClick={copy} className="btn-primary !px-4 !py-2 !text-xs">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {shareLinks(url, title).map(({ name, color, href, Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-ink/5 bg-white p-3 text-xs font-semibold text-ink/80 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full text-white" style={{ background: color }}>
              <Icon className="h-5 w-5" />
            </span>
            {name}
          </a>
        ))}
      </div>

      {canNativeShare && (
        <button onClick={() => navigator.share({ title, url }).catch(() => {})} className="btn-secondary mt-3 w-full">
          <Share2 className="h-4 w-4" /> More sharing options
        </button>
      )}

      <div className="mt-6 flex flex-col items-center gap-3 rounded-3xl bg-cream p-5">
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <QRCodeCanvas id="invite-qr" value={url} size={164} marginSize={1} fgColor="#1c1a3d" />
        </div>
        <p className="text-center text-xs text-ink-500">Print this QR code on cards so guests can scan to open the invitation.</p>
        <button onClick={downloadQr} className="btn-secondary !py-2 !text-xs">
          <Download className="h-3.5 w-3.5" /> Download QR code
        </button>
      </div>
    </Modal>
  );
}
