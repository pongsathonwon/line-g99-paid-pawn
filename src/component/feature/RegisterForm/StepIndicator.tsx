import { useMultistepForm } from "@/context/MultistepFormContext/MultiStepFormContext";
import clsx from "clsx";
import { Check } from "lucide-react";
import type { RegisterStep } from "./register.steps";

type StepIndicatorProps = {
  steps: RegisterStep[];
};

function StepIndicator({ steps }: StepIndicatorProps) {
  const { activePage } = useMultistepForm();
  const totalSteps = steps.length;

  const progressWidth = ((activePage - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full px-4 py-3">
      <div className="relative flex flex-col w-full">
        {/* Layer 1: Line */}
        <div className="absolute top-5 left-0 right-0 mx-5 h-0.5 -translate-y-1/2 bg-gray-200 z-0">
          <div
            className="h-full bg-brand-red transition-all duration-500 ease-in-out"
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        {/* Layer 2: Circles */}
        <div className="relative flex justify-between w-full z-10">
          {steps.map((stepItem, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === activePage;
            const isCompleted = stepNumber < activePage;

            return (
              <div key={stepItem.key} className="flex flex-col items-center">
                <div
                  className={clsx(
                    // 1. ลบ bg-white ออกจากตรงนี้ เพื่อไม่ให้มันไปบังสีแดง
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                    {
                      // 2. ใส่ bg-white เฉพาะตอน Active
                      "bg-white border-brand-red text-brand-red ring-4 ring-brand-red/20 scale-110":
                        isActive,
                      // 3. ใส่ bg-brand-red ตอนเสร็จแล้ว (จะไม่มี bg-white มาขัดแล้ว)
                      "bg-brand-red border-brand-red text-white": isCompleted,
                      // 4. ใส่ bg-white ตอนยังไม่ถึง
                      "bg-white border-gray-200 text-gray-400":
                        !isActive && !isCompleted,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 animate-in zoom-in" />
                  ) : (
                    <span className="text-sm font-bold">{stepNumber}</span>
                  )}
                </div>

                <div className="absolute top-12 w-24 text-center">
                  <span
                    className={clsx(
                      "text-[10px] font-medium block transition-colors duration-300 leading-tight",
                      {
                        "text-brand-red font-bold": isActive || isCompleted,
                        "text-gray-400": !isActive && !isCompleted,
                      }
                    )}
                  >
                    {stepItem.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StepIndicator;
