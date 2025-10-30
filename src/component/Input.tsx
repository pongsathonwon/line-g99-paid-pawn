import { type InputHTMLAttributes, forwardRef } from "react";
import type {
  FormComponentProps,
  InputSize,
  InputVariant,
} from "@/component/types";

// Props ของ Input Component และ ประเภทของ Input variants
interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    FormComponentProps {
  inputSize?: InputSize;
  variant?: InputVariant;
}
/**
 * Input Component
 *
 * Component สำหรับรับข้อมูลจากผู้ใช้
 * รองรับหลายรูปแบบ: default, error, success
 *
 * @example
 * <Input
 *   label="ชื่อผู้ใช้"
 *   placeholder="กรอกชื่อผู้ใช้"
 *   errorMessage="กรุณากรอกชื่อผู้ใช้"
 *   isRequired
 * />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      errorMessage,
      helperText,
      variant = "default",
      inputSize = "medium",
      isRequired = false,
      isDisabled = false,
      className = "",
      containerClassName = "",
      ...restProps
    },
    ref
  ) => {
    // กำหนด variant อัตโนมัติถ้ามี errorMessage
    const actualVariant = errorMessage ? "error" : variant;

    // CSS Classes สำหรับขนาดต่างๆ
    const sizeClasses = {
      small: "px-3 py-1.5 text-sm",
      medium: "px-4 py-2 text-base",
      large: "px-5 py-3 text-lg",
    };

    // CSS Classes สำหรับ variant ต่างๆ
    const variantClasses = {
      default: "border-gray-100 focus:border-gray-400 focus:ring-gray-400",
      error: "border-red-500 focus:border-red-500 focus:ring-red-500",
      success: "border-gold-700 focus:border-gold-700 focus:ring-gold-700",
    };

    // CSS Class พื้นฐานของ Input
    const baseInputClasses = `
      w-full
      rounded-lg
      border-[0.5px]
      placeholder-gray-400
      bg-white
      transition-colors
      duration-200
      focus:outline-none
      focus:ring-[0.5px]
      focus:ring-opacity-50
      disabled:bg-gray-100
      disabled:cursor-not-allowed
      disabled:text-gray-500
    `;

    // รวม CSS Classes
    const inputClasses = `
      ${baseInputClasses}
      ${sizeClasses[inputSize]}
      ${variantClasses[actualVariant]}
      ${className}
    `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <div className={`w-full ${containerClassName}`}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          disabled={isDisabled}
          className={inputClasses}
          aria-invalid={actualVariant === "error"}
          aria-required={isRequired}
          aria-describedby={
            errorMessage
              ? `${restProps.id}-error`
              : helperText
              ? `${restProps.id}-helper`
              : undefined
          }
          {...restProps}
        />

        {/* Error Message */}
        {errorMessage && (
          <p
            id={`${restProps.id}-error`}
            className="mt-1.5 text-sm text-red-600"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !errorMessage && (
          <p
            id={`${restProps.id}-helper`}
            className="mt-1.5 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

// ตั้งชื่อ Component สำหรับ debugging
Input.displayName = "Input";

export { Input };
