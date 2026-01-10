import React from "react";
import type { TMaybe } from "../../types/base.type";

export const LineContext = React.createContext<TLineContext | null>(null);

export const useLineContext = () => {
  const ctx = React.useContext(LineContext);
  if (ctx === null) throw new Error("useLineContext need LineContextProvider");
  return ctx;
};

type TLineProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
};

export type TLineLogin = {
  isLogin: true;
  profile: TLineProfile;
};

export type TLineLogout = {
  isLogin: false;
  profile: null;
};

export type TLineStatus = TLineLogin | TLineLogout;

export type TLineContext = {
  lineCtx: TMaybe<TLineStatus>;
};
