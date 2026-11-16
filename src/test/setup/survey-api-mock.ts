import { vi } from "vitest";
import { AxiosError, AxiosHeaders, type AxiosResponse } from "axios";
import type {
  TSurveyForm,
  TSurveyResponseRes,
  TSurveyTransaction,
  TSurveyTransactions,
} from "@/api/endpoint/survey";

/**
 * Mock data for SURVEY_API tests, shaped like GoldenApi docs/SURVEY_API.md v2
 * (question set v1 from the design).
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
};

export const mockTxnChange: TSurveyTransaction = {
  txnType: "CHANGE_GOLD",
  label: "เปลี่ยนทอง",
  docNumb: "C060012345",
  txnAt: "2026-11-08T14:05:00",
  branchCode: 6,
  branchShortName: "G006",
  amount: 1500,
  surveyed: false,
};

export const mockTxnPawn: TSurveyTransaction = {
  txnType: "PAWN",
  label: "จำนำ",
  docNumb: "P010000777",
  txnAt: "2026-11-01T09:30:00",
  branchCode: 1,
  branchShortName: "G001",
  amount: 25000,
  surveyed: false,
};

export const mockTxnRated: TSurveyTransaction = {
  txnType: "PAY_INTEREST",
  label: "ต่อดอก",
  docNumb: "R060054321",
  txnAt: "2026-11-09T10:12:00",
  branchCode: 1,
  branchShortName: "G001",
  amount: 750,
  surveyed: true,
};

/** A member's list, in the order GoldenApi returned it. */
export const mockSurveyTransactions: TSurveyTransactions = {
  isMember: true,
  custCode: "4401837",
  windowDays: 30,
  windowFrom: "2026-10-10",
  windowTo: "2026-11-09",
  items: [mockTxnChange, mockTxnRated, mockTxnPawn],
};

export const mockNonMemberTransactions: TSurveyTransactions = {
  isMember: false,
  custCode: null,
  windowDays: 30,
  windowFrom: "2026-10-10",
  windowTo: "2026-11-09",
  items: [],
};

export const TEST_UID = "U0bf26f4085b0a41af588f6cb1774409e";

/** /transactions in test mode (X-Survey-Test-Key accepted). */
export const mockTestTransactions: TSurveyTransactions = {
  ...mockSurveyTransactions,
  testMode: true,
  effectiveUid: TEST_UID,
};

export const mockSurveyResponseRes: TSurveyResponseRes = {
  responseId: 1024,
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
  const mockGetTransactions = vi.fn();
  const mockGetForm = vi.fn();
  const mockSubmitResponse = vi.fn();

  return {
    mockGetTransactions,
    mockGetForm,
    mockSubmitResponse,
    SURVEY_API: {
      getTransactions: mockGetTransactions,
      getForm: mockGetForm,
      submitResponse: mockSubmitResponse,
    },
  };
};
