"use client";

import { createContext, useCallback, useContext, useState } from "react";

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
            className={`animate-float-up pointer-events-auto max-w-sm rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-xl ${
              t.type === "error" ? "bg-red-600" : "bg-zinc-900"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext).toast;
