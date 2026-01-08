import { useEffect, useState, type PropsWithChildren } from "react";
import { LineContext, type TLineStatus } from "./LineContext";
import { liff } from "@line/liff";
import type { TMaybe } from "../../types/base.type";
import { useToast } from "../ToastContext/ToastContext";

function LineContextProvider({ children }: PropsWithChildren) {
  const [lineCtx, setLineCtx] = useState<TMaybe<TLineStatus>>(null);
  const toast = useToast();

  const lineLogin = async () => {
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }
    try {
      const profile = await liff.getProfile();
      setLineCtx({
        isLogin: true,
        profile: {
          displayName: profile.displayName,
          userId: profile.userId,
          pictureUrl: profile.pictureUrl,
        },
      });
      toast.success("LINE Login Successful");
    } catch (error: any) {
      toast.error("LINE Profile Fetch Error: " + error.message);
    }
  };

  const initialize = () => {
    if (!import.meta.env.VITE_LIFF_ID) {
      toast.error("LIFF ID is not set in environment variables.");
      return;
    }
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID,
      })
      .then(() => lineLogin())
      .catch((err) => {
        toast.error("LIFF Initialization Error: ", err.message);
      });
  };

  useEffect(() => {
    // initialize();
  }, []);

  return (
    <LineContext.Provider value={{ lineCtx }}>{children}</LineContext.Provider>
  );
}

export default LineContextProvider;
