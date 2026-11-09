import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { RequireGuest, RequireLine, RequireMember } from "./SessionGuards";
import SessionRetry from "./SessionRetry";
import { SESSION_TEXT } from "./session.locale";
import { renderWithSurveyProviders } from "@/test/setup/survey-wrapper";
import { SESSION_CASES, createMockSession } from "@/test/setup/session-mock";
import type { TSessionContext } from "@/context/SessionContext/SessionContext";

type TCase = keyof typeof SESSION_CASES;
type TExpect = "splash" | "page" | "retry" | string; // string = redirect target

const renderGuard = (
  guard: "member" | "guest" | "line",
  session: TSessionContext,
  initialEntry: string,
) => {
  const page = <div>protected page</div>;
  const ui =
    guard === "member" ? (
      <RequireMember>{page}</RequireMember>
    ) : guard === "guest" ? (
      <RequireGuest>{page}</RequireGuest>
    ) : (
      <RequireLine>{page}</RequireLine>
    );
  const path = initialEntry.split("?")[0];
  return renderWithSurveyProviders(ui, { path, initialEntry, session });
};

const expectOutcome = (expected: TExpect) => {
  const location = screen.queryByTestId("location")?.textContent;
  if (expected === "splash") {
    expect(screen.getByAltText("logo")).toBeInTheDocument();
    expect(screen.queryByText("protected page")).not.toBeInTheDocument();
    expect(location).toBeUndefined();
  } else if (expected === "page") {
    expect(screen.getByText("protected page")).toBeInTheDocument();
  } else if (expected === "retry") {
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText("protected page")).not.toBeInTheDocument();
    expect(location).toBeUndefined();
  } else {
    expect(location).toBe(expected);
  }
};

describe("RequireMember (was Protected)", () => {
  it.each<[TCase, TExpect]>([
    ["loading", "splash"],
    ["loadingLineReady", "splash"],
    ["guest", "/register?redirect=%2Fhome%2F123%3Ftab%3D1"],
    ["member", "page"],
    ["apiError", "retry"],
    ["lineError", "retry"],
  ])("%s → %s", (name, expected) => {
    renderGuard("member", SESSION_CASES[name](), "/home/123?tab=1");
    expectOutcome(expected);
  });
});

describe("RequireGuest (was PreventReRegister)", () => {
  it.each<[TCase, TExpect]>([
    ["loading", "splash"],
    ["loadingLineReady", "splash"],
    ["guest", "page"],
    ["member", "/home"],
    ["apiError", "retry"],
    ["lineError", "retry"],
  ])("%s → %s", (name, expected) => {
    renderGuard("guest", SESSION_CASES[name](), "/register");
    expectOutcome(expected);
  });

  it("sends a member on to a safe ?redirect", () => {
    renderGuard("guest", SESSION_CASES.member(), "/register?redirect=%2Fsurvey%2Flinked");
    expectOutcome("/survey/linked");
  });

  it("ignores a ?redirect that leaves the app", () => {
    renderGuard("guest", SESSION_CASES.member(), "/register?redirect=%2F%2Fevil.com");
    expectOutcome("/home");
  });
});

describe("RequireLine (survey pages)", () => {
  it.each<[TCase, TExpect]>([
    ["loading", "splash"],
    // the survey does not wait for or depend on g99-online
    ["loadingLineReady", "page"],
    ["guest", "page"],
    ["member", "page"],
    ["apiError", "page"],
    ["lineError", "retry"],
  ])("%s → %s", (name, expected) => {
    renderGuard("line", SESSION_CASES[name](), "/survey");
    expectOutcome(expected);
  });
});

describe("SessionRetry", () => {
  const renderRetry = (session: TSessionContext) =>
    renderWithSurveyProviders(<SessionRetry />, {
      path: "/",
      initialEntry: "/",
      session,
    });

  it("retries a g99-online / network failure with refresh()", () => {
    const session = SESSION_CASES.apiError();
    renderRetry(session);
    expect(screen.getByText(SESSION_TEXT.apiErrorTitle)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: SESSION_TEXT.retry }));
    expect(session.refresh).toHaveBeenCalledOnce();
    expect(session.login).not.toHaveBeenCalled();
  });

  it("disables retry while refreshing", () => {
    renderRetry(createMockSession({ status: "error", errorKind: "api", isRefreshing: true }));
    expect(screen.getByRole("button", { name: SESSION_TEXT.retrying })).toBeDisabled();
  });

  it("retries a LIFF failure with login()", () => {
    const session = SESSION_CASES.lineError();
    session.refresh = vi.fn();
    renderRetry(session);
    expect(screen.getByText(SESSION_TEXT.lineErrorTitle)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: SESSION_TEXT.lineLogin }));
    expect(session.login).toHaveBeenCalledOnce();
    expect(session.refresh).not.toHaveBeenCalled();
  });
});
