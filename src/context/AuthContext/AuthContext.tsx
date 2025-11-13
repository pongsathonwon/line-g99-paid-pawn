import React from "react";
import type { TMaybe } from "../../types/base.type";

export const AuthContext = React.createContext<TMaybe<TAuthContext>>(null);

export const useAuthContext = () => {
  const ctx = React.useContext(AuthContext);
  if (ctx === null)
    throw new Error("useAuthContext required AuthContextProvider");
  return ctx;
};

export const useCustCode = () => {
  const { error, auth } = useAuthContext();
  if (error) return null;
  return auth?.custCode ?? null;
};

export type TAuth = {
  token: string;
  custCode: string;
};

export type TAuthContext = {
  error: TMaybe<string>;
  auth: TMaybe<TAuth>;
};
