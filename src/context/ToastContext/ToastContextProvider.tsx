import {
  useState,
  useCallback,
  useEffect,
  type PropsWithChildren,
} from "react";
import { ToastContext } from "./ToastContext";
import type { TToast, TToastInput } from "@/types/toast.type";
import ToastContainer from "@/component/ui/Toast/ToastContainer";
import { filterToast } from "./lib";

function ToastContextProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<TToast[]>([]);
  const timerStep = 1000;
  const filterToastWithStep = filterToast(timerStep);
  useEffect(() => {
    if (toasts.length === 0) return;
    const interval = setInterval(() => {
      setToasts((prev) => prev.flatMap(filterToastWithStep));
    }, timerStep);

    return () => clearInterval(interval);
  }, [toasts.length]);

  // Remove toast from queue
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Add toast to queue
  const addToast = useCallback((toastInput: TToastInput) => {
    const id = crypto.randomUUID?.() || `toast-${Date.now()}`;
    const toast: TToast = {
      id,
      duration: 1000,
      position: "top-right",
      ...toastInput,
    };

    setToasts((prev) => [...prev, toast]);
  }, []);

  // Convenience methods
  const success = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: "success", message, duration: duration ?? 1000 });
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: "error", message, duration: duration ?? 1000 });
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: "warning", message, duration: duration ?? 1000 });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: "info", message, duration: duration ?? 1000 });
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
