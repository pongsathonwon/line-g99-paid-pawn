import { useMutation } from "@tanstack/react-query";
import { AUTH_API, type TUserInfo } from "@/api/endpoint/auth";
import React from "react";
import type { TMaybe } from "@/types/base.type";

export const useAuthLogin = () => {
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

  const login = async (lineUid: string) => {
    if (lineUid) {
      await loginMutation.mutateAsync({ lineUid });
    }
  };

  return {
    auth,
    error,
    login,
    isPending: loginMutation.isPending,
    isSuccess: loginMutation.isSuccess,
    isError: loginMutation.isError,
  };
};
