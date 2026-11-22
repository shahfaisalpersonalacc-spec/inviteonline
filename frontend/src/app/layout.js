import { Plus_Jakarta_Sans, Cormorant_Garamond, Great_Vibes, Fraunces } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/Toast";
import { KEYWORDS, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/seo";

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

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: KEYWORDS,
  category: "lifestyle",
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_IN", title: SITE_TITLE, description: SITE_DESCRIPTION },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  // phone numbers in invitations stay plain text unless we link them ourselves
  formatDetection: { telephone: false },
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
