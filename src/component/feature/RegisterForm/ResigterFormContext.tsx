import type {
  TRegisterRes,
  TSearchUserMethod,
  TSearchUserReq,
  TSearchUserRes,
} from "@/types/register";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ChangeEventHandler,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import { searchLabelMapper, searchMethodMapper } from "./libs";

type TUseSearchValue = {
  searchLabel: string;
  searchValue: string;
  onSearchValueChange: ChangeEventHandler<HTMLInputElement>;
  searchRequest: TSearchUserReq;
};

type TOtpReq = {
  msisdn: "string"; // mobileNo | custPhone
};

type TOptRes = {
  status: string;
  token: string;
  refno: string;
};

type TOtpState = Pick<TOptRes, "token" | "refno">;

type TRegisterFormContext = {
  userData: TSearchUserRes | null;
  setUserData: Dispatch<SetStateAction<TSearchUserRes | null>>;
  otp: TOtpState | null;
  setOtp: Dispatch<SetStateAction<TOtpState | null>>;
  isConsent: boolean;
  toggleConsent: () => void;
} & TUseSearchValue &
  TResigerterContextProviderProps;

type TResigerterContextProviderProps = {
  searchMethod: TSearchUserMethod;
};

const RegisterFormContext = createContext<TRegisterFormContext | null>(null);

export const RegisterContextProvider = ({
  children,
  searchMethod,
}: PropsWithChildren<TResigerterContextProviderProps>) => {
  // searchValueControll
  const requestKey = useMemo(
    () => searchMethodMapper(searchMethod),
    [searchMethod]
  );
  const searchLabel = useMemo(
    () => searchLabelMapper(searchMethod),
    [searchMethod]
  );
  const [searchValue, setSearchValue] = useState("");
  const onSearchValueChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => setSearchValue(value);
  const searchRequest = { [requestKey]: searchValue };
  //search value response
  const [userData, setUserData] = useState<TSearchUserRes | null>(null);

  // opt value response
  const [otp, setOtp] = useState<TOtpState | null>(null);

  //consent on submit
  const [isConsent, setIsConsent] = useState(false);
  const toggleConsent = () => setIsConsent((prev) => !prev);
  return (
    <RegisterFormContext.Provider
      value={{
        searchLabel,
        searchValue,
        onSearchValueChange,
        searchRequest,
        searchMethod,
        userData,
        setUserData,
        otp,
        setOtp,
        isConsent,
        toggleConsent,
      }}
    >
      {children}
    </RegisterFormContext.Provider>
  );
};

export function useRegisterSearchForm() {
  const ctx = useContext(RegisterFormContext);
  if (ctx === null)
    throw new Error(
      `${useRegisterSearchForm.name} requires ${RegisterFormContext.name}`
    );
  const {
    searchLabel,
    searchValue,
    searchRequest,
    onSearchValueChange,
    searchMethod,
  } = ctx;
  return {
    searchLabel,
    searchValue,
    searchRequest,
    onSearchValueChange,
    searchMethod,
  };
}

export function useRegisterUserData() {
  const ctx = useContext(RegisterFormContext);
  if (ctx === null)
    throw new Error(
      `${useRegisterUserData.name} requires ${RegisterFormContext.name}`
    );
  const { userData, setUserData } = ctx;
  return { userData, setUserData };
}
