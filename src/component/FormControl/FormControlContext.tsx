import type { TMaybe } from "@/types/base.type";
import React from "react";
import type { TFormControlContext } from "./formControl.type";
import {
  getFormBorderColor,
  getFormFontSize,
  getFormSpacing,
  getFormTextColor,
} from "./utils";

export const FormControlContext =
  React.createContext<TMaybe<TFormControlContext>>(null);

export const useFormControlContext = () => {
  const ctx = React.useContext(FormControlContext);
  if (ctx === null)
    throw new Error("form control context provider is required");
  return ctx;
};

export const useFormControlClass = () => {
  const { size, color } = useFormControlContext();
  return React.useMemo(() => {
    const fontSize = getFormFontSize(size);
    const spacing = getFormSpacing(size);
    const textColor = getFormTextColor(color);
    const borderColor = getFormBorderColor(color);
    const baseLabelClass = "block font-medium mb-1.5";
    const baseInputClass =
      "w-full mb-1.5 rounded-lg border-[0.5px] placeholder-gray-400 bg-white transition-colors duration-200 focus:outline-none focus:ring-[0.5px] focus:ring-opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500";
    const labelClass = `${baseLabelClass} ${textColor} ${fontSize}`;
    const inputClass = `${baseInputClass} ${textColor} ${borderColor} ${spacing}`;
    return { labelClass, inputClass };
  }, [size, color]);
};
