import { Navigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext/AuthContext";
import { useLineContext } from "@/context/LineContext/LineContext";
import { toSafeAppPath } from "@/lib/safe-path";

export default function SplashScreen() {
  const [searchParams] = useSearchParams();
  const { lineCtx } = useLineContext();

  const {
    loginStatus: { isSuccess, isError },
  } = useAuthContext();

  // A deep link (liff.line.me/{id}/survey?b=6) first opens "/" with
  // ?liff.state=/survey?b=6. liff.init() normally reloads the page at that
  // path itself, so hold the splash until init settles; if we are still here
  // afterwards, route there ourselves. Either way it wins over /home and
  // /register.
  const liffStatePath = toSafeAppPath(searchParams.get("liff.state"));
  if (liffStatePath) {
    if (lineCtx) return <Navigate to={liffStatePath} replace />;
  } else if (isSuccess) {
    const redirectPath = searchParams.get("redirect");
    return <Navigate to={redirectPath ?? "/home"} replace />;
  } else if (isError) {
    return <Navigate to="/register" replace />;
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center fixed inset-0"
      style={{ backgroundColor: "#981C14" }}
    >
      <div className="flex items-center justify-center p-8">
        <img
          src="/logo/logo.png"
          alt="logo"
          className="w-48 sm:w-64 md:w-80 lg:w-96 xl:w-md max-w-full h-auto object-contain"
        />
      </div>
      <div className="text-gold">
        version {import.meta.env.VITE_APP_VERSION}
      </div>
    </div>
  );
}
