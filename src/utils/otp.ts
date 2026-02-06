/**
 * OTP Input Utility Functions
 * Adapted from GoldLineCRM.FE otp.utils.js
 */

/**
 * Handle paste event to auto-fill all 6 OTP inputs
 */
export const handlePasteOtp = (e: React.ClipboardEvent<HTMLInputElement>) => {
  e.preventDefault();
  const pastedData = e.clipboardData.getData('text');

  // Check if pasted data is numeric and 6 digits
  if (/^\d{6}$/.test(pastedData)) {
    const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input');
    const digits = pastedData.split('');

    digits.forEach((digit, index) => {
      if (inputs[index]) {
        inputs[index].value = digit;
      }
    });

    // Focus on last input
    if (inputs[5]) {
      inputs[5].focus();
    }

    // Trigger change event to enable submit button
    const changeEvent = new Event('input', { bubbles: true });
    inputs[5]?.dispatchEvent(changeEvent);
  }
};

/**
 * Handle input to validate numeric only and auto-advance to next field
 */
export const handleInputOtp = (
  e: React.FormEvent<HTMLInputElement>,
  callback?: () => void
) => {
  const input = e.currentTarget;
  const value = input.value;

  // Allow only numeric input
  if (Number.isNaN(Number(value)) || value.length > 1) {
    input.value = '';
    return;
  }

  // If value is entered, move to next input
  if (value.length === 1) {
    const nextInput = input.nextElementSibling as HTMLInputElement;
    if (nextInput?.classList.contains('otp-input')) {
      nextInput.focus();
    }
  }

  // Execute callback (e.g., to check if all 6 digits entered)
  if (callback) {
    callback();
  }
};

/**
 * Handle backspace/delete to navigate to previous field
 */
export const handleKeyupOtp = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const input = e.currentTarget;

  if (e.key === 'Backspace' || e.key === 'Delete') {
    if (input.value === '') {
      const prevInput = input.previousElementSibling as HTMLInputElement;
      if (prevInput?.classList.contains('otp-input')) {
        prevInput.focus();
        prevInput.value = '';
      }
    }
  }
};

/**
 * Get concatenated OTP value from all 6 inputs
 */
export const getOtpValue = (): string => {
  const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input');
  let otpCode = '';

  inputs.forEach((input) => {
    otpCode += input.value;
  });

  return otpCode;
};

/**
 * Check if OTP is complete (all 6 digits entered)
 */
export const isOtpComplete = (): boolean => {
  const otpValue = getOtpValue();
  return otpValue.length === 6 && /^\d{6}$/.test(otpValue);
};

/**
 * Clear all OTP input fields
 */
export const clearOtpInputs = () => {
  const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input');
  inputs.forEach((input) => {
    input.value = '';
  });

  // Focus on first input
  if (inputs[0]) {
    inputs[0].focus();
  }
};

/**
 * Format mobile number for display (0812345678 → 081-234-5678)
 */
export const formatMobileNumber = (mobile: string): string => {
  const cleaned = mobile.replaceAll(/\D/g, '');

  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return mobile;
};

/**
 * Remove formatting from mobile number (081-234-5678 → 0812345678)
 */
export const unformatMobileNumber = (mobile: string): string => {
  return mobile.replaceAll(/\D/g, '');
};

/**
 * Validate Thai ID card format (13 digits)
 */
export const isValidThaiIdCard = (idCard: string): boolean => {
  const cleaned = idCard.replaceAll(/\D/g, '');
  return cleaned.length === 13 && /^\d{13}$/.test(cleaned);
};

/**
 * Validate mobile number format (10 digits starting with 0)
 */
export const isValidMobileNumber = (mobile: string): boolean => {
  const cleaned = mobile.replaceAll(/\D/g, '');
  return cleaned.length === 10 && /^0\d{9}$/.test(cleaned);
};
