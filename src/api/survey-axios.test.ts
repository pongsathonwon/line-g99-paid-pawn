import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  AxiosHeaders,
  type AxiosAdapter,
  type InternalAxiosRequestConfig,
} from "axios";
import { liff } from "@line/liff";
import { createHttpError } from "@/test/setup/survey-api-mock";
import {
  LINE_ID_TOKEN_HEADER,
  RELOGIN_COOLDOWN_MS,
  SURVEY_TEST_KEY_HEADER,
  SURVEY_TEST_UID_HEADER,
  attachLineIdToken,
  reloginOnUnauthorized,
  surveyClient,
} from "./survey-axios";
import { axiosClient } from "./axios";
import { syncSurveyTestMode } from "@/lib/survey-test-mode";

/** Sends a request through the client's real interceptors and returns its headers. */
const sentHeaders = async (client: typeof surveyClient) => {
  let headers: AxiosHeaders | undefined;
  const adapter: AxiosAdapter = async (config) => {
    headers = AxiosHeaders.from(config.headers);
    return { data: {}, status: 200, statusText: "OK", headers: {}, config };
  };
  await client.get("form", { adapter });
  return headers!;
};

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

  describe("test mode headers", () => {
    beforeEach(() => {
      vi.mocked(liff.getIDToken).mockReturnValue("id-token-123");
    });

    it("sends no test headers without ?test", async () => {
      const headers = await sentHeaders(surveyClient);
      expect(headers.get(LINE_ID_TOKEN_HEADER)).toBe("id-token-123");
      expect(headers.has(SURVEY_TEST_KEY_HEADER)).toBe(false);
      expect(headers.has(SURVEY_TEST_UID_HEADER)).toBe(false);
    });

    it("sends the test key and uid next to the ID token", async () => {
      syncSurveyTestMode(new URLSearchParams("test=k3y&uid=U1234567890abcdef"));
      const headers = await sentHeaders(surveyClient);
      expect(headers.get(LINE_ID_TOKEN_HEADER)).toBe("id-token-123");
      expect(headers.get(SURVEY_TEST_KEY_HEADER)).toBe("k3y");
      expect(headers.get(SURVEY_TEST_UID_HEADER)).toBe("U1234567890abcdef");
    });

    it("sends no uid header when only test is set", async () => {
      syncSurveyTestMode(new URLSearchParams("test=k3y"));
      const headers = await sentHeaders(surveyClient);
      expect(headers.get(SURVEY_TEST_KEY_HEADER)).toBe("k3y");
      expect(headers.has(SURVEY_TEST_UID_HEADER)).toBe(false);
    });

    it("never adds survey headers to the g99-online client", async () => {
      syncSurveyTestMode(new URLSearchParams("test=k3y&uid=U1"));
      const headers = await sentHeaders(axiosClient);
      expect(headers.has(SURVEY_TEST_KEY_HEADER)).toBe(false);
      expect(headers.has(SURVEY_TEST_UID_HEADER)).toBe(false);
      expect(headers.has(LINE_ID_TOKEN_HEADER)).toBe(false);
    });
  });
});
