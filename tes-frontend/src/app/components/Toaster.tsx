"use client";

import { AnimatePresence, motion } from "framer-motion";

type ToastType = "success" | "error" | "info";

export type Toast = {
  id: number;
  type?: ToastType;
  message: string;
};

type Props = {
  toasts: Toast[];
  removeToast: (id: number) => void;
};

export default function Toaster({ toasts, removeToast }: Props) {
  return (
    <div className="fixed z-[9999] top-6 right-6 flex flex-col gap-3 items-end max-w-xs">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className={`
              px-5 py-4 rounded-2xl border-2 shadow-lg flex items-center gap-3
              font-uncial text-lg
              ${
                toast.type === "success" ? "bg-blood text-gold border-gold" : ""
              }
              ${
                toast.type === "error"
                  ? "bg-rune text-parchment border-rune"
                  : ""
              }
              ${
                toast.type === "info" || !toast.type
                  ? "bg-blood text-gold border-gold"
                  : ""
              }
              select-none
            `}
            role="alert"
          >
            <span className="flex-1">{toast.message}</span>
            <button
              className="ml-2 px-2 text-inherit font-bold hover:text-parchment transition"
              onClick={() => removeToast(toast.id)}
              aria-label="Fermer"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
