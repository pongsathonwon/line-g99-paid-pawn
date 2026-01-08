import { z } from "zod";
import type { TSearchUserMethod } from "@/types/register";
type ValidationMessage = {
  required: string;
  pattern: string;
};

export const createSearchCustomerSchema = (
  searchMethod: TSearchUserMethod,
  messages: ValidationMessage
) => {
  const schemaMap: Record<TSearchUserMethod, z.ZodString> = {
    /**
     * Validates ID Card number (13 digits)
     */
    idCard: z
      .string()
      .min(1, messages.required)
      .regex(/^\d{13}$/, messages.pattern),

    /**
     * Validates Mobile Number (10 digits starting with 0)
     */
    mobileNumber: z
      .string()
      .min(1, messages.required)
      .regex(/^0\d{9}$/, messages.pattern),

    /**
     * Validates Customer Code (6-7 digits, not starting with 0)
     */
    custCode: z
      .string()
      .min(1, messages.required)
      .regex(/^[1-9]\d{5,6}$/, messages.pattern),
  };
  return z.object({
    searchValue: schemaMap[searchMethod],
  });
};
/**
 * Creates a validation schema based on the search method
 */

/**
 * Type for the search customer form
 */
export type TSearchCustomerFormSchema = z.infer<
  ReturnType<typeof createSearchCustomerSchema>
>;
