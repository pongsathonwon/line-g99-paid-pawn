import React, { useEffect } from "react";
import { AuthContext, type TAuth } from "./AuthContext";
import { useLineContext } from "../LineContext/LineContext";
import { useMutation } from "@tanstack/react-query";
import { AUTH_API } from "../../api/endpoint/auth";
import type { TMaybe } from "../../types/base.type";
import { axiosClient } from "../../api/axios";
import { getToken } from "../../lib/local-storage-helper";

const MOCK_SUCCESS_LOGIN = {
  error: null,
  auth: {
    token: "test-token",
    custCode: "1200441",
  },
};
const MOCK_FAIL_LOGIN = { error: "mock fail login", auth: null };

function AuthContextProvider({ children }: React.PropsWithChildren) {
  const { lineCtx } = useLineContext();
  const uid = lineCtx?.profile?.userId ?? "";
  // migrate this to reducer
  const [auth, setAuth] = React.useState<TMaybe<TAuth>>(null);
  const [error, setError] = React.useState<TMaybe<string>>(null);
  const loginMutation = useMutation({
    mutationKey: ["g99-login"],
    mutationFn: AUTH_API.login,
    onSuccess: ({ token, custCode }) => {
      setAuth({ token, custCode });
      setError(null);
    },
    onError: (err) => {
      // implement global error handler
      setError(err.message);
      setAuth(null);
    },
  });
  useEffect(() => {
    // check if uid exist
    // try load token here
    // call login api
    loginMutation.mutateAsync({ uid });
  }, [uid]);
  // register jwt token interceptor
  useEffect(() => {
    const interceptor = axiosClient.interceptors.request.use((config) => {
      const token = getToken();
      config.headers.Authorization = token
        ? `Bearer ${token}`
        : config.headers.Authorization;
      return config;
    });
    return () => axiosClient.interceptors.request.eject(interceptor);
  }, []);
  const ctx = error !== null ? { error, token: null } : { error: null, auth };
  return (
    <AuthContext.Provider value={MOCK_SUCCESS_LOGIN}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
