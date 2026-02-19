import BaseRegisterForm from "@/component/feature/RegisterForm/BaseRegisterForm";
import { FOREIGN_REGISTER_STEPS } from "@/component/feature/RegisterForm/register.steps";
import { MultiStepFormContextProvider } from "@/context/MultistepFormContext/MultiStepFormContext";

function ForeignRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <MultiStepFormContextProvider totalPage={4}>
          <BaseRegisterForm
            config={{
              nationCode: "2",
              defaultSearchMethod: "custCode",
              steps: FOREIGN_REGISTER_STEPS,
              mode: "foreign",
              includeOtp: true,
            }}
          />
        </MultiStepFormContextProvider>
      </div>
    </div>
  );
}

export default ForeignRegisterPage;
