import OTPVerification from "../RegisterSubform/OTPVerification";
import SearchCustomer from "../RegisterSubform/SearchCustomer";
import { SuccessStep } from "./SuccessStep";

function ThaiRegisterForm() {
  return (
    <div>
      <SearchCustomer searchMethod="idCard" />
      <OTPVerification />
      <SuccessStep />
    </div>
  );
}

export default ThaiRegisterForm;
