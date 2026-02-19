import BaseRegisterForm from "@/component/feature/RegisterForm/BaseRegisterForm";
import { FOREIGN_COUNTER_REGISTER_STEPS } from "@/component/feature/RegisterForm/register.steps";
import { MultiStepFormContextProvider } from "@/context/MultistepFormContext/MultiStepFormContext";
import RegisterLayout from "./RegisterLayout";

function ForeignCounterRegisterPage() {
  return (
    <RegisterLayout>
      <MultiStepFormContextProvider totalPage={3}>
        <BaseRegisterForm
          config={{
            nationCode: "2",
            defaultSearchMethod: "custCode",
            steps: FOREIGN_COUNTER_REGISTER_STEPS,
            mode: "foreign-counter",
            includeOtp: false,
          }}
        />
      </MultiStepFormContextProvider>
    </RegisterLayout>
  );
}

export default ForeignCounterRegisterPage;
