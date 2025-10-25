import type { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

function Protected({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  // check register here

  return <>{children}</>;
}

export default Protected;
