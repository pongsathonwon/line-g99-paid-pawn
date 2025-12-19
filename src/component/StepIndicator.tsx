import React from "react";

type TStepIndicatorProps = {
  stepNumber: number;
  currentStep: number;
  label: string;
};

function StepIndicator({
  stepNumber,
  currentStep,
  label,
}: TStepIndicatorProps) {
  const isActive = stepNumber === currentStep;
  const isCompleted = stepNumber < currentStep;
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center flex-1">
        <div
          className={`
            w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
            ${
              isCompleted
                ? "bg-green-500 text-white"
                : isActive
                ? "bg-brand-red text-white"
                : "bg-gray-200 text-gray-600"
            }
            `}
        >
          {isCompleted ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            stepNumber
          )}
        </div>
      </div>
      <span className={currentStep >= stepNumber ? "font-medium" : ""}>
        {label}
      </span>
    </div>
  );
}

export default StepIndicator;
