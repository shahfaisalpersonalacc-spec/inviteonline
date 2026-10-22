import { Poppins, Great_Vibes } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/Toast";

const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
const greatVibes = Great_Vibes({ variable: "--font-great-vibes", subsets: ["latin"], weight: "400" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "InviteOnline — Beautiful online invitations", template: "%s · InviteOnline" },
  description:
    "Create a stunning invitation page for your wedding, birthday or any event. Add photos, stickers, music, RSVP and share the link anywhere.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#db2777",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${greatVibes.variable} antialiased`}>
      <body className="min-h-screen font-sans">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
