import { useState, type ReactNode } from "react";
import { RegistrationContext } from "./RegistrationContext";
import type {
  TRegistrationFormData,
  TRegistrationStep,
  TUserType,
} from "@/types/register";

type TRegistrationContextProviderProps = {
  children: ReactNode;
  userType: TUserType;
};

const initialFormData: TRegistrationFormData = {
  searchMethod: "idCard",
  searchValue: "",
  userType: "thai",
  isConsent: false,
};

export function RegistrationContextProvider({
  children,
  userType,
}: TRegistrationContextProviderProps) {
  const [currentStep, setCurrentStep] = useState<TRegistrationStep>("search");
  const [formData, setFormDataState] = useState<TRegistrationFormData>({
    ...initialFormData,
    userType,
  });

  const setFormData = (data: Partial<TRegistrationFormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setCurrentStep("search");
    setFormDataState({ ...initialFormData, userType });
  };

  return (
    <RegistrationContext.Provider
      value={{
        currentStep,
        formData,
        setCurrentStep,
        setFormData,
        resetForm,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}
