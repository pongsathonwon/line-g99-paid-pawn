import { useMultistepForm } from "@/context/MultistepFormContext/MultiStepFormContext";
import OTPVerification from "../RegisterSubform/OTPVerification";
import SearchCustomer from "../RegisterSubform/SearchCustomer";
import { SuccessStep } from "../RegisterSubform/SuccessStep";
import TermStep from "../RegisterSubform/TermStep";
import { useState } from "react";
import type { TMaybe } from "@/types/base.type";
import type {
  TOtpRequestRes,
  TSearchUserRes,
  // TSearchUserMethod,
} from "@/types/register";
import StepIndicator from "./StepIndicator";
import { FOREIGN_REGISTER_STEPS } from "./register.steps";

function ForeignRegisterForm() {
  const { activePage } = useMultistepForm();

  // const [searchMethod, setSearchMethod] =
  //   useState<TSearchUserMethod>("custCode");

  const [user, setUser] = useState<TMaybe<TSearchUserRes>>(null);

  const mobileNo = user?.mobileNo ?? null;

  const onSetUser = (res: TSearchUserRes | null) => {
    setUser(res);
  };

  const [reqOtp, setReqOtp] = useState<TMaybe<TOtpRequestRes>>(null);
  const [isVerify, setIsVerify] = useState(false);

  const onSetOtp = (optRes: TOtpRequestRes) => {
    setReqOtp(optRes);
    setIsVerify(false);
  };

  const onVerifyOtp = (otpVerifyRes: boolean) => {
    setIsVerify(otpVerifyRes);
  };

  const [isConsent, setIsConsent] = useState(false);

  const onSetConsent = (consent: boolean) => {
    setIsConsent(consent);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <StepIndicator steps={FOREIGN_REGISTER_STEPS} />

      {activePage === 1 && (
        <SearchCustomer
          searchMethod="custCode"
          userForm={user}
          onSetUser={onSetUser}
          // onChangeSearchMethod={setSearchMethod}
          locale="en"
        />
      )}

      {activePage === 2 && (
        <OTPVerification
          locale="en"
          otpLength={6}
          mobileNo={mobileNo}
          otpRes={reqOtp}
          onSetOtp={onSetOtp}
          onSuccess={onVerifyOtp}
        />
      )}

      {activePage === 3 && user && (
        <TermStep
          locale="en"
          isConsent={isConsent}
          onConsent={onSetConsent}
          userData={user}
          isVerified={isVerify}
        />
      )}

      {activePage === 4 && <SuccessStep />}
    </div>
  );
}

export default ForeignRegisterForm;
