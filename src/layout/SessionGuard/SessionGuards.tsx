import type { PropsWithChildren } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { useSession } from "@/context/SessionContext/SessionContext";
import { toSafeAppPath } from "@/lib/safe-path";
import SessionRetry from "./SessionRetry";
import SessionSplash from "./SessionSplash";

/** Pawn pages: members only; guests go to register and come back here. */
export function RequireMember({ children }: PropsWithChildren) {
  const { status } = useSession();
  const location = useLocation();

  if (status === "loading") return <SessionSplash />;
  if (status === "error") return <SessionRetry />;
  if (status === "guest") {
    const here = `${location.pathname}${location.search}`;
    return (
      <Navigate to={`/register?redirect=${encodeURIComponent(here)}`} replace />
    );
  }
  return <>{children}</>;
}

/** Register pages: guests only; a member goes on to ?redirect or /home. */
export function RequireGuest({ children }: PropsWithChildren) {
  const { status } = useSession();
  const [searchParams] = useSearchParams();

  if (status === "loading") return <SessionSplash />;
  if (status === "error") return <SessionRetry />;
  if (status === "member") {
    const redirect = toSafeAppPath(searchParams.get("redirect"));
    return <Navigate to={redirect ?? "/home"} replace />;
  }
  return <>{children}</>;
}

/**
 * Survey pages: need LINE only (GoldenApi checks the LIFF ID token and owns
 * survey membership), so they open for guests and members alike, as soon as
 * LINE is ready, without waiting for or depending on the g99-online login.
 */
export function RequireLine({ children }: PropsWithChildren) {
  const { lineUid, errorKind } = useSession();

  if (lineUid) return <>{children}</>;
  if (errorKind === "line") return <SessionRetry />;
  return <SessionSplash />;
}
