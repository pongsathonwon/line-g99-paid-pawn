import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { liff } from "@line/liff";
import SurveyPage from "./SurveyPage";
import { SURVEY_API } from "@/api/endpoint/survey";
import { SURVEY_TEXT } from "@/component/feature/SurveyForm/survey.locale";
import {
  createHttpError,
  mockNonMemberTransactions,
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

const renderPage = (
  options: Partial<Parameters<typeof renderWithSurveyProviders>[1]> = {},
) =>
  renderWithSurveyProviders(<SurveyPage />, {
    path: "/survey",
    initialEntry: "/survey?b=6",
    ...options,
  });

const cards = () => screen.getAllByTestId("survey-txn-card");
const location = () => screen.getByTestId("location");

describe("SurveyPage (transaction list)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("shows loading while the list is fetched, and asks with the QR branch", async () => {
    vi.mocked(SURVEY_API.getTransactions).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText("กำลังโหลดข้อมูล...")).toBeInTheDocument();
    await waitFor(() => expect(SURVEY_API.getTransactions).toHaveBeenCalledWith("6"));
  });

  it("asks without b when the QR had none or b is not a number", async () => {
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue(mockSurveyTransactions);
    renderPage({ initialEntry: "/survey?b=abc" });
    await waitFor(() => expect(SURVEY_API.getTransactions).toHaveBeenCalledWith(null));
  });

  it.each(["guest", "member"] as const)(
    "lists the transactions for a %s g99-online session (membership is GoldenApi's)",
    async (status) => {
      vi.mocked(SURVEY_API.getTransactions).mockResolvedValue(mockSurveyTransactions);
      renderPage({ session: createMockSession({ status }) });
      expect(await screen.findByRole("heading", { name: t.list.heading })).toBeInTheDocument();
      expect(cards()).toHaveLength(3);
    },
  );

  it("keeps the API's order and shows type, date and time, branch, doc number and amount", async () => {
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue(mockSurveyTransactions);
    renderPage();
    await screen.findByRole("heading", { name: t.list.heading });

    expect(cards().map((c) => c.textContent)).toEqual([
      expect.stringContaining("เปลี่ยนทอง"),
      expect.stringContaining("ต่อดอก"),
      expect.stringContaining("จำนำ"),
    ]);
    const first = within(cards()[0]);
    expect(first.getByText(/14:05/)).toHaveTextContent(/^8 .+ 2569 14:05 · สาขา G006$/);
    expect(first.getByText("เลขที่เอกสาร C060012345")).toBeInTheDocument();
    expect(first.getByText("1,500.00 บาท")).toBeInTheDocument();
    expect(screen.getByText(t.list.hint(30))).toBeInTheDocument();
  });

  it("links an unrated card to its form, keeping ?b", async () => {
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue(mockSurveyTransactions);
    renderPage();
    await screen.findByRole("heading", { name: t.list.heading });

    const link = screen.getByRole("link", { name: new RegExp(mockTxnChange.docNumb) });
    expect(link).toHaveAttribute("href", "/survey/t/CHANGE_GOLD/C060012345?b=6");
    fireEvent.click(link);
    expect(location()).toHaveTextContent("/survey/t/CHANGE_GOLD/C060012345?b=6");
  });

  it("shows a rated card with ประเมินแล้ว and no link", async () => {
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue(mockSurveyTransactions);
    renderPage();
    await screen.findByRole("heading", { name: t.list.heading });

    const rated = cards()[1];
    expect(rated).toHaveTextContent(mockTxnRated.docNumb);
    expect(within(rated).getByText(t.list.surveyed)).toBeInTheDocument();
    expect(rated).toHaveAttribute("aria-disabled", "true");
    expect(rated.tagName).not.toBe("A");
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getAllByText(t.list.surveyed)).toHaveLength(1);
  });

  it("shows the empty state when there is nothing in the last 30 days", async () => {
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue({
      ...mockSurveyTransactions,
      items: [],
    });
    renderPage();
    expect(await screen.findByText("ไม่พบรายการในช่วง 30 วันที่ผ่านมา")).toBeInTheDocument();
    expect(screen.queryByTestId("survey-txn-card")).not.toBeInTheDocument();
  });

  it.each([
    ["/survey?b=6", "/register?redirect=%2Fsurvey%3Fb%3D6"],
    ["/survey", "/register?redirect=%2Fsurvey"],
  ])("sends a non-member on %s to register, coming back to the list", async (entry, target) => {
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue(mockNonMemberTransactions);
    renderPage({ initialEntry: entry, session: createMockSession({ status: "guest" }) });
    await waitFor(() => expect(location()).toHaveTextContent(target));
  });

  it("does not loop to register when g99-online already says member; retry instead", async () => {
    vi.mocked(SURVEY_API.getTransactions)
      .mockResolvedValueOnce(mockNonMemberTransactions)
      .mockResolvedValueOnce(mockSurveyTransactions);
    renderPage({ session: createMockSession({ status: "member" }) });

    expect(await screen.findByText(t.errors.notMember)).toBeInTheDocument();
    expect(screen.queryByTestId("location")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: t.retry }));
    expect(await screen.findByRole("heading", { name: t.list.heading })).toBeInTheDocument();
  });

  it("shows the retry screen on 503 50003 (Simatic down) without retrying by itself", async () => {
    vi.mocked(SURVEY_API.getTransactions)
      .mockRejectedValueOnce(createHttpError(503, "50003"))
      .mockResolvedValueOnce(mockSurveyTransactions);
    renderPage();

    expect(await screen.findByText(t.errors.memberServiceDown)).toBeInTheDocument();
    expect(screen.getByText(t.errors.memberServiceDownHint)).toBeInTheDocument();
    expect(SURVEY_API.getTransactions).toHaveBeenCalledTimes(1);
    expect(liff.login).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: t.retry }));
    expect(await screen.findByRole("heading", { name: t.list.heading })).toBeInTheDocument();
  });

  it("shows a generic retry for other errors", async () => {
    vi.mocked(SURVEY_API.getTransactions).mockRejectedValue(createHttpError(500, "50001"));
    renderPage();
    expect(await screen.findByText(t.errors.loadList)).toBeInTheDocument();
    expect(screen.queryByText(t.errors.memberServiceDown)).not.toBeInTheDocument();
  });

  it("offers a LINE login again on 401", async () => {
    vi.mocked(SURVEY_API.getTransactions).mockRejectedValue(createHttpError(401));
    const { session } = renderPage();
    fireEvent.click(await screen.findByRole("button", { name: t.relogin }));
    expect(session.login).toHaveBeenCalled();
  });
});
