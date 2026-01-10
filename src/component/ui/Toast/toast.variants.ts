import { cva, type VariantProps } from "class-variance-authority";

export const toastVariants = cva(
  // Base styles
  "relative flex items-start gap-3 p-4 rounded-lg shadow-lg pointer-events-auto overflow-hidden transition-all duration-300 min-w-[300px] max-w-md",
  {
    variants: {
      type: {
        success: "bg-green-50 border-l-4 border-green-500 text-green-900",
        error: "bg-red-50 border-l-4 border-brand-red text-red-900",
        warning: "bg-yellow-50 border-l-4 border-gold-500 text-yellow-900",
        info: "bg-blue-50 border-l-4 border-blue-500 text-blue-900",
      },
    },
    defaultVariants: {
      type: "info",
    },
  }
);

export const toastIconVariants = cva("flex-shrink-0 w-5 h-5", {
  variants: {
    type: {
      success: "text-green-500",
      error: "text-brand-red",
      warning: "text-gold-500",
      info: "text-blue-500",
    },
  },
  defaultVariants: {
    type: "info",
  },
});

export type ToastVariants = VariantProps<typeof toastVariants>;
