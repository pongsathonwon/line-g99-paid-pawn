import { useEffect, useState, type PropsWithChildren } from "react";
import { LineContext, type TLineStatus } from "./LineContext";
import { liff } from "@line/liff";
import type { TMaybe } from "../../types/base.type";
import { useToast } from "../ToastContext/ToastContext";

// const MOCK_SUCCESS: TLineLogin = {
//   isLogin: true,
//   profile: {
//     displayName: "test",
//     userId: "U0bf26f4085b0a41af588f6cb1774409e",
//   },
// };

// const MOCK_FAIL: TLineLogout = {
//   isLogin: false,
//   profile: null,
// };

function LineContextProvider({ children }: PropsWithChildren) {
  const [lineCtx, setLineCtx] = useState<TMaybe<TLineStatus>>(null);
  const toast = useToast();

  const lineLogin = async () => {
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }
    const profile = await liff.getProfile();
    setLineCtx({
      isLogin: true,
      profile: {
        displayName: profile.displayName,
        userId: profile.userId,
        pictureUrl: profile.pictureUrl,
      },
    });
  };

  const initialize = () => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID,
      })
      .then(() => lineLogin())
      .catch((err) => {
        toast.error("LIFF Initialization Error");
      });
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <LineContext.Provider value={{ lineCtx }}>{children}</LineContext.Provider>
  );
}

export default LineContextProvider;
