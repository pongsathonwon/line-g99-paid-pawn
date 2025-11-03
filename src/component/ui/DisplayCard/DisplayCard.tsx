import React, { type PropsWithChildren } from "react";
import {
  convertBorderColor,
  convertFontSize,
  convertFontWeight,
  convertLineStyle,
  convertTextColor,
  getBorderStyle,
  type TCradDividerProps,
  type TDisplayCardContentProps,
  type TDisplayCardProps,
  type THighlightLineProps,
} from "./util";

function DisplayCard({
  withBorder,
  color = "mute",
  children,
}: React.PropsWithChildren & TDisplayCardProps) {
  const border = withBorder ? getBorderStyle(color) : "";
  return (
    <div className={`px-6 py-4 rounded-[20px] shadow-base ${border}`}>
      {children}
    </div>
  );
}

function Header({ children }: PropsWithChildren) {
  return <h3 className="text-2xl font-bold text-center mb-6">{children}</h3>;
}

function Subheader({ children }: React.PropsWithChildren) {
  return <h4 className="mb-3.5 font-bold">{children}</h4>;
}

function DisplayCardHighlight({
  fontSize = "normal",
  color = "black",
  fontWeight = "bold",
  className = "",
  children,
}: React.PropsWithChildren & THighlightLineProps) {
  const txtSize = convertFontSize(fontSize);
  const txtColor = convertTextColor(color);
  const txtWeight = convertFontWeight(fontWeight);
  return (
    <div className={`${txtSize} ${txtColor} ${txtWeight} ${className}`}>
      {children}
    </div>
  );
}

function DisplayCardContent({
  color = "mute",
  fontWeight = "normal",
  children,
}: React.PropsWithChildren & TDisplayCardContentProps) {
  const txtColor = convertTextColor(color);
  const txtWeight = convertFontWeight(fontWeight);

  return (
    <div className={`flex justify-between ${txtWeight} ${txtColor}`}>
      {children}
    </div>
  );
}

function ContentMuteLine({ children }: React.PropsWithChildren) {
  return (
    <DisplayCardContent color="mute" fontWeight="normal">
      {children}
    </DisplayCardContent>
  );
}

function SummaryLine({ children }: React.PropsWithChildren) {
  return (
    <DisplayCardContent color="red" fontWeight="bold">
      {children}
    </DisplayCardContent>
  );
}

function Divider({ color = "mute", line = "solid" }: TCradDividerProps) {
  const classname = `my-4 ${convertLineStyle(line)} ${convertBorderColor(
    color
  )}`;
  return <div className={classname}></div>;
}

function DisplayCardList({ children }: React.PropsWithChildren) {
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
