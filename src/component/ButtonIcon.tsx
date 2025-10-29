import type { ReactNode } from "react";
import { Button } from "./Button";
import type { ButtonProps } from "./Button";

interface ButtonIconProps extends ButtonProps {
  icon: ReactNode;
  iconPosition?: "left" | "right";
}

export const ButtonIcon = ({
  icon,
  children,
  iconPosition = "left",
  className,
  ...props
}: ButtonIconProps) => {
  return (
    <Button {...props} className={className}>
      <span
        className={`flex items-center gap-2 ${
          iconPosition === "right" ? "flex-row-reverse" : ""
        }`}
      >
        {icon}
        <span>{children}</span>
      </span>
    </Button>
  );
};
