import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { liff } from "@line/liff";
import SurveyPage from "./SurveyPage";
import { SURVEY_API } from "@/api/endpoint/survey";
import { SURVEY_TEXT } from "@/component/feature/SurveyForm/survey.locale";
import {
  createHttpError,
  mockSurveyForm,
} from "@/test/setup/survey-api-mock";
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
  renderWithSurveyProviders(<SurveyPage />, {
    path: "/survey",
    initialEntry: "/survey?b=6",
    ...options,
  });

const fillAndSubmit = async () => {
  await screen.findByRole("radiogroup", { name: SURVEY_TEXT.txnTypeLabel });
  fireEvent.click(screen.getByRole("radio", { name: "ต่อดอก" }));
  mockSurveyForm.questionSet.questions
    .filter((q) => q.kind === "RATING_1_5")
    .forEach((q) =>
      fireEvent.click(screen.getAllByRole("radio", { name: "5 ดาว" })[q.seq - 1]),
    );
  fireEvent.click(screen.getByRole("button", { name: SURVEY_TEXT.submit }));
};

describe("SurveyPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each(["guest", "member"] as const)(
    "works for a %s session (the survey needs LINE only)",
    async (status) => {
      vi.mocked(SURVEY_API.getForm).mockResolvedValue(mockSurveyForm);
      renderPage({ session: createMockSession({ status }) });
      expect(
        await screen.findByRole("heading", { name: "แบบประเมินหลังใช้บริการ" }),
      ).toBeInTheDocument();
    },
  );

  it("shows loading while the form is fetched", async () => {
    vi.mocked(SURVEY_API.getForm).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText("กำลังโหลดข้อมูล...")).toBeInTheDocument();
    await waitFor(() => expect(SURVEY_API.getForm).toHaveBeenCalledWith("6"));
  });

  it("asks for the form without a branch when the QR had no b", async () => {
    vi.mocked(SURVEY_API.getForm).mockResolvedValue({
      ...mockSurveyForm,
      presetBranchCode: null,
    });
    renderPage({ initialEntry: "/survey" });
    await waitFor(() => expect(SURVEY_API.getForm).toHaveBeenCalledWith(null));
    expect(await screen.findByLabelText(/สาขาที่ใช้บริการ/)).toHaveValue("");
  });

  it("shows the form once loaded", async () => {
    vi.mocked(SURVEY_API.getForm).mockResolvedValue(mockSurveyForm);
    renderPage();
    expect(
      await screen.findByRole("heading", { name: "แบบประเมินหลังใช้บริการ" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/สาขาที่ใช้บริการ/)).toHaveValue("6");
  });

  it("falls back to the default title when the set has none", async () => {
    vi.mocked(SURVEY_API.getForm).mockResolvedValue({
      ...mockSurveyForm,
      questionSet: { ...mockSurveyForm.questionSet, title: "" },
    });
    renderPage();
    expect(
      await screen.findByRole("heading", { name: SURVEY_TEXT.title }),
    ).toBeInTheDocument();
  });

  it("shows the invalid-token state on 401 and offers a LINE login", async () => {
    vi.mocked(SURVEY_API.getForm).mockRejectedValue(createHttpError(401));
    const { session } = renderPage();
    expect(await screen.findByText(SURVEY_TEXT.errors.unauthorized)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: SURVEY_TEXT.relogin }));
    // the button goes through the session's login, not liff directly
    expect(session.login).toHaveBeenCalledOnce();
    expect(liff.login).not.toHaveBeenCalled();
  });

  it("shows a load error with retry on other failures", async () => {
    vi.mocked(SURVEY_API.getForm)
      .mockRejectedValueOnce(createHttpError(500))
      .mockResolvedValueOnce(mockSurveyForm);
    renderPage();
    expect(await screen.findByText(SURVEY_TEXT.errors.loadForm)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: SURVEY_TEXT.retry }));
    expect(
      await screen.findByRole("heading", { name: "แบบประเมินหลังใช้บริการ" }),
    ).toBeInTheDocument();
  });

  it("thanks a member without offering to link", async () => {
    vi.mocked(SURVEY_API.getForm).mockResolvedValue(mockSurveyForm);
    vi.mocked(SURVEY_API.submitResponse).mockResolvedValue({
      responseId: 1,
      isMember: true,
    });
    renderPage();
    await fillAndSubmit();

    expect(await screen.findByText(SURVEY_TEXT.thankYou.title)).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: SURVEY_TEXT.thankYou.linkAccount }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: SURVEY_TEXT.home })).toHaveAttribute(
      "href",
      "/home",
    );
    expect(vi.mocked(SURVEY_API.submitResponse).mock.calls[0][0]).toMatchObject({
      setId: 1,
      branchCode: 6,
      txnType: "PAY_INTEREST",
      entry: "qr",
    });
  });

  it("thanks a non-member and links to register with redirect to /survey/linked", async () => {
    vi.mocked(SURVEY_API.getForm).mockResolvedValue(mockSurveyForm);
    vi.mocked(SURVEY_API.submitResponse).mockResolvedValue({
      responseId: 2,
      isMember: false,
    });
    renderPage();
    await fillAndSubmit();

    expect(await screen.findByText(SURVEY_TEXT.thankYou.title)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: SURVEY_TEXT.thankYou.linkAccount });
    expect(link).toHaveAttribute("href", "/register?redirect=%2Fsurvey%2Flinked");
    fireEvent.click(link);
    expect(screen.getByTestId("location")).toHaveTextContent(
      "/register?redirect=%2Fsurvey%2Flinked",
    );
  });

  it("reloads the form when the question set was replaced (409)", async () => {
    vi.mocked(SURVEY_API.getForm).mockResolvedValue(mockSurveyForm);
    vi.mocked(SURVEY_API.submitResponse).mockRejectedValue(createHttpError(409));
    const { toast } = renderPage();
    await fillAndSubmit();

    await waitFor(() =>
      expect(toast.warning).toHaveBeenCalledWith(SURVEY_TEXT.errors.setChanged),
    );
    await waitFor(() => expect(SURVEY_API.getForm).toHaveBeenCalledTimes(2));
    expect(screen.queryByText(SURVEY_TEXT.thankYou.title)).not.toBeInTheDocument();
  });

  it.each([
    [401, SURVEY_TEXT.errors.unauthorized],
    [400, SURVEY_TEXT.errors.submit],
  ])("shows a toast when submit fails with %s", async (status, message) => {
    vi.mocked(SURVEY_API.getForm).mockResolvedValue(mockSurveyForm);
    vi.mocked(SURVEY_API.submitResponse).mockRejectedValue(createHttpError(status));
    const { toast } = renderPage();
    await fillAndSubmit();

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(message));
    expect(screen.queryByText(SURVEY_TEXT.thankYou.title)).not.toBeInTheDocument();
  });
});
