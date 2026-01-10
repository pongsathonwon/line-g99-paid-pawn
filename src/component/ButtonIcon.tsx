import type { ReactNode } from "react";
import { Button } from "./Button";
import type { ButtonProps } from "./Button";

interface ButtonIconProps extends ButtonProps {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const ButtonIcon = ({
  children,
  className,
  startIcon,
  endIcon,
  ...props
}: ButtonIconProps) => {
  return (
    <Button {...props} className={className}>
      <span className="flex items-center gap-2">
        {startIcon}
        <span>{children}</span>
        {endIcon}
      </span>
    </Button>
  );
};
