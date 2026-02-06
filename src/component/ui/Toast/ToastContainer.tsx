import { useToast } from "@/context/ToastContext/ToastContext";
import Toast from "./Toast";
import { cn } from "@/utils";
import type { ToastPosition } from "@/types/toast.type";

export function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  // Group toasts by position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const position = toast.position || "top-right";
    if (!acc[position]) acc[position] = [];
    acc[position].push(toast);
    return acc;
  }, {} as Record<ToastPosition, typeof toasts>);

  const positionClasses: Record<ToastPosition, string> = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  return (
    <>
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div
          key={position}
          className={cn(
            "fixed z-50 flex flex-col gap-3 pointer-events-none",
            positionClasses[position as ToastPosition]
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          {positionToasts.map((toast) => (
            <Toast key={toast.id} toast={toast} />
          ))}
        </div>
      ))}
    </>
  );
}

export default ToastContainer;
