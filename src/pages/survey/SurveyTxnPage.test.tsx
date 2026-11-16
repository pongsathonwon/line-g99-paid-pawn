import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import SurveyTxnPage from "./SurveyTxnPage";
import SurveyPage from "./SurveyPage";
import { SURVEY_API } from "@/api/endpoint/survey";
import { SURVEY_TEXT } from "@/component/feature/SurveyForm/survey.locale";
import {
  createHttpError,
  createTestKeyRefusedError,
  mockNonMemberTransactions,
  mockSurveyForm,
  mockSurveyTransactions,
  mockTxnChange,
  mockTxnRated,
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

const t = SURVEY_TEXT;
const CHANGE_URL = "/survey/t/CHANGE_GOLD/C060012345?b=6";

const renderPage = (
  initialEntry = CHANGE_URL,
  options: Partial<Parameters<typeof renderWithSurveyProviders>[1]> = {},
) =>
  renderWithSurveyProviders(<SurveyTxnPage />, {
    path: "/survey/t/:txnType/:docNumb",
    initialEntry,
    routes: [{ path: "/survey", element: <SurveyPage /> }],
    ...options,
  });

const submitButton = () => screen.getByRole("button", { name: t.submit });

const fillAndSubmit = async (stars = 5) => {
  await screen.findByRole("button", { name: t.submit });
  screen
    .getAllByRole("radio", { name: `${stars} ดาว` })
    .forEach((star) => fireEvent.click(star));
  fireEvent.click(submitButton());
};

describe("SurveyTxnPage (rate one transaction)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue(mockSurveyTransactions);
    vi.mocked(SURVEY_API.getForm).mockResolvedValue(mockSurveyForm);
  });

  it("looks the item up from /transactions (works after a refresh) and shows it read-only", async () => {
    renderPage();
    expect(await screen.findByRole("heading", { name: t.form.heading })).toBeInTheDocument();
    expect(SURVEY_API.getTransactions).toHaveBeenCalledWith("6");

    const summary = screen.getByTestId("survey-txn-card");
    expect(summary).toHaveTextContent("เปลี่ยนทอง");
    expect(summary).toHaveTextContent("C060012345");
    expect(summary).toHaveTextContent("1,500.00 บาท");
    expect(summary.tagName).not.toBe("A");
    // no branch or type pickers in v2
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(await screen.findAllByRole("radiogroup")).toHaveLength(5);
  });

  it("keeps submit disabled until all 5 ratings are set (no 0)", async () => {
    renderPage();
    await screen.findByRole("button", { name: t.submit });
    expect(submitButton()).toBeDisabled();
    screen.getAllByRole("radio", { name: "3 ดาว" }).slice(0, 4).forEach((s) => fireEvent.click(s));
    expect(submitButton()).toBeDisabled();
  });

  it("submits {setId, txnType, docNumb, entry qr, answers}, then thanks and goes back to the list", async () => {
    vi.mocked(SURVEY_API.submitResponse).mockResolvedValue({ responseId: 7 });
    renderPage();
    await screen.findByRole("button", { name: t.submit });
    // what GoldenApi lists once the answer is saved
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue({
      ...mockSurveyTransactions,
      items: [{ ...mockTxnChange, surveyed: true }, mockTxnRated],
    });
    await fillAndSubmit(4);

    expect(await screen.findByText(t.thankYou.title)).toBeInTheDocument();
    expect(vi.mocked(SURVEY_API.submitResponse).mock.calls[0][0]).toEqual({
      setId: 1,
      txnType: "CHANGE_GOLD",
      docNumb: "C060012345",
      entry: "qr",
      answers: [11, 12, 13, 14, 15].map((questionId) => ({ questionId, rating: 4 })),
    });

    // the list was reloaded, so the item now shows as rated
    fireEvent.click(screen.getByRole("link", { name: t.thankYou.another }));
    expect(await screen.findByRole("heading", { name: t.list.heading })).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByText(t.list.surveyed)).toHaveLength(2));
  });

  it("sends entry manual when the list was opened without ?b", async () => {
    vi.mocked(SURVEY_API.submitResponse).mockResolvedValue({ responseId: 8 });
    renderPage("/survey/t/CHANGE_GOLD/C060012345");
    await fillAndSubmit();
    await screen.findByText(t.thankYou.title);
    expect(vi.mocked(SURVEY_API.submitResponse).mock.calls[0][0].entry).toBe("manual");
    expect(SURVEY_API.getTransactions).toHaveBeenCalledWith(null);
  });

  it("on 409 40901 says ประเมินรายการนี้แล้ว and goes back to the list", async () => {
    vi.mocked(SURVEY_API.submitResponse).mockRejectedValue(createHttpError(409, "40901"));
    const { toast } = renderPage();
    await fillAndSubmit();

    await waitFor(() => expect(toast.warning).toHaveBeenCalledWith("ประเมินรายการนี้แล้ว"));
    expect(await screen.findByRole("heading", { name: t.list.heading })).toBeInTheDocument();
    // the list is asked again, not taken from the cache
    expect(SURVEY_API.getTransactions).toHaveBeenCalledTimes(2);
  });

  it("on 409 40900 (question set replaced) reloads the form and stays", async () => {
    vi.mocked(SURVEY_API.submitResponse).mockRejectedValue(createHttpError(409, "40900"));
    const { toast } = renderPage();
    await fillAndSubmit();

    await waitFor(() => expect(toast.warning).toHaveBeenCalledWith(t.errors.setChanged));
    await waitFor(() => expect(SURVEY_API.getForm).toHaveBeenCalledTimes(2));
    expect(screen.getByRole("heading", { name: t.form.heading })).toBeInTheDocument();
  });

  it.each([
    ["40401", 404, t.errors.txnNotFound, t.errors.txnNotFoundHint],
    ["42201", 422, t.errors.txnNotEligible, t.errors.txnNotEligibleHint],
  ])("on %s explains why and links back to the list", async (code, status, title, hint) => {
    vi.mocked(SURVEY_API.submitResponse).mockRejectedValue(createHttpError(status, code));
    renderPage();
    await fillAndSubmit();

    expect(await screen.findByText(title)).toBeInTheDocument();
    expect(screen.getByText(hint)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: t.backToList })).toHaveAttribute("href", "/survey?b=6");
  });

  it("on 403 40301 (no longer a member) goes back to the list, which sends them to register", async () => {
    vi.mocked(SURVEY_API.submitResponse).mockRejectedValue(createHttpError(403, "40301"));
    renderPage(CHANGE_URL, { session: createMockSession({ status: "guest" }) });
    await fillAndSubmit();
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue(mockNonMemberTransactions);

    await waitFor(() =>
      expect(screen.getByTestId("location")).toHaveTextContent("/register?redirect=%2Fsurvey%3Fb%3D6"),
    );
  });

  it.each([
    [createHttpError(503, "50003"), `${t.errors.memberServiceDown} ${t.errors.memberServiceDownHint}`],
    [createHttpError(401), t.errors.unauthorized],
    [createHttpError(400, "40000"), t.errors.submit],
    [createTestKeyRefusedError(), t.testMode.refusedTitle],
  ])("keeps the answers and shows a toast on other errors (%#)", async (error, message) => {
    vi.mocked(SURVEY_API.submitResponse).mockRejectedValue(error);
    const { toast } = renderPage();
    await fillAndSubmit();
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(message));
    expect(submitButton()).toBeEnabled();
  });

  it("shows ประเมินแล้ว for a deep link to a rated item, without the form", async () => {
    renderPage("/survey/t/PAY_INTEREST/R060054321");
    expect(await screen.findByText(t.errors.alreadySurveyed)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: t.submit })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: t.backToList })).toHaveAttribute("href", "/survey");
  });

  it("says not found for an item that is not in the member's list", async () => {
    renderPage("/survey/t/PAWN/C060012345?b=6");
    expect(await screen.findByText(t.errors.txnNotFound)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: t.submit })).not.toBeInTheDocument();
  });

  it("sends a non-member to register like the list does", async () => {
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue(mockNonMemberTransactions);
    renderPage(CHANGE_URL, { session: createMockSession({ status: "guest" }) });
    await waitFor(() =>
      expect(screen.getByTestId("location")).toHaveTextContent("/register?redirect=%2Fsurvey%3Fb%3D6"),
    );
  });

  it("shows the retry screen when Simatic is down", async () => {
    vi.mocked(SURVEY_API.getTransactions).mockRejectedValue(createHttpError(503, "50003"));
    renderPage();
    expect(await screen.findByText(t.errors.memberServiceDown)).toBeInTheDocument();
  });

  it("shows a retry when the question set fails to load", async () => {
    vi.mocked(SURVEY_API.getForm)
      .mockRejectedValueOnce(createHttpError(404, "40400"))
      .mockResolvedValueOnce(mockSurveyForm);
    renderPage();
    expect(await screen.findByText(t.errors.loadForm)).toBeInTheDocument();
    // the transaction stays visible above the error
    expect(screen.getByTestId("survey-txn-card")).toHaveTextContent("C060012345");
    fireEvent.click(screen.getByRole("button", { name: t.retry }));
    expect(await screen.findByRole("button", { name: t.submit })).toBeInTheDocument();
  });
});
