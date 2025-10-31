export type TColor = "red" | "mute" | "gold" | "black";
export type TFontWeight = "bold" | "normal";
export type TFontSize = "header" | "subheader" | "normal" | "small";
export type TLineStyle = "solid" | "dash";

export type TCradDividerProps = {
    color?: Exclude<TColor, "black">;
    line?: TLineStyle;
};

export type TDisplayCardContentProps = {
    color?: TColor;
    fontWeight?: TFontWeight;
};

export type THighlightLineProps = {
    fontSize?: TFontSize;
    color?: TColor;
    fontWeight?: TFontWeight;
};

export const convertBorderColor = (color: Exclude<TColor, "black">) => {
    switch (color) {
        case "red":
            return "border-brand-red";
        case "mute":
            return "border-[#8E8D89]";
        case "gold":
            return "border-gold-600";
    }
};
export const convertTextColor = (color: TColor) => {
    switch (color) {
        case "red":
            return "text-brand-red";
        case "mute":
            return "text-gray";
        case "gold":
            return "text-gold-600";
        case "black":
            return "text-black";
    }
};
export const convertLineStyle = (line: TLineStyle) => {
    switch (line) {
        case "solid":
            return "border-b";
        case "dash":
            return "border-b border-dashed";
    }
};

export const convertFontWeight = (fontWeight: TFontWeight) => {
    switch (fontWeight) {
        case "bold":
            return "font-bold";
        case "normal":
            return "font-normal";
    }
};

export const convertFontSize = (fontSize: TFontSize) => {
    switch (fontSize) {
        case "header":
            return "text-2xl";
        case "subheader":
            return "text-xl";
        case "normal":
            return "text-base";
        case "small":
            return "text-sm";
    }
};