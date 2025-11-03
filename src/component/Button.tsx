import type { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export type ButtonColor = "primary" | "secondary" | "gold" | "black";
export type ButtonStyleType = "solid" | "outline";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  styleType?: ButtonStyleType;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

export const Button = ({
  color = "primary",
  styleType = "solid",
  size = "md",
  fullWidth = false,
  children,
  className,
  ...props
}: ButtonProps) => {
  /** ขนาดของปุ่ม **/
  const sizeClasses: Record<ButtonSize, string> = {
    xs: "px-2.5 py-0.5 text-xs rounded-md",
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-5 py-2 text-base rounded-lg",
    lg: "px-7 py-3 text-lg rounded-xl",
  };

  /** สีของปุ่ม */
  const colorStyles: Record<ButtonColor, Record<ButtonStyleType, string>> = {
    primary: {
      solid:
        "bg-brand-red text-white hover:bg-brand-red-500 focus:ring-brand-red-500",
      outline:
        "border border-brand-red text-brand-red hover:bg-brand-red/10 focus:brand-red",
    },
    secondary: {
      solid:
        "bg-brand-red-500 text-white hover:bg-brand-red focus:ring-brand-red",
      outline:
        "border border-brand-red-500 textbrand-red-500 hover:bg-brand-red-500/10 focus:ring-brand-red-500",
    },
    gold: {
      solid: "bg-gold text-white hover:bg-gold-500 focus:ring-gold-500",
      outline:
        "border border-gold text-gold hover:bg-gold/10 focus:ring-gold-500",
    },
    black: {
      solid: "bg-gray text-white",
      outline:
        "border border-gray text-black hover:bg-black/10 focus:ring-black",
    },
  };

  const classes = twMerge(
    "inline-flex items-center justify-center font-medium transition-all duration-200",
    sizeClasses[size],
    colorStyles[color][styleType],
    fullWidth && "w-full",
    className
  );

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
