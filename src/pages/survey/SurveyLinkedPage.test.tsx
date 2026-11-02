import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { liff } from "@line/liff";
import SurveyLinkedPage from "./SurveyLinkedPage";
import { SURVEY_API } from "@/api/endpoint/survey";
import { SURVEY_TEXT } from "@/component/feature/SurveyForm/survey.locale";
import { createHttpError } from "@/test/setup/survey-api-mock";
import {
  createMockAuth,
  renderWithSurveyProviders,
} from "@/test/setup/survey-wrapper";

vi.mock("@/api/endpoint/survey", async () => {
  const { createSurveyApiMock } = await import("@/test/setup/survey-api-mock");
  return { SURVEY_API: createSurveyApiMock().SURVEY_API };
});

vi.mock("@line/liff", () => ({
  liff: { login: vi.fn(), getIDToken: vi.fn() },
}));

const renderPage = (
  options: Partial<Parameters<typeof renderWithSurveyProviders>[1]> = {},
) =>
  renderWithSurveyProviders(<SurveyLinkedPage />, {
    path: "/survey/linked",
    initialEntry: "/survey/linked",
    ...options,
  });

describe("SurveyLinkedPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("waits for LIFF before calling /link", () => {
    renderPage({ lineCtx: null });
    expect(screen.getByText("กำลังโหลดข้อมูล...")).toBeInTheDocument();
    expect(SURVEY_API.link).not.toHaveBeenCalled();
  });

  it("confirms the link, counts linked answers and refreshes the login", async () => {
    vi.mocked(SURVEY_API.link).mockResolvedValue({ linked: 2, isMember: true });
    const auth = createMockAuth();
    renderPage({ auth });

    expect(await screen.findByText(SURVEY_TEXT.linked.title)).toBeInTheDocument();
    expect(screen.getByText(SURVEY_TEXT.linked.linkedResponses(2))).toBeInTheDocument();
    expect(SURVEY_API.link).toHaveBeenCalledOnce();
    expect(auth.relogin).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: SURVEY_TEXT.home })).toHaveAttribute(
      "href",
      "/home",
    );
  });

  it("still confirms when nothing was left to link or the login refresh fails", async () => {
    vi.mocked(SURVEY_API.link).mockResolvedValue({ linked: 0, isMember: true });
    const auth = createMockAuth({
      relogin: vi.fn().mockRejectedValue(new Error("login failed")),
    });
    renderPage({ auth });

    expect(await screen.findByText(SURVEY_TEXT.linked.title)).toBeInTheDocument();
    expect(screen.queryByText(/ถูกเชื่อมกับบัญชีสมาชิกแล้ว/)).not.toBeInTheDocument();
  });

  it("asks to retry when the member is not found yet", async () => {
    vi.mocked(SURVEY_API.link)
      .mockResolvedValueOnce({ linked: 0, isMember: false })
      .mockResolvedValueOnce({ linked: 1, isMember: true });
    const auth = createMockAuth();
    renderPage({ auth });

    expect(await screen.findByText(SURVEY_TEXT.linked.notFoundTitle)).toBeInTheDocument();
    expect(auth.relogin).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: SURVEY_TEXT.retry }));
    expect(await screen.findByText(SURVEY_TEXT.linked.title)).toBeInTheDocument();
  });

  it("shows the invalid-token state on 401", async () => {
    vi.mocked(SURVEY_API.link).mockRejectedValue(createHttpError(401));
    renderPage();
    expect(await screen.findByText(SURVEY_TEXT.errors.unauthorized)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: SURVEY_TEXT.relogin }));
    expect(liff.login).toHaveBeenCalled();
  });

  it("shows an error with retry on other failures", async () => {
    vi.mocked(SURVEY_API.link)
      .mockRejectedValueOnce(createHttpError(500))
      .mockResolvedValueOnce({ linked: 1, isMember: true });
    renderPage();
    expect(await screen.findByText(SURVEY_TEXT.linked.error)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: SURVEY_TEXT.retry }));
    await waitFor(() => expect(SURVEY_API.link).toHaveBeenCalledTimes(2));
    expect(await screen.findByText(SURVEY_TEXT.linked.title)).toBeInTheDocument();
  });
});
