import { useMultistepForm } from "@/context/MultistepFormContext/MultiStepFormContext";
import OTPVerification from "../RegisterSubform/OTPVerification";
import SearchCustomer from "../RegisterSubform/SearchCustomer";
import { SuccessStep } from "../RegisterSubform/SuccessStep";
import { PendingStep } from "../RegisterSubform/PendingStep";
import TermStep from "../RegisterSubform/TermStep";
import StepIndicator from "./StepIndicator";
import {
  useRegisterFormState,
  type TRegisterFormState,
} from "./hooks/useRegisterFormState";
import type { RegisterStep, TStepType } from "./register.steps";
import type { TSearchUserMethod } from "@/types/register";
import type { TRegisterFormMode } from "../RegisterSubform/lib";

export type TRegisterFormConfig = {
  nationCode: string;
  defaultSearchMethod: TSearchUserMethod;
  steps: RegisterStep[];
  mode: TRegisterFormMode;
  includeOtp: boolean;
};

type TStepRendererProps = {
  stepType: TStepType;
  config: TRegisterFormConfig;
  formState: TRegisterFormState;
};

function StepRenderer({ stepType, config, formState }: TStepRendererProps) {
  switch (stepType) {
    case "search":
      return (
        <SearchCustomer
          nationCode={config.nationCode}
          mode={config.mode}
          searchMethod={formState.searchMethod}
          userForm={formState.user}
          onSetUser={formState.setUser}
          onChangeSearchMethod={formState.setSearchMethod}
        />
      );
    case "otp":
      if (!config.includeOtp) return null;
      return (
        <OTPVerification
          otpLength={6}
          mobileNo={formState.mobileNo}
          otpRes={formState.reqOtp}
          onSetOtp={formState.setOtp}
          onSuccess={formState.setVerified}
        />
      );
    case "term":
      if (!formState.user) return null;
      return (
        <TermStep
          isConsent={formState.isConsent}
          onConsent={formState.setConsent}
          userData={formState.user}
          isVerified={formState.isVerify}
          mode={config.mode}
        />
      );
    case "success":
      return <SuccessStep />;
    case "pending":
      return <PendingStep />;
    default:
      return null;
  }
}

type TBaseRegisterFormProps = {
  config: TRegisterFormConfig;
};

function BaseRegisterForm({ config }: TBaseRegisterFormProps) {
  const { activePage } = useMultistepForm();
  const formState = useRegisterFormState({
    defaultSearchMethod: config.defaultSearchMethod,
    includeOtp: config.includeOtp,
  });

  const currentStep = config.steps[activePage - 1];
  if (!currentStep) return null;

  return (
    <div className="flex flex-col gap-6 w-full">
      <StepIndicator steps={config.steps} />
      <StepRenderer
        stepType={currentStep.key}
        config={config}
        formState={formState}
      />
    </div>
  );
}

export default BaseRegisterForm;
