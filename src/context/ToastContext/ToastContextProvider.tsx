import { useState, useCallback, useRef, type PropsWithChildren } from "react";
import { ToastContext } from "./ToastContext";
import type { TToast, TToastInput } from "@/types/toast.type";
import ToastContainer from "@/component/ui/Toast/ToastContainer";

function ToastContextProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<TToast[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Add toast to queue
  const addToast = useCallback((toastInput: TToastInput) => {
    const id = crypto.randomUUID?.() || `toast-${Date.now()}-${Math.random()}`;
    const toast: TToast = {
      id,
      duration: 5000,
      position: "top-right",
      ...toastInput,
    };

    setToasts((prev) => [...prev, toast]);

    // Auto-dismiss after duration
    if (toast.duration && toast.duration > 0) {
      const timeout = setTimeout(() => {
        removeToast(id);
      }, toast.duration);
      timeoutsRef.current.set(id, timeout);
    }
  }, []);

  // Remove toast from queue
  const removeToast = useCallback((id: string) => {
    // Clear timeout if exists
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }

    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Convenience methods
  const success = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: "success", message, duration });
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: "error", message, duration });
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: "warning", message, duration });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: "info", message, duration });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export default ToastContextProvider;
