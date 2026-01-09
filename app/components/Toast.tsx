"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Icon } from "./Icon";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  showToast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto animate-slide-up"
            onClick={() => dismissToast(toast.id)}
          >
            <div
              className={`
                flex items-center gap-2 px-4 py-3 rounded-full shadow-lg backdrop-blur-sm cursor-pointer
                transition-all hover:scale-105
                ${toast.type === "success" ? "bg-slate-900/95 text-white" : ""}
                ${toast.type === "error" ? "bg-red-500/95 text-white" : ""}
                ${toast.type === "info" ? "bg-white/95 text-slate-900 border border-slate-200" : ""}
              `}
            >
              {toast.type === "success" && (
                <Icon name="lucide:check" size={16} className="text-emerald-400" />
              )}
              {toast.type === "error" && (
                <Icon name="lucide:x" size={16} />
              )}
              {toast.type === "info" && (
                <Icon name="lucide:info" size={16} className="text-slate-500" />
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
