import { Plus_Jakarta_Sans, Cormorant_Garamond, Great_Vibes, Fraunces } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/Toast";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"] });
// Site display serif (headlines on the marketing site and dashboard). Invitations keep Cormorant.
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], style: ["normal", "italic"] });
const greatVibes = Great_Vibes({ variable: "--font-great-vibes", subsets: ["latin"], weight: "400" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "InviteOnline — Invitations they'll love to open", template: "%s · InviteOnline" },
  description:
    "Create a breathtaking online invitation with a wax-sealed envelope or garden-door entrance, scratch-to-reveal date, photos, music and RSVP. Share one link anywhere.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1C1A3D",
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the landing page's inline script may add "auth-pending" here before React loads
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${cormorant.variable} ${greatVibes.variable} ${fraunces.variable} antialiased`}>
      <body className="min-h-screen font-sans">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
