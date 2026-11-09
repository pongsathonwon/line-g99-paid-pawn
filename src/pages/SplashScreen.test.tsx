import { describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import SplashScreen from "./SplashScreen";
import { renderWithSurveyProviders } from "@/test/setup/survey-wrapper";
import { SESSION_CASES } from "@/test/setup/session-mock";
import { SESSION_TEXT } from "@/layout/SessionGuard/session.locale";

// What LINE opens for liff.line.me/{id}/survey?b=6
const DEEP_LINK = `/?liff.state=${encodeURIComponent("/survey?b=6")}`;

const renderSplash = (
  initialEntry: string,
  session = SESSION_CASES.loading(),
) =>
  renderWithSurveyProviders(<SplashScreen />, {
    path: "/",
    initialEntry,
    session,
  });

const location = () => screen.queryByTestId("location")?.textContent;
const isSplash = () => screen.queryByAltText("logo") !== null;

describe("/ resolver", () => {
  describe("without a deep link", () => {
    it("shows the splash while the session loads", () => {
      renderSplash("/");
      expect(isSplash()).toBe(true);
      expect(location()).toBeUndefined();
    });

    it("member → /home", () => {
      renderSplash("/", SESSION_CASES.member());
      expect(location()).toBe("/home");
    });

    it("member → ?redirect", () => {
      renderSplash("/?redirect=%2Fhistory", SESSION_CASES.member());
      expect(location()).toBe("/history");
    });

    it("member ignores a ?redirect that leaves the app", () => {
      renderSplash("/?redirect=%2F%2Fevil.com", SESSION_CASES.member());
      expect(location()).toBe("/home");
    });

    it("guest → /register", () => {
      renderSplash("/", SESSION_CASES.guest());
      expect(location()).toBe("/register");
    });

    it("guest → /register carrying ?redirect", () => {
      renderSplash("/?redirect=%2Fhistory", SESSION_CASES.guest());
      expect(location()).toBe("/register?redirect=%2Fhistory");
    });

    it("a g99-online or network error shows the retry screen, not /register", () => {
      renderSplash("/", SESSION_CASES.apiError());
      expect(screen.getByText(SESSION_TEXT.apiErrorTitle)).toBeInTheDocument();
      expect(location()).toBeUndefined();
    });

    it("a LIFF error shows the LINE retry screen", () => {
      const session = SESSION_CASES.lineError();
      renderSplash("/", session);
      fireEvent.click(screen.getByRole("button", { name: SESSION_TEXT.lineLogin }));
      expect(session.login).toHaveBeenCalledOnce();
    });
  });

  describe("deep link with liff.state (wins over redirect and default)", () => {
    it("holds the splash until LINE is ready", () => {
      renderSplash(DEEP_LINK);
      expect(isSplash()).toBe(true);
      expect(location()).toBeUndefined();
    });

    it.each([
      ["guest", SESSION_CASES.guest],
      ["member", SESSION_CASES.member],
      ["g99-online still loading", SESSION_CASES.loadingLineReady],
      ["g99-online error", SESSION_CASES.apiError],
    ])("goes to the survey for %s", (_name, makeSession) => {
      renderSplash(DEEP_LINK, makeSession());
      expect(location()).toBe("/survey?b=6");
    });

    it("beats ?redirect", () => {
      renderSplash(`${DEEP_LINK}&redirect=%2Fhistory`, SESSION_CASES.member());
      expect(location()).toBe("/survey?b=6");
    });

    it("keeps the survey test-mode params through the forward", () => {
      const target = "/survey?b=6&test=k3y&uid=U0bf26f4085b0a41af588f6cb1774409e";
      renderSplash(`/?liff.state=${encodeURIComponent(target)}`, SESSION_CASES.guest());
      expect(location()).toBe(target);
    });

    it("accepts a liff.state without a leading slash", () => {
      renderSplash(
        `/?liff.state=${encodeURIComponent("survey?b=6")}`,
        SESSION_CASES.guest(),
      );
      expect(location()).toBe("/survey?b=6");
    });

    it("ignores a liff.state that points off the app", () => {
      renderSplash(
        `/?liff.state=${encodeURIComponent("//evil.com")}`,
        SESSION_CASES.member(),
      );
      expect(location()).toBe("/home");
    });

    it("shows the LINE retry screen when LIFF failed", () => {
      renderSplash(DEEP_LINK, SESSION_CASES.lineError());
      expect(screen.getByText(SESSION_TEXT.lineErrorTitle)).toBeInTheDocument();
    });
  });
});
