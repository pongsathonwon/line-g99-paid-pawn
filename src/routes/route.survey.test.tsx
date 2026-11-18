import { describe, expect, it, vi } from "vitest";
import { Suspense } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { APP_ROUTES } from "./route";
import { SURVEY_API } from "@/api/endpoint/survey";
import { SURVEY_TEXT } from "@/component/feature/SurveyForm/survey.locale";
import { SessionContext } from "@/context/SessionContext/SessionContext";
import { ToastContext } from "@/context/ToastContext/ToastContext";
import {
  mockSurveyForm,
  mockSurveyTransactions,
} from "@/test/setup/survey-api-mock";
import { createMockSession } from "@/test/setup/session-mock";
import { createMockToast } from "@/test/setup/survey-wrapper";

vi.mock("@/api/endpoint/survey", async () => {
  const { createSurveyApiMock } = await import("@/test/setup/survey-api-mock");
  return { SURVEY_API: createSurveyApiMock().SURVEY_API };
});

vi.mock("@line/liff", () => ({
  liff: { login: vi.fn(), getIDToken: vi.fn() },
}));

const renderAt = (path: string) => {
  const router = createMemoryRouter(APP_ROUTES.routes, { initialEntries: [path] });
  render(
    <ToastContext.Provider value={createMockToast()}>
      <QueryClientProvider client={new QueryClient()}>
        <SessionContext.Provider value={createMockSession({ status: "guest" })}>
          <Suspense fallback={null}>
            <RouterProvider router={router} />
          </Suspense>
        </SessionContext.Provider>
      </QueryClientProvider>
    </ToastContext.Provider>,
  );
  return router;
};

describe("survey routes", () => {
  it("redirects the v1 /survey/linked to the list", async () => {
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue(mockSurveyTransactions);
    const router = renderAt("/survey/linked");
    expect(await screen.findByRole("heading", { name: SURVEY_TEXT.list.heading })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/survey");
  });

  it("opens the form at /survey/t/:txnType/:docNumb", async () => {
    vi.mocked(SURVEY_API.getTransactions).mockResolvedValue(mockSurveyTransactions);
    vi.mocked(SURVEY_API.getForm).mockResolvedValue(mockSurveyForm);
    renderAt("/survey/t/CHANGE_GOLD/C060012345?b=6");
    expect(await screen.findByRole("heading", { name: SURVEY_TEXT.form.heading })).toBeInTheDocument();
    await waitFor(() => expect(SURVEY_API.getTransactions).toHaveBeenCalledWith("6"));
  });
});
