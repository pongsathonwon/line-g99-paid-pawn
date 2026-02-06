import { useEffect, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { REGISTER_API } from "@/api/endpoint/register";
import { useRegistrationContext } from "@/context/RegistrationContext";
import { useAuthContext } from "@/context/AuthContext/AuthContext";
import { Button } from "@/component/Button";
import {
  handlePasteOtp,
  handleInputOtp,
  handleKeyupOtp,
  getOtpValue,
  isOtpComplete,
  clearOtpInputs,
  formatMobileNumber,
} from "@/utils/otp";

export function OTPVerificationStep() {
  const { formData, handleSetFormData, setCurrentStep } =
    useRegistrationContext();
  const { auth } = useAuthContext();
  const [otpError, setOtpError] = useState<string>("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputsRef = useRef<HTMLDivElement>(null);

  const renderArray = Array.from({ length: 6 });

  // Request OTP on mount
  const requestOtpMutation = useMutation({
    mutationFn: () => {
      if (!formData.userData?.mobileNo) {
        throw new Error("Mobile number not found");
      }
      return REGISTER_API.requestOtp({ msisdn: formData.userData.mobileNo });
    },
    onSuccess: (data) => {
      handleSetFormData({
        otpToken: data.token,
        otpRefNo: data.refno,
      });
      setResendTimer(60); // Start 60 second countdown
    },
    onError: (error: any) => {
      setOtpError(error.message || "Failed to send OTP. Please try again.");
    },
  });

  // Verify OTP
  const verifyOtpMutation = useMutation({
    mutationFn: (pin: string) => {
      if (!formData.otpToken) {
        throw new Error("OTP token not found");
      }
      return REGISTER_API.verifyOtp({
        token: formData.otpToken,
        pin,
      });
    },
    onSuccess: () => {
      handleSetFormData({ otpCode: getOtpValue() });
      // Register user after OTP verification
      registerMutation.mutate();
    },
    onError: (error: any) => {
      setOtpError(error.message || "Invalid OTP code. Please try again.");
      clearOtpInputs();
      setCanSubmit(false);
    },
  });

  // Register user (Thai or Foreign)
  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!formData.userData || !auth?.lineUid) {
        throw new Error("User data or LINE UID not found");
      }

      const registerData = {
        lineUid: auth.lineUid,
        custNo: formData.userData.custNo,
        fullname: formData.userData.fullname,
        idCard: formData.userData.idCard,
        birthDate: formData.userData.birthDate,
        mobileNo: formData.userData.mobileNo,
        branchCode: formData.userData.branchCode,
        custType: formData.userData.custType,
        custStat: formData.userData.custStat,
        nationCode: formData.userData.nationCode,
        gender: formData.userData.gender,
        isConsent: formData.isConsent,
        isVerified: true,
      };

      if (formData.userType === "foreign") {
        return REGISTER_API.registerForeignUser(registerData);
      } else {
        return REGISTER_API.registerUser(registerData);
      }
    },
    onSuccess: (data) => {
      // Move to success or pending step based on approval status
      if (data.approvalStatus === "pending") {
        setCurrentStep("pending");
      } else {
        setCurrentStep("success");
      }
    },
    onError: (error: any) => {
      setOtpError(error.message || "Registration failed. Please try again.");
    },
  });

  // Request OTP on mount
  useEffect(() => {
    if (!formData.otpToken) {
      requestOtpMutation.mutate();
    }
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const checkOtpComplete = () => {
    const complete = isOtpComplete();
    setCanSubmit(complete);
    if (complete) {
      setOtpError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit && !verifyOtpMutation.isPending) {
      const pin = getOtpValue();
      verifyOtpMutation.mutate(pin);
    }
  };

  const handleResendOtp = () => {
    clearOtpInputs();
    setCanSubmit(false);
    setOtpError("");
    requestOtpMutation.mutate();
  };

  const handleBack = () => {
    setCurrentStep("search");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Verify Mobile Number
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter the 6-digit code sent to{" "}
          <strong>
            {formatMobileNumber(formData.userData?.mobileNo || "")}
          </strong>
        </p>
        {formData.otpRefNo && (
          <p className="mt-1 text-xs text-gray-500">
            Reference Number: <strong>{formData.otpRefNo}</strong>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input Fields */}
        <div className="space-y-4">
          <div ref={otpInputsRef} className="flex justify-center gap-3">
            {[...renderArray].map((_, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="otp-input w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-brand-red focus:ring-2 focus:ring-brand-red focus:ring-opacity-20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                onPaste={handlePasteOtp}
                onInput={(e) => handleInputOtp(e, checkOtpComplete)}
                onKeyUp={handleKeyupOtp}
                disabled={
                  verifyOtpMutation.isPending || registerMutation.isPending
                }
              />
            ))}
          </div>

          {/* Error Message */}
          {otpError && (
            <div className="text-sm text-red-600 text-center">{otpError}</div>
          )}
        </div>

        {/* Resend OTP */}
        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-gray-600">
              Resend code in <strong>{resendTimer}s</strong>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={requestOtpMutation.isPending}
              className="text-sm text-brand-red hover:underline font-medium disabled:text-gray-400 disabled:no-underline"
            >
              {requestOtpMutation.isPending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={handleBack}
            color="secondary"
            styleType="outline"
            size="lg"
            disabled={verifyOtpMutation.isPending || registerMutation.isPending}
          >
            Back
          </Button>
          <Button
            type="submit"
            color="primary"
            size="lg"
            fullWidth
            disabled={
              !canSubmit ||
              verifyOtpMutation.isPending ||
              registerMutation.isPending
            }
          >
            {verifyOtpMutation.isPending
              ? "Verifying..."
              : registerMutation.isPending
              ? "Registering..."
              : "Verify & Register"}
          </Button>
        </div>

        {/* Loading Indicator */}
        {requestOtpMutation.isPending && (
          <div className="text-center text-sm text-gray-600">
            Sending OTP code...
          </div>
        )}
      </form>
    </div>
  );
}
