import BaseRegisterForm from "./BaseRegisterForm";
import { FOREIGN_COUNTER_REGISTER_STEPS } from "./register.steps";

function ForeignCounterRegisterForm() {
  return (
    <BaseRegisterForm
      config={{
        nationCode: "2",
        locale: "en",
        defaultSearchMethod: "custCode",
        steps: FOREIGN_COUNTER_REGISTER_STEPS,
        mode: "foreign-counter",
        includeOtp: false,
      }}
    />
  );
}

export default ForeignCounterRegisterForm;
