import type { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: ReactNode;
  fullWidth?: boolean;
}

/**
 * Button Component
 * - ใช้ tailwind เพื่อจัดสไตล์
 * - รองรับ variant สำหรับสีหลัก / รอง / เส้นขอบ
 * - ใช้ twMerge เพื่อรวม className จากภายนอกโดยไม่ชนกัน
 */
export const Button = ({
  variant = "primary",
  children,
  className,
  fullWidth = false,
  ...props
}: ButtonProps) => {
  const baseStyle =
    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200";

  const variantStyle = {
    primary:
      "bg-button-primary text-white hover:bg-[--color-button-secondary] focus:ring-[--color-button-outline]",
    secondary:
      "bg-button-secondary text-white hover:bg-[--color-button-primary] focus:ring-[--color-button-outline]",
    outline:
      "border border-button-outline text-button-outline hover:bg-button-outline/10 focus:ring-button-outline",
  };

  return (
    <button
      className={twMerge(
        baseStyle,
        variantStyle[variant],
        fullWidth && "w-full",
        "px-6 py-3 text-sm md:text-base",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
