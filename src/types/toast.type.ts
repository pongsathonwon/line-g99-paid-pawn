export type ToastType = "success" | "error" | "warning" | "info";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export type TToast = {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // milliseconds, default 5000
  position?: ToastPosition; // default "top-right"
};

export type TToastInput = Omit<TToast, "id">;

export type TToastContext = {
  toasts: TToast[];
  addToast: (toast: TToastInput) => void;
  removeToast: (id: string) => void;
  // Convenience methods
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
};
