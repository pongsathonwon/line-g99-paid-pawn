import { useState } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import type { TToast } from "@/types/toast.type";
import { useToast } from "@/context/ToastContext/ToastContext";
import { cn } from "@/utils";
import { toastVariants, toastIconVariants } from "./toast.variants";

interface ToastProps {
  toast: TToast;
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export function Toast({ toast }: ToastProps) {
  const { removeToast } = useToast();
  const [isExiting, setIsExiting] = useState(false);

  const Icon = toastIcons[toast.type];

  const handleDismiss = () => {
    setIsExiting(true);
    // Wait for animation to complete before removing
    setTimeout(() => {
      removeToast(toast.id);
    }, 300);
  };

  return (
    <div
      className={cn(
        toastVariants({ type: toast.type }),
        // Slide animation
        isExiting
          ? "translate-x-full opacity-0"
          : "translate-x-0 opacity-100 animate-slide-in"
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <Icon className={toastIconVariants({ type: toast.type })} />

      {/* Message */}
      <p className="flex-1 text-sm font-medium pr-2">{toast.message}</p>

      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="ปิดการแจ้งเตือน"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

export default Toast;
