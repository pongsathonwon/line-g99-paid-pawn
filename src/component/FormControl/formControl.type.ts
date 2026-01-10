import type { InputSize } from "../types";

export type TColor = "base" | "gold";

// Add state type for visual feedback
export type TState = "default" | "error" | "success" | "warning";

export type TFormControlContext = {
  size: InputSize;
  id: string;
  color: TColor;
  state: TState; // Add state to context
};

// Re-export variant types for external use
export type {
  FormControlVariants,
  FormControlLabelVariants,
  FormControlInputVariants,
  FormControlErrorVariants,
  FormControlHelperVariants,
} from "./formControl.variants";