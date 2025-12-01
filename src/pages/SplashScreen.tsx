import { Navigate } from "react-router-dom";
import { useLineContext } from "@/context/LineContext/LineContext";
import React from "react";

// const { lineCtx } = useLineContext();
// console.log(lineCtx);
// if (lineCtx?.isLogin) return <Navigate to={"/home"} />;
export default function SplashScreen() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center fixed inset-0"
      style={{ backgroundColor: "#981C14" }}
    >
      <div className="flex items-center justify-center p-8">
        <img
          src="/logo/logo.png"
          alt="logo"
          className="w-48 sm:w-64 md:w-80 lg:w-96 xl:w-md max-w-full h-auto object-contain"
        />
      </div>
    </div>
  );
}
