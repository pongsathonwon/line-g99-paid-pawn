import { describe, expect, it } from "vitest";
import { createHttpError } from "@/test/setup/survey-api-mock";
import {
  SURVEY_REGISTER_PATH,
  getHttpStatus,
  retryOnServiceUnavailable,
} from "./lib";

describe("survey lib", () => {
  it("sends the register flow back to /survey/linked", () => {
    expect(SURVEY_REGISTER_PATH).toBe("/register?redirect=%2Fsurvey%2Flinked");
  });

  it("reads the HTTP status of an axios error only", () => {
    expect(getHttpStatus(createHttpError(409))).toBe(409);
    expect(getHttpStatus(new Error("x"))).toBeUndefined();
  });

  it("retries twice on 503 only", () => {
    expect(retryOnServiceUnavailable(0, createHttpError(503))).toBe(true);
    expect(retryOnServiceUnavailable(1, createHttpError(503))).toBe(true);
    expect(retryOnServiceUnavailable(2, createHttpError(503))).toBe(false);
    expect(retryOnServiceUnavailable(0, createHttpError(401))).toBe(false);
    expect(retryOnServiceUnavailable(0, createHttpError(500))).toBe(false);
  });
});
