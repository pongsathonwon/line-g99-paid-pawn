import { MultiStepFormContextProvider } from "@/context/MultistepFormContext/MultiStepFormContext";
import type { PropsWithChildren } from "react";

export const multistepFormWrapperFactory =
  (totalPage: number) =>
  ({ children }: PropsWithChildren) => (
    <MultiStepFormContextProvider totalPage={totalPage}>
      {children}
    </MultiStepFormContextProvider>
  );
