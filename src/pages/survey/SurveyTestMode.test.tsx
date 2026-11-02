import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { Link } from "react-router-dom";
import { liff } from "@line/liff";
import SurveyPage from "./SurveyPage";
import SurveyLinkedPage from "./SurveyLinkedPage";
import { SURVEY_API } from "@/api/endpoint/survey";
import { SURVEY_TEXT } from "@/component/feature/SurveyForm/survey.locale";
import { getSurveyTestMode } from "@/lib/survey-test-mode";
import {
  createTestKeyRefusedError,
  mockSurveyForm,
  mockSurveyTestForm,
} from "@/test/setup/survey-api-mock";
import { renderWithSurveyProviders } from "@/test/setup/survey-wrapper";

vi.mock("@/api/endpoint/survey", async () => {
  const { createSurveyApiMock } = await import("@/test/setup/survey-api-mock");
  return { SURVEY_API: createSurveyApiMock().SURVEY_API };
});

vi.mock("@line/liff", () => ({
  liff: { login: vi.fn(), getIDToken: vi.fn() },
}));

const TEST_UID = "U0bf26f4085b0a41af588f6cb1774409e";
const TEST_URL = `/survey?b=6&test=k3y&uid=${TEST_UID}`;
const banner = () => screen.queryByTestId("survey-test-banner");

const renderSurvey = (initialEntry = TEST_URL) =>
  renderWithSurveyProviders(<SurveyPage />, {
    path: "/survey",
    initialEntry,
    routes: [
      // stand-in for the register flow: SuccessStep goes on to ?redirect
      {
        path: "/register",
        element: <Link to="/survey/linked">ลงทะเบียนสำเร็จ</Link>,
      },
      { path: "/survey/linked", element: <SurveyLinkedPage /> },
    ],
  });

const fillAndSubmit = async () => {
  await screen.findByRole("radiogroup", { name: SURVEY_TEXT.txnTypeLabel });
  fireEvent.click(screen.getByRole("radio", { name: "จำนำ" }));
  screen
    .getAllByRole("radio", { name: "4 ดาว" })
    .forEach((star) => fireEvent.click(star));
  fireEvent.click(screen.getByRole("button", { name: SURVEY_TEXT.submit }));
};

describe("survey test mode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("keeps ?test and ?uid in sessionStorage when the page loads", () => {
    vi.mocked(SURVEY_API.getForm).mockReturnValue(new Promise(() => {}));
    renderSurvey();
    expect(getSurveyTestMode()).toEqual({ test: "k3y", uid: TEST_UID });
  });

  it("clears test mode when the page loads with an empty ?test=", () => {
    sessionStorage.setItem(
      "G99_SURVEY_TEST",
      JSON.stringify({ test: "k3y", uid: TEST_UID }),
    );
    vi.mocked(SURVEY_API.getForm).mockResolvedValue(mockSurveyForm);
    renderSurvey("/survey?b=6&test=");
    expect(getSurveyTestMode()).toBeNull();
  });

  it("shows the test banner with the last 6 chars of effectiveUid", async () => {
    vi.mocked(SURVEY_API.getForm).mockResolvedValue(mockSurveyTestForm);
    renderSurvey();
    await waitFor(() => expect(banner()).toBeInTheDocument());
    expect(banner()).toHaveTextContent("โหมดทดสอบ · uid …74409e");
    expect(banner()).toHaveClass("fixed");
  });

  it("shows no banner outside test mode", async () => {
    vi.mocked(SURVEY_API.getForm).mockResolvedValue(mockSurveyForm);
    renderSurvey("/survey?b=6");
    await screen.findByRole("radiogroup", { name: SURVEY_TEXT.txnTypeLabel });
    expect(banner()).not.toBeInTheDocument();
  });

  it("submits entry 'test' and keeps the banner on the thank-you screen", async () => {
    vi.mocked(SURVEY_API.getForm).mockResolvedValue(mockSurveyTestForm);
    vi.mocked(SURVEY_API.submitResponse).mockResolvedValue({
      responseId: 9,
      isMember: true,
    });
    renderSurvey();
    await fillAndSubmit();

    expect(await screen.findByText(SURVEY_TEXT.thankYou.title)).toBeInTheDocument();
    expect(vi.mocked(SURVEY_API.submitResponse).mock.calls[0][0].entry).toBe("test");
    expect(banner()).toBeInTheDocument();
  });

  it("keeps test mode across /register?redirect=/survey/linked", async () => {
    vi.mocked(SURVEY_API.getForm).mockResolvedValue({
      ...mockSurveyTestForm,
      member: { isMember: false, custCode: null },
    });
    vi.mocked(SURVEY_API.submitResponse).mockResolvedValue({
      responseId: 10,
      isMember: false,
    });
    vi.mocked(SURVEY_API.link).mockResolvedValue({ linked: 1, isMember: true });
    renderSurvey();
    await fillAndSubmit();

    fireEvent.click(
      await screen.findByRole("link", { name: SURVEY_TEXT.thankYou.linkAccount }),
    );
    fireEvent.click(screen.getByRole("link", { name: "ลงทะเบียนสำเร็จ" }));

    expect(await screen.findByText(SURVEY_TEXT.linked.title)).toBeInTheDocument();
    expect(getSurveyTestMode()).toEqual({ test: "k3y", uid: TEST_UID });
    expect(banner()).toHaveTextContent("โหมดทดสอบ · uid …74409e");
  });

  it.each(["invalid test key", "test mode disabled"])(
    "shows the refused-key screen on 403 40101 (%s) without a LINE login",
    async (message) => {
      vi.mocked(SURVEY_API.getForm)
        .mockRejectedValueOnce(createTestKeyRefusedError(message))
        .mockResolvedValueOnce(mockSurveyForm);
      renderSurvey();

      expect(
        await screen.findByText(SURVEY_TEXT.testMode.refusedTitle),
      ).toBeInTheDocument();
      expect(liff.login).not.toHaveBeenCalled();
      expect(screen.queryByText(SURVEY_TEXT.errors.loadForm)).not.toBeInTheDocument();

      // leaving test mode loads the normal form for the tester's own LINE uid
      fireEvent.click(screen.getByRole("button", { name: SURVEY_TEXT.testMode.exit }));
      await screen.findByRole("radiogroup", { name: SURVEY_TEXT.txnTypeLabel });
      expect(getSurveyTestMode()).toBeNull();
      expect(banner()).not.toBeInTheDocument();
    },
  );

  it("shows a toast when the key is refused on submit", async () => {
    vi.mocked(SURVEY_API.getForm).mockResolvedValue(mockSurveyTestForm);
    vi.mocked(SURVEY_API.submitResponse).mockRejectedValue(createTestKeyRefusedError());
    const { toast } = renderSurvey();
    await fillAndSubmit();

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(SURVEY_TEXT.testMode.refusedTitle),
    );
    expect(liff.login).not.toHaveBeenCalled();
  });

  it("shows the refused-key screen on /survey/linked too", async () => {
    sessionStorage.setItem("G99_SURVEY_TEST", JSON.stringify({ test: "bad", uid: null }));
    vi.mocked(SURVEY_API.link)
      .mockRejectedValueOnce(createTestKeyRefusedError())
      .mockResolvedValueOnce({ linked: 0, isMember: true });
    renderWithSurveyProviders(<SurveyLinkedPage />, {
      path: "/survey/linked",
      initialEntry: "/survey/linked",
    });

    expect(await screen.findByText(SURVEY_TEXT.testMode.refusedTitle)).toBeInTheDocument();
    expect(banner()).toHaveTextContent("โหมดทดสอบ");
    fireEvent.click(screen.getByRole("button", { name: SURVEY_TEXT.testMode.exit }));
    expect(await screen.findByText(SURVEY_TEXT.linked.title)).toBeInTheDocument();
    expect(getSurveyTestMode()).toBeNull();
    expect(banner()).not.toBeInTheDocument();
  });
});
