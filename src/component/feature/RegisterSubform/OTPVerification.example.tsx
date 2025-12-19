/**
 * Example usage of OTPVerification component
 */

import { Button } from "@/component/Button";
import OTPVerification from "./OTPVerification";

// Example 1: Basic usage with buttons
function ExampleWithButtons() {
  const handleOtpSuccess = (pin: string) => {
    console.log("OTP verified successfully:", pin);
    // Proceed with registration or next step
  };

  return (
    <OTPVerification mobileNo="0851493695" onSuccess={handleOtpSuccess}>
      <Button type="button" color="secondary" styleType="outline" size="lg">
        ย้อนกลับ
      </Button>
      <Button type="submit" color="primary" size="lg" fullWidth>
        ยืนยัน OTP
      </Button>
    </OTPVerification>
  );
}

// Example 2: Without buttons (you can add your own buttons elsewhere)
function ExampleWithoutButtons() {
  return <OTPVerification mobileNo="0812345678" />;
}

// Example 3: With context integration
import { useRegistrationContext } from "@/context/RegistrationContext";

function ExampleWithContext() {
  const { formData, setCurrentStep } = useRegistrationContext();

  const handleOtpSuccess = (pin: string) => {
    // Move to next step
    setCurrentStep("success");
  };

  const handleBack = () => {
    setCurrentStep("search");
  };

  return (
    <OTPVerification
      mobileNo={formData.userData?.mobileNo}
      onSuccess={handleOtpSuccess}
    >
      <Button
        type="button"
        onClick={handleBack}
        color="secondary"
        styleType="outline"
        size="lg"
      >
        ย้อนกลับ
      </Button>
      <Button type="submit" color="primary" size="lg" fullWidth>
        ยืนยัน OTP
      </Button>
    </OTPVerification>
  );
}

export { ExampleWithButtons, ExampleWithoutButtons, ExampleWithContext };
