import Link from "next/link";
import WaxSeal from "@/components/invite/entry/WaxSeal";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream p-6 text-center">
      <WaxSeal color="#7a2430" icon="heart" className="mb-2 w-24" />
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Invitation not found</h1>
      <p className="max-w-sm font-display text-lg text-ink/65">This link may be wrong, or the host has unpublished the invitation. Please check with the person who sent it.</p>
      <Link href="/" className="btn-primary mt-4">
        Create your own invitation
      </Link>
    </div>
  );
}
