import React from "react";
import type { TMaybe } from "../../types/base.type";

export const AuthContext = React.createContext<TMaybe<TAuthContext>>(null);

export const useAuthContext = () => {
  const ctx = React.useContext(AuthContext);
  if (ctx === null)
    throw new Error("useAuthContext required AuthContextProvider");
  return ctx;
};

type TAuthContext = {
  error: TMaybe<string>;
  token: TMaybe<string>;
};
