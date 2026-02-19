import BaseRegisterForm from "@/component/feature/RegisterForm/BaseRegisterForm";
import { THAI_REGISTER_STEPS } from "@/component/feature/RegisterForm/register.steps";
import { MultiStepFormContextProvider } from "@/context/MultistepFormContext/MultiStepFormContext";

function ThaiRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <MultiStepFormContextProvider totalPage={4}>
          <BaseRegisterForm
            config={{
              nationCode: "1",
              defaultSearchMethod: "idCard",
              steps: THAI_REGISTER_STEPS,
              mode: "thai",
              includeOtp: true,
            }}
          />
        </MultiStepFormContextProvider>
      </div>
    </div>
  );
}

export default ThaiRegisterPage;
