import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { liff } from "@line/liff";
import SessionContextProvider from "@/context/SessionContext/SessionContextProvider";
import { ToastContext } from "@/context/ToastContext/ToastContext";
import { AUTH_API } from "@/api/endpoint/auth";
import SplashScreen from "@/pages/SplashScreen";
import { SuccessStep } from "@/component/feature/RegisterSubform/SuccessStep";
import { RequireGuest, RequireLine, RequireMember } from "./SessionGuards";
import { SESSION_TEXT } from "./session.locale";
import { createMockToast } from "@/test/setup/survey-wrapper";
import { mockAuthLoginResponse } from "@/test/setup/auth-api-mock";
import { createHttpError } from "@/test/setup/survey-api-mock";

// The real session provider and guards; only LIFF and g99-online are mocked.

vi.mock("@line/liff", () => ({
  liff: {
    init: vi.fn(),
    login: vi.fn(),
    isLoggedIn: vi.fn(),
    getProfile: vi.fn(),
    getIDToken: vi.fn(),
  },
}));

vi.mock("@/api/endpoint/auth", () => ({
  AUTH_API: { login: vi.fn(), register: vi.fn() },
}));

vi.stubEnv("VITE_LIFF_ID", "test-liff-id");

const notRegistered = () => {
  const error = createHttpError(401);
  error.response!.data = { requiresRegistration: true };
  return error;
};

const renderApp = (initialEntry: string) =>
  render(
    <ToastContext.Provider value={createMockToast()}>
      <SessionContextProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route
              element={
                <RequireGuest>
                  <Outlet />
                </RequireGuest>
              }
            >
              <Route path="/register" element={<div>register page</div>} />
              {/* the last step of every register flow */}
              <Route path="/thai-register" element={<SuccessStep />} />
            </Route>
            <Route
              element={
                <RequireMember>
                  <Outlet />
                </RequireMember>
              }
            >
              <Route path="/home" element={<div>pawn list</div>} />
            </Route>
            <Route
              path="/survey/linked"
              element={
                <RequireLine>
                  <div>survey linked</div>
                </RequireLine>
              }
            />
          </Routes>
        </MemoryRouter>
      </SessionContextProvider>
    </ToastContext.Provider>,
  );

describe("session flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    vi.mocked(liff.init).mockResolvedValue();
    vi.mocked(liff.isLoggedIn).mockReturnValue(true);
    vi.mocked(liff.getProfile).mockResolvedValue({
      userId: "U1234567890",
      displayName: "Test User",
    });
  });

  it("after registering, continue logs in again and lands on /home (no bounce to /register)", async () => {
    vi.mocked(AUTH_API.login)
      .mockRejectedValueOnce(notRegistered())
      .mockResolvedValueOnce(mockAuthLoginResponse);
    renderApp("/thai-register");

    fireEvent.click(await screen.findByRole("button", { name: "กลับสู่เมนูหลัก" }));
    expect(await screen.findByText("pawn list")).toBeInTheDocument();
    expect(screen.queryByText("register page")).not.toBeInTheDocument();
    expect(AUTH_API.login).toHaveBeenCalledTimes(2);
  });

  it("after registering from the survey, continue lands on ?redirect", async () => {
    vi.mocked(AUTH_API.login)
      .mockRejectedValueOnce(notRegistered())
      .mockResolvedValueOnce(mockAuthLoginResponse);
    renderApp("/thai-register?redirect=%2Fsurvey%2Flinked");

    fireEvent.click(await screen.findByRole("button", { name: "ดำเนินการต่อ" }));
    expect(await screen.findByText("survey linked")).toBeInTheDocument();
  });

  it("a guest opening /home is sent to register, then back to /home", async () => {
    vi.mocked(AUTH_API.login).mockRejectedValue(notRegistered());
    renderApp("/home");
    expect(await screen.findByText("register page")).toBeInTheDocument();
  });

  it("a network error at / gives the retry screen, not /register; retry recovers", async () => {
    vi.mocked(AUTH_API.login)
      .mockRejectedValueOnce(new Error("Network Error"))
      .mockResolvedValueOnce(mockAuthLoginResponse);
    renderApp("/");

    expect(await screen.findByText(SESSION_TEXT.apiErrorTitle)).toBeInTheDocument();
    expect(screen.queryByText("register page")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: SESSION_TEXT.retry }));
    expect(await screen.findByText("pawn list")).toBeInTheDocument();
  });

  it("a g99-online outage does not block the survey", async () => {
    vi.mocked(AUTH_API.login).mockRejectedValue(createHttpError(500));
    renderApp("/survey/linked");
    expect(await screen.findByText("survey linked")).toBeInTheDocument();
  });
});
