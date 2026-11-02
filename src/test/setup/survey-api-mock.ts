import { vi } from "vitest";
import { AxiosError, AxiosHeaders, type AxiosResponse } from "axios";
import type {
  TSurveyForm,
  TSurveyLinkRes,
  TSurveyResponseRes,
} from "@/api/endpoint/survey";

/**
 * Mock data for SURVEY_API tests, shaped like GoldenApi docs/SURVEY_API.md
 * (question set v1 from the design, §2 and §3).
 */
export const mockSurveyForm: TSurveyForm = {
  questionSet: {
    setId: 1,
    version: 1,
    title: "แบบประเมินหลังใช้บริการ",
    questions: [
      { questionId: 11, seq: 1, questionKey: "satisfaction", kind: "RATING_1_5", isRequired: true, textTh: "ความพึงพอใจในการใช้บริการ" },
      { questionId: 12, seq: 2, questionKey: "courtesy", kind: "RATING_1_5", isRequired: true, textTh: "ความสุภาพของพนักงานในการให้บริการ (อารมณ์ สีหน้า และท่าทาง)" },
      { questionId: 13, seq: 3, questionKey: "speed", kind: "RATING_1_5", isRequired: true, textTh: "ความรวดเร็วในการให้บริการ" },
      { questionId: 14, seq: 4, questionKey: "cleanliness", kind: "RATING_1_5", isRequired: true, textTh: "ความสะอาด และบรรยากาศของร้าน (กลิ่น อากาศ ความเรียบร้อยภายในร้าน)" },
      { questionId: 15, seq: 5, questionKey: "recommend", kind: "RATING_1_5", isRequired: true, textTh: "โอกาสแนะนำให้ผู้อื่นมาใช้บริการ" },
      { questionId: 16, seq: 6, questionKey: "comment", kind: "TEXT", isRequired: false, textTh: "ความเห็นเพิ่มเติม" },
    ],
  },
  txnTypes: [
    { code: "BUY_GOLD", label: "ซื้อทอง" },
    { code: "SELL_GOLD", label: "ขายทอง" },
    { code: "CHANGE_GOLD", label: "เปลี่ยนทอง" },
    { code: "PAWN", label: "จำนำ" },
    { code: "PAY_INTEREST", label: "ต่อดอก" },
    { code: "REDEEM", label: "ไถ่ถอน" },
    { code: "OTHER", label: "อื่นๆ" },
  ],
  branches: [
    { branchCode: 0, branchShortName: "G000", branchName: "สำนักงานใหญ่" },
    { branchCode: 6, branchShortName: "G006", branchName: "สาขา 6" },
    { branchCode: 30, branchShortName: "G030", branchName: "สาขา 30" },
  ],
  presetBranchCode: 6,
  member: { isMember: false, custCode: null },
};

export const mockSurveyResponseRes: TSurveyResponseRes = {
  responseId: 1024,
  isMember: true,
};

export const mockSurveyLinkRes: TSurveyLinkRes = {
  linked: 2,
  isMember: true,
};

/** A /form answer in test mode (X-Survey-Test-Key accepted). */
export const mockSurveyTestForm: TSurveyForm = {
  ...mockSurveyForm,
  member: { isMember: true, custCode: "4401837" },
  testMode: true,
  effectiveUid: "U0bf26f4085b0a41af588f6cb1774409e",
};

/** An axios error with an HTTP status, as the survey client would reject with. */
export const createHttpError = (
  status: number,
  resultCode = `${status}00`,
  errorMessage = "mock",
) => {
  const response = {
    status,
    statusText: String(status),
    data: { resultCode, resultData: { errorMessage } },
    headers: {},
    config: { headers: new AxiosHeaders() },
  } as AxiosResponse;
  return new AxiosError(
    `Request failed with status code ${status}`,
    String(status),
    response.config,
    null,
    response,
  );
};

/** GoldenApi refusing X-Survey-Test-Key. */
export const createTestKeyRefusedError = (errorMessage = "invalid test key") =>
  createHttpError(403, "40101", errorMessage);

/**
 * Mock SURVEY_API module. Use in vi.mock("@/api/endpoint/survey", ...).
 */
export const createSurveyApiMock = () => {
  const mockGetForm = vi.fn();
  const mockSubmitResponse = vi.fn();
  const mockLink = vi.fn();

  return {
    mockGetForm,
    mockSubmitResponse,
    mockLink,
    SURVEY_API: {
      getForm: mockGetForm,
      submitResponse: mockSubmitResponse,
      link: mockLink,
    },
  };
};
