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
        auth,
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
