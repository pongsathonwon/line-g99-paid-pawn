import type { InputSize } from "../types"
import type { TColor } from "./formControl.type"

// migrate to clxs and twMerge later on

export const createFormSpacing = (size : InputSize ) => {
  switch(size){
    case "small": return "px-3 py-1.5"
    case "medium": return "px-4 py-2"
    case "large": return "px-3 py-1.5"
    default : return "px-4 py-2"
  }
}

export const createFormFontSize = (size : InputSize) => {
  switch(size){
    case "small": return "text-sm"
    case "medium": return "text-base"
    case "large": return "text-lg"
    default : return "text-base"
  }
}

export const createFormTextColor = (color : TColor ) => {
  switch(color){
    case "base": return "text-gray-700"
    case "gold": return "text-gold-700"
    default : return "text-gray-700"
  }
}
export const createFormBorderColor = (color : TColor ) => {
  switch(color){
    case "base": return "border-gray-700"
    case "gold": return "border-gold-700"
    default : return "border-gray-700"
  }
}