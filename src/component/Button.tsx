import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils";
import { buttonVariants } from "./button.variants";

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
  return (
    <button
      className={cn(buttonVariants({ size, color, styleType, fullWidth }), className)}
      {...props}
    >
      {children}
    </button>
  );
};
