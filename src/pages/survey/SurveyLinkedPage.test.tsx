import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { liff } from "@line/liff";
import SurveyLinkedPage from "./SurveyLinkedPage";
import { SURVEY_API } from "@/api/endpoint/survey";
import { SURVEY_TEXT } from "@/component/feature/SurveyForm/survey.locale";
import { createHttpError } from "@/test/setup/survey-api-mock";
import { renderWithSurveyProviders } from "@/test/setup/survey-wrapper";
import { createMockSession } from "@/test/setup/session-mock";

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

  it("shows loading while /link runs", () => {
    vi.mocked(SURVEY_API.link).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText("กำลังโหลดข้อมูล...")).toBeInTheDocument();
    expect(SURVEY_API.link).toHaveBeenCalledOnce();
  });

  it("confirms the link and counts linked answers, without its own relogin", async () => {
    vi.mocked(SURVEY_API.link).mockResolvedValue({ linked: 2, isMember: true });
    // right after registering the session still says guest
    const session = createMockSession({ status: "guest" });
    renderPage({ session });

    expect(await screen.findByText(SURVEY_TEXT.linked.title)).toBeInTheDocument();
    expect(screen.getByText(SURVEY_TEXT.linked.linkedResponses(2))).toBeInTheDocument();
    expect(SURVEY_API.link).toHaveBeenCalledOnce();
    expect(session.refresh).not.toHaveBeenCalled();
  });

  it("refreshes the session before going home", async () => {
    vi.mocked(SURVEY_API.link).mockResolvedValue({ linked: 0, isMember: true });
    const calls: string[] = [];
    const session = createMockSession({
      status: "guest",
      refresh: vi.fn(async () => {
        calls.push("refresh");
        return "member" as const;
      }),
    });
    renderPage({ session });

    fireEvent.click(await screen.findByRole("button", { name: SURVEY_TEXT.home }));
    await waitFor(() =>
      expect(screen.getByTestId("location")).toHaveTextContent("/home"),
    );
    expect(calls).toEqual(["refresh"]);
    expect(screen.queryByText(/ถูกเชื่อมกับบัญชีสมาชิกแล้ว/)).not.toBeInTheDocument();
  });

  it("disables the home button while the session refreshes", async () => {
    vi.mocked(SURVEY_API.link).mockResolvedValue({ linked: 1, isMember: true });
    renderPage({ session: createMockSession({ isRefreshing: true }) });
    expect(await screen.findByRole("button", { name: SURVEY_TEXT.home })).toBeDisabled();
  });

  it("asks to retry when the member is not found yet", async () => {
    vi.mocked(SURVEY_API.link)
      .mockResolvedValueOnce({ linked: 0, isMember: false })
      .mockResolvedValueOnce({ linked: 1, isMember: true });
    renderPage({ session: createMockSession({ status: "guest" }) });

    expect(await screen.findByText(SURVEY_TEXT.linked.notFoundTitle)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: SURVEY_TEXT.retry }));
    expect(await screen.findByText(SURVEY_TEXT.linked.title)).toBeInTheDocument();
  });

  it("shows the invalid-token state on 401 and logs in through the session", async () => {
    vi.mocked(SURVEY_API.link).mockRejectedValue(createHttpError(401));
    const { session } = renderPage();
    expect(await screen.findByText(SURVEY_TEXT.errors.unauthorized)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: SURVEY_TEXT.relogin }));
    expect(session.login).toHaveBeenCalledOnce();
    expect(liff.login).not.toHaveBeenCalled();
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
