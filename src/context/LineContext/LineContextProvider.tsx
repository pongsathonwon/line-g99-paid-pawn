import { useEffect, useState, type PropsWithChildren } from "react";
import {
  LineContext,
  type TLineLogin,
  type TLineLogout,
  type TLineStatus,
} from "./LineContext";
import { liff } from "@line/liff";
import type { TMaybe } from "../../types/base.type";

const MOCK_SUCCESS: TLineLogin = {
  isLogin: true,
  profile: {
    displayName: "test",
    userId: "U0bf26f4085b0a41af588f6cb1774409e",
  },
};

const MOCK_FAIL: TLineLogout = {
  isLogin: false,
  profile: null,
};

function LineContextProvider({ children }: PropsWithChildren) {
  const [lineCtx, setLineCtx] = useState<TMaybe<TLineStatus>>(MOCK_SUCCESS);
  const init = async () => {
    try {
      await liff.init({
        liffId: import.meta.env.VITE_LIFF_ID,
        // withLoginOnExternalBrowser: true,
      });
    } catch (err) {
      console.error("error here");
    }
  };

  const login = async () => {
    try {
      await init();
      if (!liff.isLoggedIn()) {
        liff.login();
      }
      const profile = await liff.getProfile();
      setLineCtx({ isLogin: true, profile });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // uncomment for line integration
    // login();
  }, []);
  return (
    <LineContext.Provider value={{ lineCtx }}>{children}</LineContext.Provider>
  );
}

export default LineContextProvider;
