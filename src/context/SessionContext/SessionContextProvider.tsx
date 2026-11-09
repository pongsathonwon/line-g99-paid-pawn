import { useEffect, useState, type PropsWithChildren } from "react";
import { AUTH_API, type TUserInfo } from "@/api/endpoint/auth";
import { getLineIdToken, initLine, loginWithLine, type TLineProfile } from "@/lib/line";
import type { TMaybe } from "@/types/base.type";
import { useToast } from "../ToastContext/ToastContext";
import { registerAxiosTokenBearer } from "./auth-context-helper";
import { isNotRegistered } from "./session-lib";
import {
  SessionContext,
  type TSessionErrorKind,
  type TSessionStatus,
} from "./SessionContext";

type TSessionState = {
  status: TSessionStatus;
  errorKind: TMaybe<TSessionErrorKind>;
  lineProfile: TMaybe<TLineProfile>;
  auth: TMaybe<TUserInfo>;
};

function SessionContextProvider({ children }: PropsWithChildren) {
  const toast = useToast();
  const [state, setState] = useState<TSessionState>({
    status: "loading",
    errorKind: null,
    lineProfile: null,
    auth: null,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loginMember = async (lineUid: string): Promise<TSessionStatus> => {
    try {
      const { userInfo } = await AUTH_API.login({ lineUid });
      setState((s) => ({ ...s, status: "member", errorKind: null, auth: userInfo }));
      return "member";
    } catch (error) {
      const status = isNotRegistered(error) ? "guest" : "error";
      setState((s) => ({
        ...s,
        status,
        errorKind: status === "error" ? "api" : null,
        auth: null,
      }));
      return status;
    }
  };

  const start = async () => {
    let profile: TMaybe<TLineProfile>;
    try {
      profile = await initLine(import.meta.env.VITE_LIFF_ID);
    } catch (error) {
      toast.error((error as Error).message);
      setState((s) => ({ ...s, status: "error", errorKind: "line" }));
      return;
    }
    // null: LINE login or the liff.state reload has taken over the page
    if (!profile) return;
    toast.success("LINE Login Successful");
    setState((s) => ({ ...s, lineProfile: profile }));
    await loginMember(profile.userId);
  };

  const refresh = async () => {
    // without LINE there is nothing to log in with; a LIFF failure is
    // retried with login() instead
    if (!state.lineProfile) return state.status;
    setIsRefreshing(true);
    try {
      return await loginMember(state.lineProfile.userId);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void start();
    // run once: LIFF must only be initialised once per page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => registerAxiosTokenBearer(), []);

  return (
    <SessionContext.Provider
      value={{
        ...state,
        lineUid: state.lineProfile?.userId ?? null,
        isRefreshing,
        getIdToken: getLineIdToken,
        refresh,
        login: (redirectUri = window.location.href) => {
          loginWithLine({ redirectUri });
        },
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export default SessionContextProvider;
