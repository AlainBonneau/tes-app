"use client";

import { createContext, useContext, useState, useCallback } from "react";
import Toaster, { Toast } from "../components/Toaster";

type ToastCtx = {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
};
const ToastContext = createContext<ToastCtx>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // Génère un id unique (timestamp + random)
  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((toasts) => [...toasts, { id, message, type }]);
      setTimeout(
        () => setToasts((toasts) => toasts.filter((t) => t.id !== id)),
        3500
      );
    },
    []
  );
  const removeToast = (id: number) =>
    setToasts((toasts) => toasts.filter((t) => t.id !== id));
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}
