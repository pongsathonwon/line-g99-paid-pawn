import React from "react";
import type { TMaybe } from "@/types/base.type";
import type { TToastContext } from "@/types/toast.type";

export const ToastContext = React.createContext<TMaybe<TToastContext>>(null);

export const useToast = () => {
  const ctx = React.useContext(ToastContext);
  if (ctx === null) {
    throw new Error("useToast requires ToastContextProvider");
  }
  return ctx;
};
