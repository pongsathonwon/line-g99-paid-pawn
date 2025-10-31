import type { InputSize } from "../types"
import type { TColor } from "./formControl.type"

// migrate to clxs and twMerge later on

export const createFormSpacing = (size : InputSize | undefined) => {
  switch(size){
    case "small": return "px-3 py-1.5"
    case "medium": return "px-4 py-2"
    case "large": return "px-3 py-1.5"
      default: return "px-4 py-2"
  }
}

export const createFormFontSize = (size : InputSize | undefined) => {
  switch(size){
    case "small": return "text-sm"
    case "medium": return "text-base"
    case "large": return "text-lg"
      default: return "text-base"
  }
}

export const createFormTextColor = (color : TColor | undefined) => {
  switch(color){
    case "base": return ""
    case "gold": return ""
    return ""
  }
}
export const createFormBorderColor = (color : TColor | undefined) => {
  switch(color){
    case "base": return ""
    case "gold": return ""
    return ""
  }
}