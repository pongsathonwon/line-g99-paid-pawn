import { beforeEach, describe, expect, it, vi } from "vitest";
import { surveyClient } from "../survey-axios";
import { SURVEY_API } from "./survey";
import {
  mockSurveyForm,
  mockSurveyLinkRes,
  mockSurveyResponseRes,
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

  it("gets the form for the QR branch", async () => {
    vi.mocked(surveyClient.get).mockResolvedValue(envelope(mockSurveyForm));
    await expect(SURVEY_API.getForm("6")).resolves.toEqual(mockSurveyForm);
    expect(surveyClient.get).toHaveBeenCalledWith("form", { params: { b: "6" } });
  });

  it("gets the form without b when the QR had none", async () => {
    vi.mocked(surveyClient.get).mockResolvedValue(envelope(mockSurveyForm));
    await SURVEY_API.getForm(null);
    expect(surveyClient.get).toHaveBeenCalledWith("form", { params: undefined });
  });

  it("posts a response", async () => {
    vi.mocked(surveyClient.post).mockResolvedValue(envelope(mockSurveyResponseRes));
    const req = {
      setId: 1,
      branchCode: 6,
      txnType: "PAWN",
      entry: "qr" as const,
      answers: [{ questionId: 11, rating: 5 }],
    };
    await expect(SURVEY_API.submitResponse(req)).resolves.toEqual(mockSurveyResponseRes);
    expect(surveyClient.post).toHaveBeenCalledWith("responses", req);
  });

  it("posts link", async () => {
    vi.mocked(surveyClient.post).mockResolvedValue(envelope(mockSurveyLinkRes));
    await expect(SURVEY_API.link()).resolves.toEqual(mockSurveyLinkRes);
    expect(surveyClient.post).toHaveBeenCalledWith("link");
  });
});
