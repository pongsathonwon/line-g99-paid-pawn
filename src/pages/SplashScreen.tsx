import { Navigate, useSearchParams } from "react-router-dom";
import { useSession } from "@/context/SessionContext/SessionContext";
import { toSafeAppPath } from "@/lib/safe-path";
import SessionRetry from "@/layout/SessionGuard/SessionRetry";
import SessionSplash from "@/layout/SessionGuard/SessionSplash";

/**
 * "/" only decides where to go, from the session status:
 * 1. a liff.state deep link wins (liff.line.me/{id}/survey?b=6 opens
 *    "/?liff.state=/survey?b=6"). liff.init() normally reloads the page at
 *    that path itself; if we are still here once LINE is ready, route there.
 * 2. member → ?redirect or /home
 * 3. guest → /register, passing ?redirect on
 * 4. error → retry screen (never /register)
 */
export default function SplashScreen() {
  const [searchParams] = useSearchParams();
  const { status, errorKind, lineUid } = useSession();

  if (errorKind === "line") return <SessionRetry />;

  const liffStatePath = toSafeAppPath(searchParams.get("liff.state"));
  if (liffStatePath) {
    return lineUid ? <Navigate to={liffStatePath} replace /> : <SessionSplash />;
  }

  const redirect = toSafeAppPath(searchParams.get("redirect"));
  switch (status) {
    case "member":
      return <Navigate to={redirect ?? "/home"} replace />;
    case "guest":
      return (
        <Navigate
          to={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register"}
          replace
        />
      );
    case "error":
      return <SessionRetry />;
    default:
      return <SessionSplash />;
  }
}
