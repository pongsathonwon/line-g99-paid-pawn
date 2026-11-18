import { surveyClient } from "../survey-axios";

// GoldenApi /api/survey/v1, customer side, v2 (GoldenApi docs/SURVEY_API.md;
// design contexts/post-visit-survey-v2-design.md §5)

/** The member's own POS transactions from the last 30 days; `b` sorts first. */
export const getSurveyTransactions = async (branchCode?: string | null) => {
  const { data } = await surveyClient.get<
    TSurveyEnvelope<TSurveyTransactions>
  >("transactions", { params: branchCode ? { b: branchCode } : undefined });
  return data.resultData;
};

/** Only the active question set (no branches, types or membership in v2). */
export const getSurveyForm = async () => {
  const { data } = await surveyClient.get<TSurveyEnvelope<TSurveyForm>>("form");
  return data.resultData;
};

export const submitSurveyResponse = async (req: TSurveyResponseReq) => {
  const { data } = await surveyClient.post<
    TSurveyEnvelope<TSurveyResponseRes>
  >("responses", req);
  return data.resultData;
};

export const SURVEY_API = {
  getTransactions: getSurveyTransactions,
  getForm: getSurveyForm,
  submitResponse: submitSurveyResponse,
};

export type TSurveyEnvelope<T> = {
  resultCode: string;
  resultDescription: string;
  resultData: T;
};

/** Present on /transactions and /form only when GoldenApi accepted the test key. */
type TSurveyTestModeFields = {
  testMode?: boolean;
  /** the LINE uid the request acts as in test mode */
  effectiveUid?: string | null;
};

/** The 6 types a v2 answer can rate (`OTHER` is v1 only). */
export const SURVEY_TXN_TYPES = [
  "BUY_GOLD",
  "SELL_GOLD",
  "CHANGE_GOLD",
  "PAWN",
  "PAY_INTEREST",
  "REDEEM",
] as const;

export type TSurveyTxnType = (typeof SURVEY_TXN_TYPES)[number];

export type TSurveyTransaction = {
  txnType: TSurveyTxnType;
  label: string;
  /** POS document number; send it back unchanged */
  docNumb: string;
  /** Bangkok wall-clock time without offset, e.g. "2026-11-08T14:05:00" */
  txnAt: string;
  branchCode: number;
  branchShortName: string;
  /** THB, never negative */
  amount: number;
  /** already has a real (qr/manual) answer: can't be picked */
  surveyed: boolean;
};

export type TSurveyTransactions = TSurveyTestModeFields & {
  isMember: boolean;
  custCode: string | null;
  windowDays: number;
  windowFrom: string;
  windowTo: string;
  items: TSurveyTransaction[];
};

export type TSurveyQuestionKind = "RATING_1_5" | "TEXT";

export type TSurveyQuestion = {
  questionId: number;
  seq: number;
  questionKey: string;
  kind: TSurveyQuestionKind;
  isRequired: boolean;
  textTh: string;
};

export type TSurveyQuestionSet = {
  setId: number;
  version: number;
  title: string;
  questions: TSurveyQuestion[];
};

export type TSurveyForm = TSurveyTestModeFields & {
  questionSet: TSurveyQuestionSet;
};

/** "qr" = the list was opened from a branch QR (?b=), else "manual". */
export type TSurveyEntry = "qr" | "manual";

export type TSurveyAnswer = {
  questionId: number;
  rating?: number;
  text?: string;
};

export type TSurveyResponseReq = {
  setId: number;
  txnType: TSurveyTxnType;
  docNumb: string;
  entry: TSurveyEntry;
  answers: TSurveyAnswer[];
};

export type TSurveyResponseRes = {
  responseId: number;
};
