import { REGISTER_API } from "@/api/endpoint/register";
import useTimer from "@/hook/useTimer";
import { useMutation } from "@tanstack/react-query";
import { useState, type PropsWithChildren } from "react";
import { OTPInput } from "@/component/OTPInput";

type TOTPVerificationProps = PropsWithChildren<{
  mobileNo?: string;
  otpLength?: number;
  onSuccess?: (pin: string) => void;
}>;

function OTPVerification({
  children,
  mobileNo = "0123456789",
  otpLength = 6,
  onSuccess,
}: TOTPVerificationProps) {
  const [otpError, setOtpError] = useState<string>("");
  const [otpToken, setOtpToken] = useState<string>("");
  const [otpRefNo, setOtpRefNo] = useState<string>("");
  const [currentOtp, setCurrentOtp] = useState<string>("");
  const { time: resendTimer, reset: resetTimer } = useTimer({
    initialValue: 60,
    unit: "seconds",
    autoStart: false,
  });

  const requestOtpMutation = useMutation({
    mutationFn: () => REGISTER_API.requestOtp({ msisdn: mobileNo }),
    onSuccess: (data) => {
      setOtpToken(data.token);
      setOtpRefNo(data.refno);
      resetTimer(60);
      setOtpError("");
      setCurrentOtp("");
    },
    onError: (error: any) => {
      setOtpError(error.message || "ไม่สามารถส่ง OTP ได้ กรุณาลองอีกครั้ง");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (pin: string) => {
      if (!otpToken) {
        throw new Error("OTP token not found");
      }
      return REGISTER_API.verifyOtp({ token: otpToken, pin });
    },
    onSuccess: () => {
      onSuccess?.(currentOtp);
    },
    onError: (error: any) => {
      setOtpError(error.message || "รหัส OTP ไม่ถูกต้อง กรุณาลองอีกครั้ง");
      setCurrentOtp("");
    },
  });

  const handleOtpComplete = (otp: string) => {
    setCurrentOtp(otp);
  };

  const handleOtpChange = (otp: string) => {
    setCurrentOtp(otp);
    if (otp.length === 0) {
      setOtpError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentOtp.length === otpLength) {
      verifyOtpMutation.mutate(currentOtp);
    }
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    setCurrentOtp("");
    setOtpError("");
    requestOtpMutation.mutate();
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">ยืนยันรหัส OTP</h2>
        <p className="mt-2 text-sm text-gray-600">
          รหัส OTP 6 หลัก ส่งไปที่หมายเลข <strong>{mobileNo}</strong>
        </p>
        {otpRefNo && (
          <p className="mt-1 text-xs text-gray-500">
            หมายเลขอ้างอิง: <strong>{otpRefNo}</strong>
          </p>
        )}
      </div>

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input Fields */}
        <div className="space-y-4">
          <OTPInput
            length={otpLength}
            onComplete={handleOtpComplete}
            onChange={handleOtpChange}
            disabled={verifyOtpMutation.isPending}
            error={!!otpError}
          />

          {/* Error Message */}
          <div className="text-sm text-red-600 text-center min-h-5">
            {otpError || " "}
          </div>
        </div>

        {/* Resend OTP */}
        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-gray-600">
              ส่ง OTP ใหม่ได้ใน <strong>{Math.floor(resendTimer)}</strong>{" "}
              วินาที
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={requestOtpMutation.isPending}
              className="text-sm text-brand-red hover:underline font-medium disabled:text-gray-400 disabled:no-underline"
            >
              {requestOtpMutation.isPending ? "กำลังส่ง..." : "ส่ง OTP ใหม่"}
            </button>
          )}
        </div>

        {children && <div className="flex gap-4">{children}</div>}

        {requestOtpMutation.isPending && (
          <div className="text-center text-sm text-gray-600">
            กำลังส่งรหัส OTP...
          </div>
        )}
      </form>
    </div>
  );
}

export default OTPVerification;
