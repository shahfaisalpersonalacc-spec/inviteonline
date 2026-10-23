"use client";

import { createContext, useContext } from "react";

// mode: "public" (real guests) | "editor" (owner preview: forms off, photo hints shown)
//       | "demo" (landing-page showcase: looks like the guest view, forms off)
export const InviteContext = createContext({ mode: "public", slug: "", unlockToken: null, theme: {} });
export const useInvite = () => useContext(InviteContext);
