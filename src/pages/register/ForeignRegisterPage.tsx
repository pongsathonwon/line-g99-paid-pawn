import BaseRegisterForm from "@/component/feature/RegisterForm/BaseRegisterForm";
import { FOREIGN_REGISTER_STEPS } from "@/component/feature/RegisterForm/register.steps";
import { MultiStepFormContextProvider } from "@/context/MultistepFormContext/MultiStepFormContext";
import RegisterLayout from "./RegisterLayout";

function ForeignRegisterPage() {
  return (
    <RegisterLayout>
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
    </RegisterLayout>
  );
}

export default ForeignRegisterPage;
