import { z } from "zod";
import type { TSearchUserMethod } from "@/types/register";

/**
 * Validates ID Card number (13 digits)
 */
const idCardSchema = z
  .string()
  .min(1, "กรุณากรอกเลขบัตรประชาชน")
  .regex(/^\d{13}$/, "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก");

/**
 * Validates Mobile Number (10 digits starting with 0)
 */
const mobileNumberSchema = z
  .string()
  .min(1, "กรุณากรอกเบอร์โทรศัพท์")
  .regex(/^0\d{9}$/, "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก ขึ้นต้นด้วย 0");

/**
 * Validates Customer Code (6-7 digits, not starting with 0)
 */
const custCodeSchema = z
  .string()
  .min(1, "กรุณากรอกรหัสลูกค้า")
  .regex(/^[1-9]\d{5,6}$/, "รหัสลูกค้าต้องเป็นตัวเลข 6-7 หลัก และต้องไม่ขึ้นต้นด้วย 0");

/**
 * Creates a validation schema based on the search method
 */
export const createSearchCustomerSchema = (searchMethod: TSearchUserMethod) => {
  const schemaMap: Record<TSearchUserMethod, z.ZodString> = {
    idCard: idCardSchema,
    mobileNumber: mobileNumberSchema,
    custCode: custCodeSchema,
  };

  return z.object({
    searchValue: schemaMap[searchMethod],
  });
};

/**
 * Type for the search customer form
 */
export type TSearchCustomerFormSchema = z.infer<
  ReturnType<typeof createSearchCustomerSchema>
>;
