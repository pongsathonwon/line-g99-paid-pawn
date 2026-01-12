import { type KeyboardEvent, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { cn } from "@/utils";

type TOTPForm = {
  otpNumbers: Array<{ number: string }>;
};

type OTPInputProps = {
  length?: number;
  onComplete?: (otp: string) => void;
  onChange?: (otp: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  inputClassName?: string;
};

function OTPInput({
  length = 6,
  onComplete,
  onChange,
  disabled = false,
  error = false,
  className,
  inputClassName,
}: OTPInputProps) {
  const { control, setValue, setFocus, getValues } = useForm<TOTPForm>({
    defaultValues: {
      otpNumbers: Array.from({ length }).map(() => ({ number: "" })),
    },
  });

  const { fields } = useFieldArray({ name: "otpNumbers", control });

  // Track if paste is in progress to prevent onChange interference
  const isPastingRef = useRef(false);

  // Watch all fields to check if OTP is complete
  // const otpValues = watch("otpNumbers");
  // const currentOtp = otpValues.map((f) => f.number).join("");

  // Check if OTP is complete and trigger callback
  const checkComplete = () => {
    const otp = getValues("otpNumbers")
      .map((f) => f.number)
      .join("");

    onChange?.(otp);

    if (otp.length === length) {
      onComplete?.(otp);
    }
  };

  // Handle input change with auto-focus
  const handleInputChange = (index: number, value: string) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    // Set the value
    setValue(`otpNumbers.${index}.number`, value.slice(-1));

    // Auto-focus next input if value is entered
    if (value && index < length - 1) {
      setFocus(`otpNumbers.${index + 1}.number`);
    }

    // Check if complete
    setTimeout(checkComplete, 0);
  };

  // Handle keydown for backspace navigation
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const currentValue = getValues(`otpNumbers.${index}.number`);

      // If current field is empty, move to previous field
      if (!currentValue && index > 0) {
        setFocus(`otpNumbers.${index - 1}.number`);
      }
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    isPastingRef.current = true;

    const pastedData = e.clipboardData.getData("text").slice(0, length);

    if (!/^\d+$/.test(pastedData)) {
      isPastingRef.current = false;
      return;
    }

    pastedData.split("").forEach((char, index) => {
      if (index < length) {
        setValue(`otpNumbers.${index}.number`, char);
      }
    });

    // Focus last filled input or last input
    const focusIndex = Math.min(pastedData.length, length - 1);
    setFocus(`otpNumbers.${focusIndex}.number`);

    // Check if complete
    setTimeout(checkComplete, 0);

    // Reset paste flag after a brief delay to allow onChange events to be ignored
    setTimeout(() => {
      isPastingRef.current = false;
    }, 100);
  };

  // Clear all inputs (exposed via ref if needed)
  // const clear = () => {
  //   fields.forEach((_, index) => {
  //     setValue(`otpNumbers.${index}.number`, "");
  //   });
  //   setFocus("otpNumbers.0.number");
  // };

  return (
    <div className={cn("flex justify-center gap-3", className)}>
      {fields.map((field, index) => (
        <Controller
          key={field.id}
          control={control}
          name={`otpNumbers.${index}.number`}
          rules={{ required: true, pattern: /^\d$/ }}
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <input
              {...fieldProps}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value}
              onChange={(e) => {
                // Skip onChange if paste is in progress (paste handler manages everything)
                if (isPastingRef.current) {
                  return;
                }

                // Only allow numeric input
                if (!/^\d*$/.test(e.target.value)) {
                  e.preventDefault();
                  return;
                }
                onChange(e);
                handleInputChange(index, e.target.value);
              }}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={disabled}
              className={cn(
                "w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg transition-all",
                "focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2",
                "disabled:bg-gray-100 disabled:cursor-not-allowed",
                error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-brand-red",
                inputClassName
              )}
            />
          )}
        />
      ))}
    </div>
  );
}

export default OTPInput;
