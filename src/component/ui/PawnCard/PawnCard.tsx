import { type PropsWithChildren } from "react";
import { cn } from "@/utils";
import {
  pawnCardVariants,
  pawnCardIconVariants,
  pawnCardContentVariants,
  pawnCardRowVariants,
  pawnCardActionsVariants,
  pawnCardStatusTextVariants,
  type PawnCardIconVariants,
  type PawnCardContentVariants,
  type PawnCardStatusTextVariants,
} from "./pawnCard.variants";

type PawnCardProps = PropsWithChildren & {
  className?: string;
};

function PawnCard({ className, children }: PawnCardProps) {
  return <div className={cn(pawnCardVariants(), className)}>{children}</div>;
}

type IconProps = PawnCardIconVariants & {
  src: string;
  alt: string;
  className?: string;
};

function Icon({ size = "default", src, alt, className }: IconProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(pawnCardIconVariants({ size }), className)}
    />
  );
}

type ContentProps = PropsWithChildren &
  PawnCardContentVariants & {
    className?: string;
  };

function Content({ color = "brown", className, children }: ContentProps) {
  return (
    <div className={cn(pawnCardContentVariants({ color }), className)}>
      {children}
    </div>
  );
}

type RowProps = PropsWithChildren & {
  className?: string;
};

function Row({ className, children }: RowProps) {
  return <div className={cn(pawnCardRowVariants(), className)}>{children}</div>;
}

type ActionsProps = PropsWithChildren & {
  className?: string;
};

function Actions({ className, children }: ActionsProps) {
  return (
    <div className={cn(pawnCardActionsVariants(), className)}>{children}</div>
  );
}

type StatusTextProps = PropsWithChildren &
  PawnCardStatusTextVariants & {
    className?: string;
  };

function StatusText({
  status = "notDue",
  className,
  children,
}: StatusTextProps) {
  return (
    <span className={cn(pawnCardStatusTextVariants({ status }), className)}>
      {children}
    </span>
  );
}

PawnCard.Icon = Icon;
PawnCard.Content = Content;
PawnCard.Row = Row;
PawnCard.Actions = Actions;
PawnCard.StatusText = StatusText;

export default PawnCard;
