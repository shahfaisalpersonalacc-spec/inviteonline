"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AlertCircle, Check } from "lucide-react";

const ToastContext = createContext({ toast: () => {} });

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const toast = useCallback((message, type = "success") => {
    const id = Math.random().toString(36).slice(2);
    setItems((list) => [...list, { id, message, type }]);
    setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`at-pop pointer-events-auto relative flex max-w-sm items-center gap-2.5 overflow-hidden rounded-full py-2 pl-2 pr-5 text-sm font-medium text-white shadow-[0_20px_40px_-16px_rgba(28,26,61,.6)] ring-1 backdrop-blur-xl ${
              t.type === "error" ? "bg-red-600/95 ring-red-300/40" : "bg-[#1c1a3d]/92 ring-[#e9cd84]/35"
            }`}
          >
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${t.type === "error" ? "bg-white/20" : "bg-gradient-to-br from-[#f3d58c] to-[#c9a24a] text-[#1c1a3d]"}`}>
              {t.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" strokeWidth={3} />}
            </span>
            {t.message}
            {/* time left before it goes */}
            <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left animate-[at-toast-bar_3.5s_linear_forwards] bg-white/40" aria-hidden />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext).toast;
