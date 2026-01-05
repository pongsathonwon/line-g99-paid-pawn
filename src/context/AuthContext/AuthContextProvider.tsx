import React, { useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useLineContext } from "../LineContext/LineContext";
import { useMutation } from "@tanstack/react-query";
import { AUTH_API, type TUserInfo } from "../../api/endpoint/auth";
import type { TMaybe } from "../../types/base.type";
import { axiosClient } from "../../api/axios";
import { getAT } from "../../lib/local-storage-helper";

// const MOCK_SUCCESS_LOGIN = {
//   error: null,
//   auth: {
//     id: "445725",
//     custNo: "4302380",
//     fullname: "เปเล ซาน วิน",
//     idCard: "0074015073011",
//     lineUid: "U0bf26f4085b0a41af588f6cb1774409e",
//     mobileNo: "0949028344",
//     branchCode: "43",
//     custType: "G",
//     custStat: 1,
//     isConsent: true,
//     isVerified: true,
//     birthDate: "1987-05-06T17:00:00.000Z",
//     gender: "x",
//   },
// };
// const MOCK_FAIL_LOGIN = { error: "mock fail login", auth: null };

function AuthContextProvider({ children }: React.PropsWithChildren) {
  const { lineCtx } = useLineContext();
  const uid = lineCtx?.profile?.userId ?? "";
  const [auth, setAuth] = React.useState<TMaybe<TUserInfo>>(null);
  const [error, setError] = React.useState<TMaybe<string>>(null);
  const loginMutation = useMutation({
    mutationKey: ["g99-login"],
    mutationFn: AUTH_API.login,
    onSuccess: ({ userInfo }) => {
      setAuth(userInfo);
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
      setAuth(null);
    },
  });
  useEffect(() => {
    loginMutation.mutateAsync({ lineUid: uid });
  }, [uid]);

  useEffect(() => {
    const interceptor = axiosClient.interceptors.request.use((config) => {
      const token = getAT();
      config.headers.Authorization = token
        ? `Bearer ${token}`
        : config.headers.Authorization;
      return config;
    });
    return () => axiosClient.interceptors.request.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        error,
        auth,
        loginStatus: {
          isPending: loginMutation.isPending,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
