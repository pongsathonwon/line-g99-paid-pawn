import type { InputSize } from "../types"
import type { TColor } from "./formControl.type"

// migrate to clxs and twMerge later on

const FORM_SPACING: Record<InputSize, string> = {
  small: "px-3 py-1.5",
  medium: "px-4 py-2",
  large: "px-5 py-3",
};

const FORM_FONT_SIZE: Record<InputSize, string> = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
};

const FORM_TEXT_COLOR: Record<TColor, string> = {
  base: "text-gray-700",
  gold: "text-gold-700",
};

const FORM_BORDER_COLOR: Record<TColor, string> = {
  base: "border-gray-700",
  gold: "border-gold-700",
};

export const getFormSpacing = (size: InputSize): string =>
  FORM_SPACING[size] ?? FORM_SPACING.medium;

export const getFormFontSize = (size: InputSize): string =>
  FORM_FONT_SIZE[size] ?? FORM_FONT_SIZE.medium;

export const getFormTextColor = (color: TColor): string =>
  FORM_TEXT_COLOR[color] ?? FORM_TEXT_COLOR.base;

export const getFormBorderColor = (color: TColor): string =>
  FORM_BORDER_COLOR[color] ?? FORM_BORDER_COLOR.base;
