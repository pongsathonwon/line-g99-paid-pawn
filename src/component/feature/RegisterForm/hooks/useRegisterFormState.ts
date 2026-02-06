import { useState, useCallback } from "react";
import type { TMaybe } from "@/types/base.type";
import type {
  TOtpRequestRes,
  TSearchUserMethod,
  TSearchUserRes,
} from "@/types/register";

type TUseRegisterFormStateConfig = {
  defaultSearchMethod: TSearchUserMethod;
  includeOtp: boolean;
};

export function useRegisterFormState(config: TUseRegisterFormStateConfig) {
  const [user, setUser] = useState<TMaybe<TSearchUserRes>>(null);
  const [searchMethod, setSearchMethod] = useState<TSearchUserMethod>(
    config.defaultSearchMethod
  );
  const [reqOtp, setReqOtp] = useState<TMaybe<TOtpRequestRes>>(null);
  const [isVerify, setIsVerify] = useState(!config.includeOtp);
  const [isConsent, setIsConsent] = useState(false);

  const setOtp = useCallback((res: TOtpRequestRes) => {
    setReqOtp(res);
    setIsVerify(false);
  }, []);

  const resetForm = useCallback(() => {
    setUser(null);
    setReqOtp(null);
    setIsVerify(!config.includeOtp);
    setIsConsent(false);
  }, [config.includeOtp]);

  return {
    // State
    user,
    searchMethod,
    reqOtp,
    isVerify,
    isConsent,
    mobileNo: user?.mobileNo ?? null,

    // Actions
    setUser,
    setSearchMethod,
    setOtp,
    setVerified: setIsVerify,
    setConsent: setIsConsent,
    resetForm,
  };
}

export type TRegisterFormState = ReturnType<typeof useRegisterFormState>;
