import {
  MultiStepFormContextProvider,
  useMultistepForm,
} from "@/context/MultistepFormContext/MultiStepFormContext";
import { Fragment, type ReactNode } from "react";

type TStepFormProps = {
  steps: Array<ReactNode>;
};

function StepForm({ steps }: TStepFormProps) {
  return (
    <MultiStepFormContextProvider totalPage={steps.length}>
      {(() => {
        const { activePage } = useMultistepForm();
        console.log(activePage);
        return (
          <>
            {steps.flatMap((step, i) =>
              i + 1 === activePage ? [<Fragment key={i}>{step}</Fragment>] : [],
            )}
          </>
        );
      })()}
    </MultiStepFormContextProvider>
  );
}

export default StepForm;
