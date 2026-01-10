import { type PropsWithChildren } from "react";
import { cn } from "@/utils";
import {
  displayCardVariants,
  headerVariants,
  subheaderVariants,
  highlightVariants,
  contentVariants,
  dividerVariants,
  type DisplayCardVariants,
  type HeaderVariants,
  type SubheaderVariants,
  type HighlightVariants,
  type ContentVariants,
  type DividerVariants,
} from "./displayCard.variants";

// Main DisplayCard Component
type DisplayCardProps = PropsWithChildren &
  DisplayCardVariants & {
    className?: string;
  };

function DisplayCard({
  withBorder = false,
  color = "base",
  className,
  children,
}: DisplayCardProps) {
  return (
    <div className={cn(displayCardVariants({ withBorder, color }), className)}>
      {children}
    </div>
  );
}

// Header Component
type HeaderProps = PropsWithChildren &
  HeaderVariants & {
    className?: string;
  };

function Header({ color = "base", className, children }: HeaderProps) {
  return (
    <h3 className={cn(headerVariants({ color }), className)}>{children}</h3>
  );
}

// Subheader Component
type SubheaderProps = PropsWithChildren &
  SubheaderVariants & {
    className?: string;
  };

function Subheader({ color = "base", className, children }: SubheaderProps) {
  return (
    <h4 className={cn(subheaderVariants({ color }), className)}>{children}</h4>
  );
}

// Highlight Component - Base component with full customization
type HighlightProps = PropsWithChildren &
  HighlightVariants & {
    className?: string;
  };

function DisplayCardHighlight({
  fontSize = "normal",
  color = "black",
  fontWeight = "bold",
  className,
  children,
}: HighlightProps) {
  return (
    <div
      className={cn(
        highlightVariants({ fontSize, color, fontWeight }),
        className
      )}
    >
      {children}
    </div>
  );
}

// Content Component - Base component for content lines (flex layout with gray text by default)
type ContentProps = PropsWithChildren &
  ContentVariants & {
    className?: string;
  };

function DisplayCardContent({
  color = "base",
  fontWeight = "normal",
  className,
  children,
}: ContentProps) {
  return (
    <div className={cn(contentVariants({ color, fontWeight }), className)}>
      {children}
    </div>
  );
}

// ContentMuteLine - Applies gray text with normal weight to DisplayCardContent
function ContentMuteLine({ children }: PropsWithChildren) {
  return (
    <DisplayCardContent color="base" fontWeight="normal">
      {children}
    </DisplayCardContent>
  );
}

// SummaryLine - Applies red text with bold weight to DisplayCardContent
function SummaryLine({ children }: PropsWithChildren) {
  return (
    <DisplayCardContent color="red" fontWeight="bold">
      {children}
    </DisplayCardContent>
  );
}

// Divider Component
type DividerProps = DividerVariants & {
  className?: string;
};

function Divider({
  color = "base",
  line = "solid",
  className,
}: DividerProps) {
  return <div className={cn(dividerVariants({ color, line }), className)} />;
}

// OrderList Component
function DisplayCardList({ children }: PropsWithChildren) {
  return (
    <ol className="text-xs list-decimal ps-4 text-gray flex flex-col">
      {children}
    </ol>
  );
}

DisplayCard.Header = Header;
DisplayCard.Subheader = Subheader;
DisplayCard.Mute = ContentMuteLine;
DisplayCard.Summary = SummaryLine;
DisplayCard.Divider = Divider;
DisplayCard.Highlight = DisplayCardHighlight;
DisplayCard.OrderList = DisplayCardList;

export default DisplayCard;
