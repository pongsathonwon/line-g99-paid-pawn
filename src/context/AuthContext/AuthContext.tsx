import React from "react";
import type { TMaybe } from "../../types/base.type";
import type { TUserInfo } from "@/api/endpoint/auth";

export const AuthContext = React.createContext<TMaybe<TAuthContext>>(null);

export const useAuthContext = () => {
  const ctx = React.useContext(AuthContext);
  if (ctx === null)
    throw new Error("useAuthContext required AuthContextProvider");
  return ctx;
};

export const useCustInfo = () => {
  const { error, auth } = useAuthContext();
  if (error) return null;
  return auth;
};

export type TAuthContext = {
  error: TMaybe<string>;
  auth: TMaybe<TUserInfo>;
  loginStatus: {
    isPending: boolean;
  };
};
