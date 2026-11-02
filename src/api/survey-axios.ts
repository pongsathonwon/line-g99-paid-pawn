import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { liff } from "@line/liff";
import { getSurveyTestMode } from "@/lib/survey-test-mode";

/**
 * Client for GoldenApi /api/survey/v1. Separate from the g99-online client in
 * axios.ts: it authenticates with the LIFF ID token, never the bearer token.
 */
export const surveyClient = axios.create({
  baseURL: import.meta.env.VITE_SURVEY_API_URL,
});

export const LINE_ID_TOKEN_HEADER = "X-Line-Id-Token";
export const SURVEY_TEST_KEY_HEADER = "X-Survey-Test-Key";
export const SURVEY_TEST_UID_HEADER = "X-Survey-Test-Uid";

export const attachLineIdToken = (config: InternalAxiosRequestConfig) => {
  const idToken = liff.getIDToken();
  if (idToken) config.headers.set(LINE_ID_TOKEN_HEADER, idToken);
  return config;
};

// Test mode (?test=&uid=, see survey-test-mode.ts): sent next to the ID
// token, never instead of it. GoldenApi checks the key.
export const attachSurveyTestMode = (config: InternalAxiosRequestConfig) => {
  const testMode = getSurveyTestMode();
  if (testMode) {
    config.headers.set(SURVEY_TEST_KEY_HEADER, testMode.test);
    if (testMode.uid) config.headers.set(SURVEY_TEST_UID_HEADER, testMode.uid);
  }
  return config;
};

const RELOGIN_AT_KEY = "G99_SURVEY_RELOGIN_AT";
export const RELOGIN_COOLDOWN_MS = 60_000;

// 401 = the ID token is missing, invalid or expired: log in to LINE again to
// get a fresh one. At most once a minute, so a token the API never accepts
// (no openid scope, wrong channel id) cannot loop; the page then shows its
// own "log in again" button. 503 (LINE unreachable) is left to the caller.
export const reloginOnUnauthorized = (error: unknown) => {
  if (error instanceof AxiosError && error.response?.status === 401) {
    const lastRelogin = Number(sessionStorage.getItem(RELOGIN_AT_KEY) ?? 0);
    if (Date.now() - lastRelogin > RELOGIN_COOLDOWN_MS) {
      sessionStorage.setItem(RELOGIN_AT_KEY, String(Date.now()));
      liff.login({ redirectUri: window.location.href });
    }
  }
  return Promise.reject(error);
};

surveyClient.interceptors.request.use(attachLineIdToken);
surveyClient.interceptors.request.use(attachSurveyTestMode);
surveyClient.interceptors.response.use(undefined, reloginOnUnauthorized);
