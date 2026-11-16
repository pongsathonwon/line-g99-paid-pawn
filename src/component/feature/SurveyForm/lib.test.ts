import { describe, expect, it } from "vitest";
import { createHttpError } from "@/test/setup/survey-api-mock";
import {
  formatAmount,
  formatTxnAt,
  getHttpStatus,
  getResultCode,
  getSurveyEntry,
  isMemberServiceDown,
  isTestKeyRefused,
  parseBranchParam,
  retryOnServiceUnavailable,
  surveyFormPath,
  surveyListPath,
  surveyRegisterPath,
} from "./lib";

const params = (search: string) => new URLSearchParams(search);

describe("survey lib", () => {
  it.each([
    ["?b=6", "6"],
    ["?b= 30 ", "30"],
    ["?b=0", "0"],
    ["", null],
    ["?b=", null],
    ["?b=abc", null],
    ["?b=-1", null],
    ["?b=6.5", null],
  ])("parseBranchParam(%s) = %s", (search, expected) => {
    expect(parseBranchParam(params(search))).toBe(expected);
  });

  it("builds list, form and register paths that keep ?b", () => {
    expect(surveyListPath("6")).toBe("/survey?b=6");
    expect(surveyListPath(null)).toBe("/survey");
    expect(surveyFormPath({ txnType: "PAWN", docNumb: "P06/1 2" }, "6")).toBe(
      "/survey/t/PAWN/P06%2F1%202?b=6",
    );
    expect(surveyFormPath({ txnType: "REDEEM", docNumb: "P060000789" }, null)).toBe(
      "/survey/t/REDEEM/P060000789",
    );
    expect(surveyRegisterPath("6")).toBe("/register?redirect=%2Fsurvey%3Fb%3D6");
    expect(surveyRegisterPath(null)).toBe("/register?redirect=%2Fsurvey");
  });

  it("answers 'qr' only when the list came from a branch QR", () => {
    expect(getSurveyEntry("6")).toBe("qr");
    expect(getSurveyEntry(null)).toBe("manual");
  });

  it("reads the HTTP status and resultCode of an axios error only", () => {
    expect(getHttpStatus(createHttpError(409, "40901"))).toBe(409);
    expect(getResultCode(createHttpError(409, "40901"))).toBe("40901");
    expect(getHttpStatus(new Error("x"))).toBeUndefined();
    expect(getResultCode(new Error("x"))).toBeUndefined();
  });

  it("ignores a body without a string resultCode", () => {
    const error = createHttpError(404);
    error.response!.data = "";
    expect(getResultCode(error)).toBeUndefined();
  });

  it("tells Simatic down (503 50003) from LINE down (503 50002)", () => {
    expect(isMemberServiceDown(createHttpError(503, "50003"))).toBe(true);
    expect(isMemberServiceDown(createHttpError(503, "50002"))).toBe(false);
  });

  it("retries 503 twice, except Simatic down, which gets the retry screen", () => {
    expect(retryOnServiceUnavailable(0, createHttpError(503, "50002"))).toBe(true);
    expect(retryOnServiceUnavailable(1, createHttpError(503, "50002"))).toBe(true);
    expect(retryOnServiceUnavailable(2, createHttpError(503, "50002"))).toBe(false);
    expect(retryOnServiceUnavailable(0, createHttpError(503, "50003"))).toBe(false);
    expect(retryOnServiceUnavailable(0, createHttpError(401))).toBe(false);
    expect(retryOnServiceUnavailable(0, createHttpError(500))).toBe(false);
  });

  it("detects a refused test key by 403 + 40101 only", () => {
    expect(isTestKeyRefused(createHttpError(403, "40101"))).toBe(true);
    expect(isTestKeyRefused(createHttpError(403, "40301"))).toBe(false);
    expect(isTestKeyRefused(createHttpError(400, "40101"))).toBe(false);
  });

  it("prints txnAt as the Bangkok wall clock, whatever the device zone", () => {
    const text = formatTxnAt("2026-11-08T14:05:00");
    expect(text).toMatch(/^8 .+ 2569 14:05$/);
    expect(formatTxnAt("not a date")).toBe("not a date");
  });

  it("prints amounts in baht with 2 decimals", () => {
    expect(formatAmount(1500)).toBe("1,500.00 บาท");
    expect(formatAmount(18900.5)).toBe("18,900.50 บาท");
  });
});
