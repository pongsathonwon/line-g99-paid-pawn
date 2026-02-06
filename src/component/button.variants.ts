import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  // Base styles - layout, typography, transitions
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      // Size controls padding, text size, and border radius
      size: {
        xs: "px-2.5 py-0.5 text-xs rounded-md",
        sm: "px-3 py-1.5 text-sm rounded-md",
        md: "px-5 py-2 text-base rounded-lg",
        lg: "px-7 py-3 text-lg rounded-xl",
      },
      // Color variant for different button themes
      color: {
        primary: "",
        secondary: "",
        gold: "",
        black: "",
        green: "",
      },
      // Style type: solid or outline
      styleType: {
        solid: "",
        outline: "border bg-transparent",
      },
      // Full width option
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    // Compound variants for color + styleType combinations
    compoundVariants: [
      // Primary solid
      {
        color: "primary",
        styleType: "solid",
        class:
          "bg-brand-red text-white hover:bg-brand-red-500 focus:ring-2 focus:ring-brand-red-500 focus:ring-offset-2",
      },
      // Primary outline
      {
        color: "primary",
        styleType: "outline",
        class:
          "border-brand-red text-brand-red hover:bg-brand-red/10 focus:ring-2 focus:ring-brand-red focus:ring-offset-2",
      },
      // Secondary solid
      {
        color: "secondary",
        styleType: "solid",
        class:
          "bg-brand-red-500 text-white hover:bg-brand-red focus:ring-2 focus:ring-brand-red focus:ring-offset-2",
      },
      // Secondary outline
      {
        color: "secondary",
        styleType: "outline",
        class:
          "border-brand-red-500 text-brand-red-500 hover:bg-brand-red-500/10 focus:ring-2 focus:ring-brand-red-500 focus:ring-offset-2",
      },
      // Gold solid
      {
        color: "gold",
        styleType: "solid",
        class:
          "bg-gold text-white hover:bg-gold-500 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2",
      },
      // Gold outline
      {
        color: "gold",
        styleType: "outline",
        class:
          "border-gold text-gold hover:bg-gold/10 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2",
      },
      // Black solid
      {
        color: "black",
        styleType: "solid",
        class:
          "bg-gray text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
      },
      // Black outline
      {
        color: "black",
        styleType: "outline",
        class:
          "border-gray text-black hover:bg-black/10 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
      },
      // Green solid
      {
        color: "green",
        styleType: "solid",
        class:
          "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
      },
      // Green outline
      {
        color: "green",
        styleType: "outline",
        class:
          "border-green-600 text-green-600 hover:bg-green-600/10 focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
      },
    ],
    defaultVariants: {
      size: "md",
      color: "primary",
      styleType: "solid",
      fullWidth: false,
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
