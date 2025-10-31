import type { TMaybe } from "@/types/base.type";
import React from "react";
import type { TFormControlContext } from "./formControl.type";

export const FormControlContext = React.createContext<TMaybe<TFormControlContext>>(null);

export const useFormControlContext = () => {
  const ctx = React.useContext(FormControlContext)
  if(ctx === null) throw new Error("form control context provider is required");
    return ctx
}