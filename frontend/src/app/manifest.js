import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

// Lets phones add InviteOnline to the home screen like an app, with its name, colours and icon.
export default function manifest() {
  return {
    name: `${SITE_NAME}: Online Invitations`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#fbf6ee",
    theme_color: "#1C1A3D",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
