import { useMultistepForm } from "@/context/MultistepFormContext/MultiStepFormContext";
import clsx from "clsx";
import type { RegisterStep } from "./register.steps";

type StepIndicatorProps = {
  steps: RegisterStep[];
};

function StepIndicator({ steps }: StepIndicatorProps) {
  const { activePage } = useMultistepForm();
  const totalPage = steps.length;

  return (
    <div className="w-full relative">
      <div className="absolute top-4 left-0 right-0 flex items-center px-4">
        <div className="flex-1 flex items-center">
          {steps.map((stepItem, index) => {
            const step = index + 1;
            const isDone = step < activePage;
            const isLastStep = step === totalPage;

            if (isLastStep) return null;

            return (
              <div
                key={`line-${stepItem.key}`}
                className="flex-1 flex items-center"
              >
                <div className="w-4" />
                <div
                  className={clsx(
                    "flex-1 h-0.5 transition-colors duration-300",
                    {
                      "bg-brand-red": isDone,
                      "bg-gray-200": !isDone,
                    }
                  )}
                />
                <div className="w-4" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative flex justify-between">
        {steps.map((stepItem, index) => {
          const step = index + 1;
          const isActive = step === activePage;
          const isDone = step < activePage;

          return (
            <div key={stepItem.key} className="flex flex-col items-center">
              {/* circle */}
              <div
                className={clsx(
                  "flex items-center justify-center rounded-full border transition-all duration-300",
                  "w-8 h-8 text-sm font-semibold relative z-10 bg-white",
                  {
                    "bg-brand-red! text-white border-brand-red scale-130":
                      isActive,
                    "bg-brand-red! text-white border-brand-red": isDone,
                    "text-gray-400 border-gray-300": !isActive && !isDone,
                  }
                )}
              >
                {step}
              </div>

              <span
                className={clsx(
                  "mt-2 text-[10px] text-center transition-colors duration-300 max-w-20",
                  {
                    "text-brand-red font-semibold": isActive || isDone,
                    "text-gray-400": !isActive && !isDone,
                  }
                )}
              >
                {stepItem.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepIndicator;
