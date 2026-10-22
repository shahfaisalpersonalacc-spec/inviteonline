// Minimal brand glyphs (lucide-react ships no brand logos). 24x24, currentColor.
const base = { width: 24, height: 24, viewBox: "0 0 24 24", "aria-hidden": true };

export function WhatsAppIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className} fill="currentColor">
      <path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Z" />
      <path d="M16.6 14.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}

export function FacebookIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className} fill="currentColor">
      <path d="M13.5 21.5v-8h2.7l.4-3.2h-3.1V8.3c0-.9.3-1.5 1.6-1.5h1.6V4a22 22 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v2.3H7.6v3.2h2.7v8h3.2Z" />
    </svg>
  );
}

export function XIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className} fill="currentColor">
      <path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.5l11.2 14.5Z" />
    </svg>
  );
}

export function TelegramIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className} fill="currentColor">
      <path d="M21.4 3.6 2.9 10.7c-1.3.5-1.3 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.1.9.8.9.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.8c.3-1.3-.5-1.9-1.5-1.4ZM8.6 13.4l9.3-5.9c.5-.3.9-.1.5.2l-7.8 7-.3 3.2-1.7-4.5Z" />
    </svg>
  );
}
