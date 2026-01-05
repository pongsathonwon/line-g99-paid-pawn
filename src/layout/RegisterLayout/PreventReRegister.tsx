import { useAuthContext } from "@/context/AuthContext/AuthContext";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

function PreventReRegister({ children }: PropsWithChildren) {
  const { auth } = useAuthContext();

  if (auth !== null) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

export default PreventReRegister;
