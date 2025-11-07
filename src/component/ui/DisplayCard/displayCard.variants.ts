import { cva, type VariantProps } from "class-variance-authority";

export const displayCardVariants = cva(
  "px-6 py-4 rounded-[20px] shadow-base",
  {
    variants: {
      color: {
        red: "",
        base: "",
        gold: "",
        black: "",
      },
      withBorder: {
        true: "border-l-8 pl-4",
        false: "",
      },
    },

    compoundVariants: [
      {
        color: "red",
        withBorder: true,
        class: "border-brand-red",
      },
      {
        color: "base",
        withBorder: true,
        class: "border-gray",
      },
      {
        color: "gold",
        withBorder: true,
        class: "border-gold-600",
      },
      {
        color: "black",
        withBorder: true,
        class: "border-black",
      },
    ],
    defaultVariants: {
      color: "base",
      withBorder: false,
    },
  }
);

export const headerVariants = cva("text-2xl font-bold text-center mb-6", {
  variants: {
    color: {
      red: "text-brand-red",
      base: "text-black",
      gold: "text-gold-600",
      black: "text-black",
    },
  },
  defaultVariants: {
    color: "base",
  },
});

export const subheaderVariants = cva("mb-3.5 font-bold", {
  variants: {
    color: {
      red: "text-brand-red",
      base: "text-black",
      gold: "text-gold-600",
      black: "text-black",
    },
  },
  defaultVariants: {
    color: "base",
  },
});

export const highlightVariants = cva("", {
  variants: {
    fontSize: {
      header: "text-2xl",
      subheader: "text-xl",
      normal: "text-base",
      small: "text-sm",
    },
    color: {
      red: "text-brand-red",
      base: "text-gray",
      gold: "text-gold-600",
      black: "text-black",
    },
    fontWeight: {
      bold: "font-bold",
      normal: "font-normal",
    },
  },
  defaultVariants: {
    fontSize: "normal",
    color: "black",
    fontWeight: "bold",
  },
});

export const contentVariants = cva("flex justify-between text-gray", {
  variants: {
    color: {
      red: "text-brand-red",
      base: "text-gray",
      gold: "text-gold-600",
      black: "text-black",
    },
    fontWeight: {
      bold: "font-bold",
      normal: "font-normal",
    },
  },
  defaultVariants: {
    color: "base",
    fontWeight: "normal",
  },
});

export const dividerVariants = cva("my-4", {
  variants: {
    color: {
      red: "border-brand-red",
      base: "border-[#8E8D89]",
      gold: "border-gold-600",
    },
    line: {
      solid: "border-b",
      dash: "border-b border-dashed",
    },
  },
  defaultVariants: {
    color: "base",
    line: "solid",
  },
});

export type DisplayCardVariants = VariantProps<typeof displayCardVariants>;
export type HeaderVariants = VariantProps<typeof headerVariants>;
export type SubheaderVariants = VariantProps<typeof subheaderVariants>;
export type HighlightVariants = VariantProps<typeof highlightVariants>;
export type ContentVariants = VariantProps<typeof contentVariants>;
export type DividerVariants = VariantProps<typeof dividerVariants>;
