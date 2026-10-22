"use client";

import { createContext, useContext } from "react";

// mode: "public" (real guests) | "editor" (owner preview — forms don't submit)
export const InviteContext = createContext({ mode: "public", slug: "", unlockToken: null, theme: {} });
export const useInvite = () => useContext(InviteContext);
