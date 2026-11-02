import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import SplashScreen from "./SplashScreen";
import {
  createMockAuth,
  renderWithSurveyProviders,
} from "@/test/setup/survey-wrapper";

const loggedIn = createMockAuth({
  loginStatus: { isPending: false, isSuccess: true, isError: false },
});
const notMember = createMockAuth({
  loginStatus: { isPending: false, isSuccess: false, isError: true },
});

// What LINE opens for liff.line.me/{id}/survey?b=6
const DEEP_LINK = `/?liff.state=${encodeURIComponent("/survey?b=6")}`;

const renderSplash = (
  initialEntry: string,
  options: Partial<Parameters<typeof renderWithSurveyProviders>[1]> = {},
) =>
  renderWithSurveyProviders(<SplashScreen />, {
    path: "/",
    initialEntry,
    ...options,
  });

const location = () => screen.queryByTestId("location")?.textContent;

describe("SplashScreen", () => {
  describe("without a deep link", () => {
    it("shows the splash while login is pending", () => {
      renderSplash("/", { lineCtx: null });
      expect(screen.getByAltText("logo")).toBeInTheDocument();
      expect(location()).toBeUndefined();
    });

    it("goes to /home after login", () => {
      renderSplash("/", { auth: loggedIn });
      expect(location()).toBe("/home");
    });

    it("goes to ?redirect after login", () => {
      renderSplash("/?redirect=%2Fhistory", { auth: loggedIn });
      expect(location()).toBe("/history");
    });

    it("goes to /register when login fails", () => {
      renderSplash("/", { auth: notMember });
      expect(location()).toBe("/register");
    });
  });

  describe("deep link with liff.state", () => {
    it("holds the splash until LIFF init settles, even if login already finished", () => {
      renderSplash(DEEP_LINK, { lineCtx: null, auth: notMember });
      expect(screen.getByAltText("logo")).toBeInTheDocument();
      expect(location()).toBeUndefined();
    });

    it("goes to the survey instead of /register for a non-member", () => {
      renderSplash(DEEP_LINK, { auth: notMember });
      expect(location()).toBe("/survey?b=6");
    });

    it("goes to the survey instead of /home for a member", () => {
      renderSplash(DEEP_LINK, { auth: loggedIn });
      expect(location()).toBe("/survey?b=6");
    });

    it("goes to the survey before the g99-online login has settled", () => {
      renderSplash(DEEP_LINK);
      expect(location()).toBe("/survey?b=6");
    });

    it("keeps the survey test-mode params through the forward", () => {
      const target = "/survey?b=6&test=k3y&uid=U0bf26f4085b0a41af588f6cb1774409e";
      renderSplash(`/?liff.state=${encodeURIComponent(target)}`, {
        auth: notMember,
      });
      expect(location()).toBe(target);
    });

    it("accepts a liff.state without a leading slash", () => {
      renderSplash(`/?liff.state=${encodeURIComponent("survey?b=6")}`);
      expect(location()).toBe("/survey?b=6");
    });

    it("ignores a liff.state that points off the app", () => {
      renderSplash(`/?liff.state=${encodeURIComponent("//evil.com")}`, {
        auth: loggedIn,
      });
      expect(location()).toBe("/home");
    });
  });
});
