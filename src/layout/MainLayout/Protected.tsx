import { useAuthContext } from "@/context/AuthContext/AuthContext";
import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";

function Protected({ children }: PropsWithChildren) {
  const location = useLocation();
  const { auth } = useAuthContext();

  // if (auth === null) {
  //   const redirectUrl = `${location.pathname}${location.search}`;
  //   return <Navigate to={`/?redirect=${encodeURIComponent(redirectUrl)}`} replace />;
  // }

  return <>{children}</>;
}

export default Protected;
