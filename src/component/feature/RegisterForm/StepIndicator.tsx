import { useMultistepForm } from "@/context/MultistepFormContext/MultiStepFormContext";
import clsx from "clsx";

const STEP_LABELS = ["ค้นหาข้อมูล", "ยืนยัน OTP", "ข้อตกลง", "สำเร็จ"];

function StepIndicator() {
  const { activePage, totalPage } = useMultistepForm();

  return (
    <div className="w-full flex items-center justify-between">
      {Array.from({ length: totalPage }).map((_, index) => {
        const step = index + 1;
        const isActive = step === activePage;
        const isDone = step < activePage;
        const isLastStep = step === totalPage;

        return (
          <div
            key={step}
            className={clsx(
              "flex items-center",
              isLastStep ? "flex-none" : "flex-1"
            )}
          >
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  "flex items-center justify-center rounded-full border transition-all duration-300",
                  "w-8 h-8 text-sm font-semibold",
                  {
                    "bg-brand-red text-white border-brand-red scale-120":
                      isActive,
                    "bg-brand-red text-white border-brand-red": isDone,
                    "bg-white text-gray-400 border-gray-300":
                      !isActive && !isDone,
                  }
                )}
              >
                {step}
              </div>

              <span
                className={clsx(
                  "mt-2 text-[10px] text-center transition-colors duration-300",
                  {
                    "text-brand-red font-semibold": isActive || isDone,
                    "text-gray-400": !isActive && !isDone,
                  }
                )}
              >
                {STEP_LABELS[index]}
              </span>
            </div>

            {!isLastStep && (
              <div
                className={clsx(
                  "flex-1 h-[2px] mx-2 transition-colors duration-300 mb-6", 
                  {
                    "bg-brand-red": isDone,
                    "bg-gray-200": !isDone,
                  }
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StepIndicator;
