"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type ToastItem = {
  id: string;
  type: "success" | "error";
  message: string;
};

type AppContextValue = {
  success: (message: string) => void;
  error: (message: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProviders({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  function addToast(type: ToastItem["type"], message: string) {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3200);
  }

  const value = useMemo<AppContextValue>(
    () => ({
      success: (message: string) => addToast("success", message),
      error: (message: string) => addToast("error", message),
    }),
    [],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={[
              "toast-enter rounded-2xl border px-4 py-3 text-sm font-medium backdrop-blur-xl",
              "shadow-[0_12px_36px_rgba(4,4,10,0.45)]",
              toast.type === "success"
                ? "border-white/10 bg-gradient-to-r from-[#7f5af0]/25 to-[#a78bfa]/12 text-[#ddd6fe]"
                : "border-danger/35 bg-gradient-to-r from-danger/25 to-[#2d0f1a] text-rose-200",
            ].join(" ")}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useAppUI() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppUI must be used within AppProviders");
  }

  return context;
}
