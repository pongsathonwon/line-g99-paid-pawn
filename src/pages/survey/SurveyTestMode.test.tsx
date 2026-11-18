import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { liff } from "@line/liff";
import SurveyPage from "./SurveyPage";
import SurveyTxnPage from "./SurveyTxnPage";
import { SURVEY_API } from "@/api/endpoint/survey";
import { SURVEY_TEXT } from "@/component/feature/SurveyForm/survey.locale";
import { getSurveyTestMode } from "@/lib/survey-test-mode";
import {
  TEST_UID,
  createTestKeyRefusedError,
  mockNonMemberTransactions,
  mockSurveyForm,
  mockSurveyTransactions,
  mockTestTransactions,
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
const TEST_URL = `/survey?b=6&test=k3y&uid=${TEST_UID}`;
const banner = () => screen.queryByTestId("survey-test-banner");

const renderSurvey = (initialEntry = TEST_URL, status: "guest" | "member" = "guest") =>
  renderWithSurveyProviders(<SurveyPage />, {
    path: "/survey",
    initialEntry,
    session: createMockSession({ status }),
    routes: [{ path: "/survey/t/:txnType/:docNumb", element: <SurveyTxnPage /> }],
  });

describe("survey test mode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    vi.mocked(SURVEY_API.getForm).mockResolvedValue({
      ...mockSurveyForm,
      testMode: true,
      effectiveUid: TEST_UID,
    });
  });

  it("keeps ?test and ?uid in sessionStorage when the list loads", () => {
    vi.mocked(SURVEY_API.getTransactions).mockReturnValue(new Promise(() => {}));
    renderSurvey();
    expect(getSurveyTestMode()).toEqual({ test: "k3y", uid: TEST_UID });
  });

  it("clears test mode when the page loads with an empty ?test=", () => {
    sessionStorage.setItem("G99_SURVEY_TEST", JSON.stringify({ test: "k3y", uid: TEST_UID }));
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue(mockSurveyTransactions);
    renderSurvey("/survey?b=6&test=");
    expect(getSurveyTestMode()).toBeNull();
  });

  it("shows the test uid's list with the banner (last 6 chars of effectiveUid)", async () => {
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue(mockTestTransactions);
    renderSurvey();
    expect(await screen.findByRole("heading", { name: t.list.heading })).toBeInTheDocument();
    expect(banner()).toHaveTextContent("โหมดทดสอบ · uid …74409e");
    expect(banner()).toHaveClass("fixed");
  });

  it("shows no banner outside test mode", async () => {
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue(mockSurveyTransactions);
    renderSurvey("/survey?b=6");
    await screen.findByRole("heading", { name: t.list.heading });
    expect(banner()).not.toBeInTheDocument();
  });

  it("carries test mode from the list to the form and submits entry qr (server records test)", async () => {
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue(mockTestTransactions);
    vi.mocked(SURVEY_API.submitResponse).mockResolvedValue({ responseId: 9 });
    renderSurvey();

    fireEvent.click(await screen.findByRole("link", { name: /C060012345/ }));
    await screen.findByRole("button", { name: t.submit });
    expect(banner()).toHaveTextContent("โหมดทดสอบ · uid …74409e");
    // the form reused the list from the cache: same test key and uid
    expect(SURVEY_API.getTransactions).toHaveBeenCalledTimes(1);
    expect(getSurveyTestMode()).toEqual({ test: "k3y", uid: TEST_UID });

    screen.getAllByRole("radio", { name: "4 ดาว" }).forEach((star) => fireEvent.click(star));
    fireEvent.click(screen.getByRole("button", { name: t.submit }));
    expect(await screen.findByText(t.thankYou.title)).toBeInTheDocument();
    expect(vi.mocked(SURVEY_API.submitResponse).mock.calls[0][0].entry).toBe("qr");
    expect(banner()).toBeInTheDocument();
  });

  it("works on a deep link to the form with ?test&uid", async () => {
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue(mockTestTransactions);
    renderWithSurveyProviders(<SurveyTxnPage />, {
      path: "/survey/t/:txnType/:docNumb",
      initialEntry: `/survey/t/CHANGE_GOLD/C060012345?test=k3y&uid=${TEST_UID}`,
    });
    expect(await screen.findByRole("heading", { name: t.form.heading })).toBeInTheDocument();
    expect(getSurveyTestMode()).toEqual({ test: "k3y", uid: TEST_UID });
    expect(banner()).toBeInTheDocument();
  });

  it("shows 'uid นี้ยังไม่เป็นสมาชิก' for a non-member test uid instead of going to register", async () => {
    vi.mocked(SURVEY_API.getTransactions)
      .mockResolvedValueOnce({ ...mockNonMemberTransactions, testMode: true, effectiveUid: TEST_UID })
      .mockResolvedValueOnce(mockSurveyTransactions);
    renderSurvey();

    expect(await screen.findByText("uid นี้ยังไม่เป็นสมาชิก")).toBeInTheDocument();
    expect(screen.queryByTestId("location")).not.toBeInTheDocument();
    expect(banner()).toBeInTheDocument();

    // leaving test mode asks again for the tester's own LINE uid
    fireEvent.click(screen.getByRole("button", { name: t.testMode.exit }));
    expect(await screen.findByRole("heading", { name: t.list.heading })).toBeInTheDocument();
    expect(getSurveyTestMode()).toBeNull();
    expect(banner()).not.toBeInTheDocument();
  });

  it.each(["invalid test key", "test mode disabled"])(
    "shows the refused-key screen on 403 40101 (%s) without a LINE login",
    async (message) => {
      vi.mocked(SURVEY_API.getTransactions)
        .mockRejectedValueOnce(createTestKeyRefusedError(message))
        .mockResolvedValueOnce(mockSurveyTransactions);
      renderSurvey();

      expect(await screen.findByText(t.testMode.refusedTitle)).toBeInTheDocument();
      expect(liff.login).not.toHaveBeenCalled();
      expect(screen.queryByText(t.errors.loadList)).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: t.testMode.exit }));
      await screen.findByRole("heading", { name: t.list.heading });
      expect(getSurveyTestMode()).toBeNull();
      await waitFor(() => expect(banner()).not.toBeInTheDocument());
    },
  );

  it("shows the refused-key screen when /form refuses the key", async () => {
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue(mockTestTransactions);
    vi.mocked(SURVEY_API.getForm).mockRejectedValueOnce(createTestKeyRefusedError());
    renderWithSurveyProviders(<SurveyTxnPage />, {
      path: "/survey/t/:txnType/:docNumb",
      initialEntry: `/survey/t/CHANGE_GOLD/C060012345?b=6&test=k3y&uid=${TEST_UID}`,
    });
    expect(await screen.findByText(t.testMode.refusedTitle)).toBeInTheDocument();
  });
});
