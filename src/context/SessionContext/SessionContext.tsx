import React from "react";
import type { TMaybe } from "@/types/base.type";
import type { TUserInfo } from "@/api/endpoint/auth";
import type { TLineProfile } from "@/lib/line";

/**
 * - loading: LIFF init or the g99-online login is still running
 * - guest:   LINE is fine, g99-online says this LINE uid is not registered
 * - member:  the g99-online login succeeded
 * - error:   LIFF failed (errorKind "line") or g99-online / the network
 *            failed for any other reason (errorKind "api")
 */
export type TSessionStatus = "loading" | "guest" | "member" | "error";
export type TSessionErrorKind = "line" | "api";

export type TSessionContext = {
  status: TSessionStatus;
  errorKind: TMaybe<TSessionErrorKind>;
  /** set as soon as LINE is ready, before the g99-online login settles */
  lineUid: TMaybe<string>;
  lineProfile: TMaybe<TLineProfile>;
  /** the g99-online customer, only while status is "member" */
  auth: TMaybe<TUserInfo>;
  isRefreshing: boolean;
  /** LIFF ID token for GoldenApi (X-Line-Id-Token) */
  getIdToken: () => TMaybe<string>;
  /** runs the g99-online login again, e.g. right after registering */
  refresh: () => Promise<TSessionStatus>;
  /** LINE login, back to redirectUri (default: the current page) */
  login: (redirectUri?: string) => void;
};

export const SessionContext = React.createContext<TMaybe<TSessionContext>>(null);

export const useSession = () => {
  const ctx = React.useContext(SessionContext);
  if (ctx === null) throw new Error("useSession requires SessionContextProvider");
  return ctx;
};

/** The logged-in customer, or null for guests and while loading. */
export const useCustInfo = () => useSession().auth;
