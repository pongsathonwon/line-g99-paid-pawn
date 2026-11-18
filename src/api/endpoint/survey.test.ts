import { beforeEach, describe, expect, it, vi } from "vitest";
import { surveyClient } from "../survey-axios";
import { SURVEY_API, type TSurveyResponseReq } from "./survey";
import {
  mockSurveyForm,
  mockSurveyResponseRes,
  mockSurveyTransactions,
} from "@/test/setup/survey-api-mock";

vi.mock("../survey-axios", () => ({
  surveyClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const envelope = <T,>(resultData: T) => ({
  data: { resultCode: "20000", resultDescription: "Success", resultData },
});

describe("SURVEY_API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("gets the transactions with the QR branch", async () => {
    vi.mocked(surveyClient.get).mockResolvedValue(envelope(mockSurveyTransactions));
    await expect(SURVEY_API.getTransactions("6")).resolves.toEqual(mockSurveyTransactions);
    expect(surveyClient.get).toHaveBeenCalledWith("transactions", { params: { b: "6" } });
  });

  it("gets the transactions without b when the QR had none", async () => {
    vi.mocked(surveyClient.get).mockResolvedValue(envelope(mockSurveyTransactions));
    await SURVEY_API.getTransactions(null);
    expect(surveyClient.get).toHaveBeenCalledWith("transactions", { params: undefined });
  });

  it("gets the question set from /form without any query", async () => {
    vi.mocked(surveyClient.get).mockResolvedValue(envelope(mockSurveyForm));
    await expect(SURVEY_API.getForm()).resolves.toEqual(mockSurveyForm);
    expect(surveyClient.get).toHaveBeenCalledWith("form");
  });

  it("posts {setId, txnType, docNumb, entry, answers}", async () => {
    vi.mocked(surveyClient.post).mockResolvedValue(envelope(mockSurveyResponseRes));
    const req: TSurveyResponseReq = {
      setId: 1,
      txnType: "CHANGE_GOLD",
      docNumb: "C060012345",
      entry: "qr",
      answers: [{ questionId: 11, rating: 5 }],
    };
    await expect(SURVEY_API.submitResponse(req)).resolves.toEqual(mockSurveyResponseRes);
    expect(surveyClient.post).toHaveBeenCalledWith("responses", req);
  });

  it("no longer has /link", () => {
    expect(SURVEY_API).not.toHaveProperty("link");
  });
});
