import { beforeEach, describe, expect, it, vi } from "vitest";
import { liff } from "@line/liff";
import {
  AUTO_LOGIN_COOLDOWN_MS,
  LineInitError,
  getLineIdToken,
  initLine,
  loginWithLine,
} from "./line";

vi.mock("@line/liff", () => ({
  liff: {
    init: vi.fn(),
    login: vi.fn(),
    isLoggedIn: vi.fn(),
    getProfile: vi.fn(),
    getIDToken: vi.fn(),
  },
}));

const PROFILE = {
  userId: "U1234567890",
  displayName: "Test User",
  pictureUrl: "https://example.com/picture.jpg",
  statusMessage: "hi",
};

describe("LINE adapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    sessionStorage.clear();
  });

  describe("initLine", () => {
    it("inits LIFF and returns the profile", async () => {
      vi.mocked(liff.init).mockResolvedValue();
      vi.mocked(liff.isLoggedIn).mockReturnValue(true);
      vi.mocked(liff.getProfile).mockResolvedValue(PROFILE);

      await expect(initLine("liff-id")).resolves.toEqual({
        userId: PROFILE.userId,
        displayName: PROFILE.displayName,
        pictureUrl: PROFILE.pictureUrl,
      });
      expect(liff.init).toHaveBeenCalledWith({ liffId: "liff-id" });
    });

    it("hands over to LINE login when there is no LINE session", async () => {
      vi.mocked(liff.init).mockResolvedValue();
      vi.mocked(liff.isLoggedIn).mockReturnValue(false);

      await expect(initLine("liff-id")).resolves.toBeNull();
      // no redirectUri: LIFF returns to the endpoint URL, as before
      expect(liff.login).toHaveBeenCalledWith();
      expect(liff.getProfile).not.toHaveBeenCalled();
    });

    it("fails instead of looping when LINE login keeps coming back logged out", async () => {
      vi.mocked(liff.init).mockResolvedValue();
      vi.mocked(liff.isLoggedIn).mockReturnValue(false);

      await initLine("liff-id");
      await expect(initLine("liff-id")).rejects.toBeInstanceOf(LineInitError);
      expect(liff.login).toHaveBeenCalledOnce();
    });

    it("fails without a LIFF ID", async () => {
      await expect(initLine("")).rejects.toThrow("LIFF ID is not set");
      expect(liff.init).not.toHaveBeenCalled();
    });

    it("fails when liff.init fails", async () => {
      vi.mocked(liff.init).mockRejectedValue(new Error("Init failed"));
      await expect(initLine("liff-id")).rejects.toThrow("Init failed");
    });

    it("fails when the profile cannot be read", async () => {
      vi.mocked(liff.init).mockResolvedValue();
      vi.mocked(liff.isLoggedIn).mockReturnValue(true);
      vi.mocked(liff.getProfile).mockRejectedValue(new Error("Profile fetch failed"));
      await expect(initLine("liff-id")).rejects.toThrow("Profile fetch failed");
    });
  });

  describe("loginWithLine (the only liff.login call)", () => {
    it("passes the redirectUri on", () => {
      expect(loginWithLine({ redirectUri: "https://app/survey?b=6" })).toBe(true);
      expect(liff.login).toHaveBeenCalledWith({ redirectUri: "https://app/survey?b=6" });
    });

    it("lets automatic logins through at most once a minute", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-11-09T10:00:00"));
      expect(loginWithLine({ auto: true })).toBe(true);
      expect(loginWithLine({ auto: true })).toBe(false);
      expect(liff.login).toHaveBeenCalledOnce();

      vi.setSystemTime(Date.now() + AUTO_LOGIN_COOLDOWN_MS + 1);
      expect(loginWithLine({ auto: true })).toBe(true);
      expect(liff.login).toHaveBeenCalledTimes(2);
    });

    it("always lets a tapped login through, even inside the cooldown", () => {
      loginWithLine({ auto: true });
      expect(loginWithLine()).toBe(true);
      expect(liff.login).toHaveBeenCalledTimes(2);
    });

    it("works when sessionStorage is unavailable", () => {
      const getItem = vi
        .spyOn(Storage.prototype, "getItem")
        .mockImplementation(() => {
          throw new Error("blocked");
        });
      const setItem = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("blocked");
        });
      expect(loginWithLine({ auto: true })).toBe(true);
      getItem.mockRestore();
      setItem.mockRestore();
    });
  });

  it("reads the ID token from LIFF", () => {
    vi.mocked(liff.getIDToken).mockReturnValue("id-token");
    expect(getLineIdToken()).toBe("id-token");
  });
});
