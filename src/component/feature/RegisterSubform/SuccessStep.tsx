import { useNavigate } from "react-router-dom";
import { Button } from "@/component/Button";
import { useAuthContext } from "@/context/AuthContext/AuthContext";
import { useEffect } from "react";

export function SuccessStep() {
  const navigate = useNavigate();
  const { relogin } = useAuthContext();
  const handleContinue = async () => {
    navigate("/home");
  };

  useEffect(() => {
    relogin();
  }, []);

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">ลงทะเบียนสำเร็จ</h2>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          You can now access all features and services. Welcome!
        </p>
      </div>

      <Button type="button" onClick={handleContinue} color="primary" fullWidth>
        กลับสู่เมนูหลัก
      </Button>
    </div>
  );
}
