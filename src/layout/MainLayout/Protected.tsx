import { useAuthContext } from "@/context/AuthContext/AuthContext";
import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAllowBranch } from "./previewVersion";

function Protected({ children }: PropsWithChildren) {
  const location = useLocation();
  const { auth } = useAuthContext();

  if (auth === null) {
    const redirectUrl = `${location.pathname}${location.search}`;
    return (
      <Navigate to={`/?redirect=${encodeURIComponent(redirectUrl)}`} replace />
    );
  }

  if (!isAllowBranch(auth.branchCode)) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
        <h2 className="text-2xl font-bold text-black mb-2">ขออภัย</h2>
        <p className="text-lg text-black">ขณะนี้อยู่ระหว่างทดลองระบบ</p>
        <p className="text-sm text-gray-500 mt-1">
          ระบบเปิดให้บริการเฉพาะสาขาที่ร่วมทดสอบเท่านั้น
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

export default Protected;
