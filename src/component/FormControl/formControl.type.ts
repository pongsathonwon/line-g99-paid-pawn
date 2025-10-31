import type { InputSize } from "../types"

export type TColor = "base" | "gold"

export type TFormControlContext = {
  size? : InputSize
  id? : string
  color?: TColor
}