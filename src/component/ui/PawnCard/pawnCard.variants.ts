import { cva, type VariantProps } from "class-variance-authority";

export const pawnCardVariants = cva(
  "flex justify-between items-center bg-white rounded-2xl shadow-sm p-4 w-full gap-4 bg-[url(/header_cureve_small.png)]"
);

export const pawnCardIconVariants = cva("shrink-0", {
  variants: {
    size: {
      small: "w-6 h-8",
      default: "w-8 h-10",
      large: "w-10 h-12",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const pawnCardContentVariants = cva(
  "flex-1 text-xs leading-tight",
  {
    variants: {
      color: {
        brown: "text-[#6B4E00]",
        black: "text-black",
        gray: "text-gray-600",
      },
    },
    defaultVariants: {
      color: "brown",
    },
  }
);

export const pawnCardRowVariants = cva(
  "flex justify-between"
);

export const pawnCardActionsVariants = cva(
  "flex flex-col px-2 gap-2 text-[10px]"
);

export const pawnCardStatusTextVariants = cva(
  "font-bold leading-tight",
  {
    variants: {
      status: {
        pending: "text-brand-red-600",
        upcoming: "text-gold",
        notDue: "text-gray-600",
        active: "text-green-600",
        expired: "text-red-600",
      },
    },
    defaultVariants: {
      status: "notDue",
    },
  }
);

export type PawnCardVariants = VariantProps<typeof pawnCardVariants>;
export type PawnCardIconVariants = VariantProps<typeof pawnCardIconVariants>;
export type PawnCardContentVariants = VariantProps<
  typeof pawnCardContentVariants
>;
export type PawnCardRowVariants = VariantProps<typeof pawnCardRowVariants>;
export type PawnCardActionsVariants = VariantProps<
  typeof pawnCardActionsVariants
>;
export type PawnCardStatusTextVariants = VariantProps<
  typeof pawnCardStatusTextVariants
>;
