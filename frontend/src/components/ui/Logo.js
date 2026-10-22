import Link from "next/link";

export default function Logo({ className = "", light = false }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 text-lg text-white shadow-lg shadow-brand-500/30">
        ✉
      </span>
      <span className={`text-xl font-bold tracking-tight ${light ? "text-white" : "text-zinc-900"}`}>
        Invite<span className="text-brand-600">Online</span>
      </span>
    </Link>
  );
}
