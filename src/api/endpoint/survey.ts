import { surveyClient } from "../survey-axios";

// GoldenApi /api/survey/v1, customer side (design §5.1, docs/SURVEY_API.md)

export const getSurveyForm = async (branchCode?: string | null) => {
  const { data } = await surveyClient.get<TSurveyEnvelope<TSurveyForm>>(
    "form",
    { params: branchCode ? { b: branchCode } : undefined },
  );
  return data.resultData;
};

export const submitSurveyResponse = async (req: TSurveyResponseReq) => {
  const { data } = await surveyClient.post<
    TSurveyEnvelope<TSurveyResponseRes>
  >("responses", req);
  return data.resultData;
};

export const linkSurveyResponses = async () => {
  const { data } = await surveyClient.post<TSurveyEnvelope<TSurveyLinkRes>>(
    "link",
  );
  return data.resultData;
};

export const SURVEY_API = {
  getForm: getSurveyForm,
  submitResponse: submitSurveyResponse,
  link: linkSurveyResponses,
};

export type TSurveyEnvelope<T> = {
  resultCode: string;
  resultDescription: string;
  resultData: T;
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

export type TSurveyTxnType = {
  code: string;
  label: string;
};

export type TSurveyBranch = {
  branchCode: number;
  branchShortName: string;
  branchName: string;
};

export type TSurveyMember = {
  isMember: boolean;
  custCode: string | null;
};

export type TSurveyForm = {
  questionSet: TSurveyQuestionSet;
  txnTypes: TSurveyTxnType[];
  branches: TSurveyBranch[];
  presetBranchCode: number | null;
  member: TSurveyMember;
};

export type TSurveyEntry = "qr" | "manual";

export type TSurveyAnswer = {
  questionId: number;
  rating?: number;
  text?: string;
};

export type TSurveyResponseReq = {
  setId: number;
  branchCode: number;
  txnType: string;
  entry: TSurveyEntry;
  answers: TSurveyAnswer[];
};

export type TSurveyResponseRes = {
  responseId: number;
  isMember: boolean;
};

export type TSurveyLinkRes = {
  linked: number;
  isMember: boolean;
};
