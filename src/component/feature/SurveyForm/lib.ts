import { AxiosError } from "axios";

export const SURVEY_LINKED_PATH = "/survey/linked";
// the register flow sends the user on to SURVEY_LINKED_PATH when it succeeds
export const SURVEY_REGISTER_PATH = `/register?redirect=${encodeURIComponent(SURVEY_LINKED_PATH)}`;

export const getHttpStatus = (error: unknown) =>
  error instanceof AxiosError ? error.response?.status : undefined;

// 503 = GoldenApi could not reach LINE to verify the ID token: worth a retry.
// 401 is handled by logging in again, anything else will not fix itself.
export const retryOnServiceUnavailable = (failureCount: number, error: unknown) =>
  getHttpStatus(error) === 503 && failureCount < 2;
