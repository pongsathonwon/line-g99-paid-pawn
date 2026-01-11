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
  const [formData, setFormData] = useState<TRegistrationFormData>({
    ...initialFormData,
    userType,
  });

  const handleSetFormData = (data: Partial<TRegistrationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setCurrentStep("search");
    setFormData({ ...initialFormData, userType });
  };

  return (
    <RegistrationContext.Provider
      value={{
        currentStep,
        formData,
        setCurrentStep,
        handleSetFormData,
        resetForm,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}
