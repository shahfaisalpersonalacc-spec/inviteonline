import { Plus_Jakarta_Sans, Cormorant_Garamond, Great_Vibes, Fraunces } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/Toast";

// Runs before the page paints: a saved choice (ThemeToggle) wins, otherwise the device's own
// light/dark setting. Pages inside `.atelier` (the home page and the app) have a dark look.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;
// Also before paint: on the landing page with a saved session, cover it (.auth-pending in globals.css)
// until DashboardRedirect knows whether to go to the dashboard. It lives here, not in the page, because
// React doesn't run a <script> that a page renders in the browser (and warns about it).
const authPendingScript = `try{if(location.pathname==="/"&&localStorage.getItem("inviteonline_token"))document.documentElement.classList.add("auth-pending")}catch(e){}`;

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
    // suppressHydrationWarning: the scripts below may add "dark" and "auth-pending" here before React loads
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${cormorant.variable} ${greatVibes.variable} ${fraunces.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: authPendingScript }} />
      </head>
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
