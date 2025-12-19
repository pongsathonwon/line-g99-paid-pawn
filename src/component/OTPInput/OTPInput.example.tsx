/**
 * Example usage of OTPInput component
 */

import { useState } from "react";
import { OTPInput } from "./OTPInput";

// Example 1: Basic 6-digit OTP
export function Example6DigitOTP() {
  const [otp, setOtp] = useState("");

  const handleComplete = (value: string) => {
    console.log("OTP Complete:", value);
    // Auto-submit or validate
  };

  return (
    <div>
      <h3>Enter 6-digit OTP</h3>
      <OTPInput length={6} onComplete={handleComplete} onChange={setOtp} />
      <p>Current OTP: {otp}</p>
    </div>
  );
}

// Example 2: 4-digit PIN
export function Example4DigitPIN() {
  const handleComplete = (pin: string) => {
    console.log("PIN Complete:", pin);
  };

  return (
    <div>
      <h3>Enter 4-digit PIN</h3>
      <OTPInput length={4} onComplete={handleComplete} />
    </div>
  );
}

// Example 3: With error state
export function ExampleWithError() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);

  const handleComplete = (value: string) => {
    // Validate OTP
    if (value === "123456") {
      setError(false);
      console.log("Correct!");
    } else {
      setError(true);
    }
  };

  return (
    <div>
      <h3>Enter OTP (correct: 123456)</h3>
      <OTPInput
        length={6}
        onComplete={handleComplete}
        onChange={setOtp}
        error={error}
      />
      {error && <p className="text-red-600">Invalid OTP</p>}
    </div>
  );
}

// Example 4: Disabled state
export function ExampleDisabled() {
  return (
    <div>
      <h3>Disabled OTP Input</h3>
      <OTPInput length={6} disabled />
    </div>
  );
}

// Example 5: Custom styling
export function ExampleCustomStyle() {
  return (
    <div>
      <h3>Custom Styled OTP</h3>
      <OTPInput
        length={6}
        className="gap-2"
        inputClassName="w-16 h-16 text-3xl border-4 border-blue-500 rounded-xl"
      />
    </div>
  );
}

// Example 6: 8-digit verification code
export function Example8DigitCode() {
  const [code, setCode] = useState("");

  return (
    <div>
      <h3>Enter 8-digit verification code</h3>
      <OTPInput length={8} onChange={setCode} />
      <p>Code: {code}</p>
    </div>
  );
}
