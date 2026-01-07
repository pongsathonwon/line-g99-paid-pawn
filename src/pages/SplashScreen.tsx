import { Navigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext/AuthContext";

export default function SplashScreen() {
  const [searchParams] = useSearchParams();

  const {
    loginStatus: { isSuccess, isError },
  } = useAuthContext();

  if (isSuccess) {
    const redirectPath = searchParams.get("redirect");
    return <Navigate to={redirectPath ?? "/home"} replace />;
  }
  if (isError) {
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
