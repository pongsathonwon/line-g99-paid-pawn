import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext/AuthContext";

function SplashScreen() {
  // navigation logic here
  // const { lineLoginSuccess, token } = useAuthContext();
  // if (lineLoginSuccess && token) return <Navigate to="/home" />;
  // if (lineLoginSuccess && !token) return <Navigate to="/register" />;
  return <div>SplashScree</div>;
}

export default SplashScreen;
