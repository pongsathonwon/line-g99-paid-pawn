import { cva, type VariantProps } from "class-variance-authority";

// Container variant - no fixed width, let parent control
export const formControlVariants = cva("flex flex-col gap-1.5");

// Label variant - no margin, parent controls spacing via gap
export const formControlLabelVariants = cva("block font-medium", {
  variants: {
    size: {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
    },
    color: {
      base: "text-gray-700",
      gold: "text-gold-700",
    },
  },
  defaultVariants: { size: "medium", color: "base" },
});

// Input variant with state support
export const formControlInputVariants = cva(
  // Base styles - layout, typography, transitions
  "w-full rounded-lg border placeholder-gray-400 bg-white transition-colors duration-200 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500",
  {
    variants: {
      // Size controls padding and text size
      size: {
        small: "px-3 py-1.5 text-sm",
        medium: "px-4 py-2 text-base",
        large: "px-5 py-3 text-lg",
      },
      // State controls border and focus ring colors
      state: {
        default:
          "border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20",
        error:
          "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
        success:
          "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20",
        warning:
          "border-yellow-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20",
      },
      // Color variant for themed forms (base vs gold theme)
      color: {
        base: "text-gray-700",
        gold: "text-gold-700",
      },
    },
    // Compound variants for color + state combinations
    compoundVariants: [
      {
        color: "gold",
        state: "default",
        class:
          "border-gold-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20",
      },
    ],
    defaultVariants: {
      size: "medium",
      color: "base",
      state: "default",
    },
  }
);

// Error text variant - no margin, parent controls spacing
export const formControlErrorVariants = cva(
  "text-sm text-red-600 flex items-start gap-1"
);

// Helper text variant (optional, for hints/descriptions)
export const formControlHelperVariants = cva("text-sm text-gray-500");

// Export types
export type FormControlVariants = VariantProps<typeof formControlVariants>;
export type FormControlLabelVariants = VariantProps<
  typeof formControlLabelVariants
>;
export type FormControlInputVariants = VariantProps<
  typeof formControlInputVariants
>;
export type FormControlErrorVariants = VariantProps<
  typeof formControlErrorVariants
>;
export type FormControlHelperVariants = VariantProps<
  typeof formControlHelperVariants
>;
