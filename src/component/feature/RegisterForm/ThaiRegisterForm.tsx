import BaseRegisterForm from "./BaseRegisterForm";
import { THAI_REGISTER_STEPS } from "./register.steps";

function ThaiRegisterForm() {
  return (
    <BaseRegisterForm
      config={{
        nationCode: "1",
        locale: "th",
        defaultSearchMethod: "idCard",
        steps: THAI_REGISTER_STEPS,
        mode: "thai",
        includeOtp: true,
      }}
    />
  );
}

export default ThaiRegisterForm;
