import type { TMaybe } from "@/types/base.type";
import type { TSearchUserRes } from "@/types/register";
import React, { type PropsWithChildren } from "react";

type TThaiRegisterFormContext = {
  formData: TFormData;
  setUser: (user: TSearchUserRes) => void;
  validUserForm: boolean;
};

type TFormData = {
  userForm: TMaybe<TSearchUserRes>;
};

const defaultUserForm = {
  userForm: null,
};

export const ThaiRegisterFormContext =
  React.createContext<TMaybe<TThaiRegisterFormContext>>(null);

export function useThaiRegisterForm() {
  const ctx = React.useContext(ThaiRegisterFormContext);
  if (ctx === null) throw new Error("thai register form context is required");
  return ctx;
}

export function ThaiRegisterFormContextProvider({
  children,
}: PropsWithChildren) {
  const [formData, setFormData] = React.useState<TFormData>(defaultUserForm);
  const validUserForm = formData.userForm !== null;
  const setUser = (user: TSearchUserRes) => {
    setFormData((prev) => ({ ...prev, userForm: user }));
  };
  return (
    <ThaiRegisterFormContext.Provider
      value={{ formData, setUser, validUserForm }}
    >
      {children}
    </ThaiRegisterFormContext.Provider>
  );
}
