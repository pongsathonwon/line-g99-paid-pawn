import { useRegistrationContext } from "@/context/RegistrationContext";
import { SearchUserStep } from "./SearchUserStep";
import { OTPVerificationStep } from "./OTPVerificationStep";
import { SuccessStep } from "./SuccessStep";
import { PendingApprovalStep } from "./PendingApprovalStep";

const StepFormRef = ["ข้อมูลสมาชิก", "ยืนยัน otp", "สำเร็จ"];

export function RegisterForm() {
  const { currentStep } = useRegistrationContext();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {currentStep === "search" && <SearchUserStep />}
        {currentStep === "otp" && <OTPVerificationStep />}
        {currentStep === "success" && <SuccessStep />}
        {currentStep === "pending" && <PendingApprovalStep />}
      </div>
    </div>
  );
}

export default RegisterForm;
