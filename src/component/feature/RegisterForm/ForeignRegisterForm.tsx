import BaseRegisterForm from "./BaseRegisterForm";
import { FOREIGN_REGISTER_STEPS } from "./register.steps";

function ForeignRegisterForm() {
  return (
    <BaseRegisterForm
      config={{
        nationCode: "2",
        locale: "en",
        defaultSearchMethod: "custCode",
        steps: FOREIGN_REGISTER_STEPS,
        mode: "foreign",
        includeOtp: true,
      }}
    />
  );
}

export default ForeignRegisterForm;
