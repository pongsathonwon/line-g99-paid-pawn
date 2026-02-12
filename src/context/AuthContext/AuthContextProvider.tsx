import React, { useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useLineContext } from "../LineContext/LineContext";
import { registerAxiosTokenBearer } from "./auth-context-helper";
import { useAuthLogin } from "@/hook/mutation/useAuthLogin";

function AuthContextProvider({ children }: React.PropsWithChildren) {
  const { lineCtx } = useLineContext();
  const uid = lineCtx?.profile?.userId ?? "";

  const { auth, error, login, isPending, isSuccess, isError } = useAuthLogin();

  const relogin = async () => {
    await login(uid);
  };

  useEffect(() => {
    if (uid) {
      login(uid);
    }
  }, [uid]);

  useEffect(() => {
    return registerAxiosTokenBearer();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        error,
        auth: {
          id: "442295",
          custNo: "3007477",
          fullname: "พงศธร วงศ์อ่อนดี",
          idCard: "1100600364418",
          lineUid: "U5fa267319809e247136b1f4cc205e988",
          mobileNo: "0851493695",
          branchCode: "30",
          custType: "G",
          custStat: 1,
          isConsent: true,
          isVerified: true,
          birthDate: "1996-12-17T17:00:00.000Z",
          gender: "x",
        },
        relogin,
        loginStatus: {
          isPending,
          isSuccess,
          isError,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
