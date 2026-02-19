import BaseRegisterForm from "@/component/feature/RegisterForm/BaseRegisterForm";
import { THAI_REGISTER_STEPS } from "@/component/feature/RegisterForm/register.steps";
import { MultiStepFormContextProvider } from "@/context/MultistepFormContext/MultiStepFormContext";
import RegisterLayout from "./RegisterLayout";

function ThaiRegisterPage() {
  return (
    <RegisterLayout>
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
    </RegisterLayout>
  );
}

export default ThaiRegisterPage;
