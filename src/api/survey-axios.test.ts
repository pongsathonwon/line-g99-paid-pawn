import { beforeEach, describe, expect, it, vi } from "vitest";
import { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { liff } from "@line/liff";
import { createHttpError } from "@/test/setup/survey-api-mock";
import {
  LINE_ID_TOKEN_HEADER,
  RELOGIN_COOLDOWN_MS,
  attachLineIdToken,
  reloginOnUnauthorized,
  surveyClient,
} from "./survey-axios";
import { axiosClient } from "./axios";

vi.mock("@line/liff", () => ({
  liff: {
    getIDToken: vi.fn(),
    login: vi.fn(),
  },
}));

const makeConfig = () =>
  ({ headers: new AxiosHeaders() }) as InternalAxiosRequestConfig;

describe("survey axios client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    sessionStorage.clear();
  });

  it("is a separate client from the g99-online one", () => {
    expect(surveyClient).not.toBe(axiosClient);
  });

  it("sends the LIFF ID token in X-Line-Id-Token", () => {
    vi.mocked(liff.getIDToken).mockReturnValue("id-token-123");
    const config = attachLineIdToken(makeConfig());
    expect(config.headers.get(LINE_ID_TOKEN_HEADER)).toBe("id-token-123");
    expect(config.headers.get("Authorization")).toBeUndefined();
  });

  it("sends no header when LIFF has no ID token", () => {
    vi.mocked(liff.getIDToken).mockReturnValue(null);
    const config = attachLineIdToken(makeConfig());
    expect(config.headers.has(LINE_ID_TOKEN_HEADER)).toBe(false);
  });

  it("logs in to LINE again on 401 and still rejects", async () => {
    const error = createHttpError(401);
    await expect(reloginOnUnauthorized(error)).rejects.toBe(error);
    expect(liff.login).toHaveBeenCalledWith({
      redirectUri: window.location.href,
    });
  });

  it("logs in again at most once a minute, so a rejected token cannot loop", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-02T10:00:00"));
    await expect(reloginOnUnauthorized(createHttpError(401))).rejects.toBeTruthy();
    await expect(reloginOnUnauthorized(createHttpError(401))).rejects.toBeTruthy();
    expect(liff.login).toHaveBeenCalledOnce();

    vi.setSystemTime(Date.now() + RELOGIN_COOLDOWN_MS + 1);
    await expect(reloginOnUnauthorized(createHttpError(401))).rejects.toBeTruthy();
    expect(liff.login).toHaveBeenCalledTimes(2);
  });

  it.each([400, 409, 503])("does not log in again on %s", async (status) => {
    await expect(reloginOnUnauthorized(createHttpError(status))).rejects.toBeTruthy();
    expect(liff.login).not.toHaveBeenCalled();
  });

  it("does not log in again on a network error", async () => {
    await expect(reloginOnUnauthorized(new Error("offline"))).rejects.toThrow("offline");
    expect(liff.login).not.toHaveBeenCalled();
  });
});
