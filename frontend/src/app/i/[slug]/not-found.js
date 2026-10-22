import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-brand-50 p-6 text-center">
      <div className="text-6xl">💌</div>
      <h1 className="text-2xl font-bold text-zinc-900">Invitation not found</h1>
      <p className="max-w-sm text-sm text-zinc-600">This link may be wrong, or the host has unpublished the invitation. Please check with the person who sent it.</p>
      <Link href="/" className="btn-primary mt-3">
        Create your own invitation
      </Link>
    </div>
  );
}
