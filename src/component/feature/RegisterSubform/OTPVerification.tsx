import { REGISTER_API } from "@/api/endpoint/register";
import useTimer from "@/hook/useTimer";
import { useMutation } from "@tanstack/react-query";
import React, { useState, type PropsWithChildren } from "react";
import { OTPInput } from "@/component/OTPInput";
import type { TMaybe } from "@/types/base.type";
import { Button } from "@/component/Button";
import type { TOtpRequestRes } from "@/types/register";
import { useMultistepForm } from "@/context/MultistepFormContext/MultiStepFormContext";
import { REGISTER_LOCALE_TEXT } from "@/component/feature/RegisterForm/register.locale";

type RegisterLocale = "th" | "en";

type TOTPVerificationProps = PropsWithChildren<{
  mobileNo: TMaybe<string>;
  otpRes: TMaybe<TOtpRequestRes>;
  otpLength: number;
  locale: RegisterLocale;
  onSuccess: (verifyRes: boolean) => void;
  onSetOtp: (otpRes: TOtpRequestRes) => void;
}>;

function OTPVerification({
  mobileNo,
  otpLength,
  otpRes,
  onSetOtp,
  onSuccess,
  locale,
  children,
}: TOTPVerificationProps) {
  const t = REGISTER_LOCALE_TEXT[locale].otp;
  const { next } = useMultistepForm();
  const [otpError, setOtpError] = useState<string>("");
  const [currentOtp, setCurrentOtp] = useState<string>("");
  const otpToken = otpRes?.token ?? "";
  const otpRefNo = otpRes?.refno;
  const { time: resendTimer, reset: resetTimer } = useTimer({
    initialValue: 60,
    unit: "seconds",
    autoStart: true,
  });

  const requestOtpMutation = useMutation({
    mutationFn: async () => {
      if (mobileNo === null) throw new Error("เบอร์โทรศัพท์ไม่ถูกต้อง");
      return await REGISTER_API.requestOtp({ msisdn: mobileNo });
    },

    onSuccess: (data) => {
      onSetOtp(data);
      resetTimer(60 * 5);
      setOtpError("");
      setCurrentOtp("");
    },
    onError: () => {
      setOtpError(t.requestFail);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (pin: string) => {
      if (!otpToken) {
        throw new Error("OTP token not found");
      }
      return REGISTER_API.verifyOtp({ token: otpToken, pin });
    },
    onSuccess: (res) => {
      const isSuccess = res.status === "success";
      if (isSuccess) {
        onSuccess(isSuccess);
        next();
      }
    },
    onError: () => {
      setOtpError(t.invalidOtp);
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
  React.useEffect(() => {
    if (mobileNo === null) return;
    requestOtpMutation.mutate();
  }, [mobileNo]);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
        <p className="mt-2 text-sm text-gray-600">
          {mobileNo ? t.description(mobileNo) : t.noMobile}
        </p>
        {otpRefNo && (
          <p className="mt-1 text-xs text-gray-500">
            {t.refNo}: <strong>{otpRefNo}</strong>
          </p>
        )}
      </div>

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input Fields */}
        <div className="space-y-1">
          <OTPInput
            length={otpLength}
            onComplete={handleOtpComplete}
            onChange={handleOtpChange}
            disabled={verifyOtpMutation.isPending}
            error={!!otpError}
          />

          {/* Error Message */}
          <div className="text-sm text-red-600 text-center min-h-5">
            {otpError || ""}
          </div>
        </div>
        <Button
          fullWidth
          type="submit"
          disabled={currentOtp.length !== otpLength}
        >
          {t.confirm}
        </Button>

        {/* Resend OTP */}
        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-gray-600">
              {t.resendIn} <strong>{Math.floor(resendTimer)}</strong>{" "}
              {t.timeUnit}{" "}
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={requestOtpMutation.isPending}
              className="text-sm text-brand-red hover:underline font-medium disabled:text-gray-400 disabled:no-underline"
            >
              {requestOtpMutation.isPending ? t.resendSending : t.resend}
            </button>
          )}
        </div>

        {children && <div className="flex gap-4">{children}</div>}

        {requestOtpMutation.isPending && (
          <div className="text-center text-sm text-gray-600">{t.sending}</div>
        )}
      </form>
    </div>
  );
}

export default OTPVerification;
