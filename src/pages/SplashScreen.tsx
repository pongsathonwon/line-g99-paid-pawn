import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext/AuthContext";

function SplashScreen() {
  //navigation logic here
  // const { error, token } = useAuthContext();
  // const loginSuccess = error === null;
  // if (loginSuccess && token) return <Navigate to="/home" />;
  // if (loginSuccess && !token) return <Navigate to="/register" />;
  return <div>SplashScreen</div>;
}

export default SplashScreen;
