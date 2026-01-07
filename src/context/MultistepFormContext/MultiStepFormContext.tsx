import type { TMaybe } from "@/types/base.type";
import React, { type PropsWithChildren } from "react";

type TMultiStepFormContext = {
  next: () => void;
  back: () => void;
  activePage: number;
};

export const MultiStepFormContext =
  React.createContext<TMaybe<TMultiStepFormContext>>(null);

export function useMultistepForm() {
  const ctx = React.useContext(MultiStepFormContext);
  if (ctx === null) throw new Error("multistep form provider is required");
  return ctx;
}

export function MultiStepFormContextProvider({
  children,
  totalPage,
}: PropsWithChildren<{ totalPage: number }>) {
  const [activePage, setActivePage] = React.useState(1);
  const next = () => {
    setActivePage((p) => {
      if (p === totalPage) return p;
      return p + 1;
    });
  };
  const back = () => {
    setActivePage((p) => {
      if (p === 1) return 1;
      return p - 1;
    });
  };
  return (
    <MultiStepFormContext.Provider
      value={{ activePage, totalPage, next, back }}
    >
      {children}
    </MultiStepFormContext.Provider>
  );
}
