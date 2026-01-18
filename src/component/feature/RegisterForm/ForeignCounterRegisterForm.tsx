import { useMultistepForm } from "@/context/MultistepFormContext/MultiStepFormContext";
import SearchCustomer from "../RegisterSubform/SearchCustomer";
import { PendingStep } from "../RegisterSubform/PendingStep";
import TermStep from "../RegisterSubform/TermStep";
import { useState } from "react";
import type { TMaybe } from "@/types/base.type";
import type { TSearchUserRes, TSearchUserMethod } from "@/types/register";
import StepIndicator from "./StepIndicator";
import { FOREIGN_COUNTER_REGISTER_STEPS } from "./register.steps";

function ForeignCounterRegisterForm() {
  const { activePage } = useMultistepForm();

  const [user, setUser] = useState<TMaybe<TSearchUserRes>>(null);
  const [isConsent, setIsConsent] = useState(false);
  const [searchMethod, setSearchMethod] =
    useState<TSearchUserMethod>("custCode");

  const onSetUser = (res: TSearchUserRes | null) => {
    setUser(res);
  };

  const onChangeSearchMethod = (method: TSearchUserMethod) => {
    setSearchMethod(method);
  };

  const onSetConsent = (consent: boolean) => {
    setIsConsent(consent);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <StepIndicator steps={FOREIGN_COUNTER_REGISTER_STEPS} />

      {activePage === 1 && (
        <SearchCustomer
          nationCode="2"
          userForm={user}
          onSetUser={onSetUser}
          searchMethod={searchMethod}
          onChangeSearchMethod={onChangeSearchMethod}
          locale="en"
          mode="foreign-counter"
        />
      )}

      {activePage === 2 && user && (
        <TermStep
          locale="en"
          isConsent={isConsent}
          onConsent={onSetConsent}
          userData={user}
          isVerified={true}
        />
      )}

      {activePage === 3 && <PendingStep />}
    </div>
  );
}

export default ForeignCounterRegisterForm;
