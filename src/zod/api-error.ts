import { z } from "zod";

export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
});

export type TApiError = z.infer<typeof ApiErrorSchema>;

export const parseApiError = (error: unknown): TApiError | null => {
  try {
    return ApiErrorSchema.parse(error);
  } catch {
    return null;
  }
};
