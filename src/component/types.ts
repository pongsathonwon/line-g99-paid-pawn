/**
 * Types สำหรับ Components
 * ไฟล์รวม type definitions ที่ใช้ร่วมกันในหลาย components
 */

// ขนาดมาตรฐานของ Components
export type ComponentSize = "small" | "medium" | "large";

// สถานะของ Components
export type ComponentVariant =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "success"
  | "warning";

// สีของ Components
export type ComponentColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info";

// Base Props ที่ใช้ร่วมกันในหลาย Components
export interface BaseComponentProps {
  /** CSS Class เพิ่มเติม */
  className?: string;

  /** ปิดการใช้งาน Component */
  isDisabled?: boolean;

  /** แสดง Loading state */
  isLoading?: boolean;

  /** Test ID สำหรับการทำ Testing */
  testId?: string;
}

// Props สำหรับ Form Components
export interface FormComponentProps extends BaseComponentProps {
  /** ชื่อของ field */
  name?: string;

  /** ข้อความ Label */
  label?: string;

  /** Field นี้เป็น required */
  isRequired?: boolean;

  /** ข้อความแสดงความผิดพลาด */
  errorMessage?: string;

  /** ข้อความช่วยเหลือ */
  helperText?: string;

  /** CSS Class สำหรับ Container */
  containerClassName?: string;
}

// Export Input specific types
export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "time"
  | "datetime-local";

export type InputVariant = "default" | "error" | "success";

export type InputSize = "small" | "medium" | "large";
