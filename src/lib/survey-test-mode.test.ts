import { beforeEach, describe, expect, it } from "vitest";
import {
  clearSurveyTestMode,
  getSurveyTestMode,
  syncSurveyTestMode,
} from "./survey-test-mode";

const sync = (query: string) => syncSurveyTestMode(new URLSearchParams(query));

describe("survey test mode storage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it("is off without ?test", () => {
    expect(sync("b=6")).toBeNull();
    expect(getSurveyTestMode()).toBeNull();
  });

  it("keeps test and uid in sessionStorage, never localStorage", () => {
    expect(sync("b=6&test=k3y&uid=U1234567890abcdef")).toEqual({
      test: "k3y",
      uid: "U1234567890abcdef",
    });
    expect(getSurveyTestMode()).toEqual({ test: "k3y", uid: "U1234567890abcdef" });
    expect(sessionStorage.length).toBe(1);
    expect(localStorage.length).toBe(0);
  });

  it("allows test without uid", () => {
    expect(sync("test=k3y")).toEqual({ test: "k3y", uid: null });
  });

  it("ignores uid without test", () => {
    expect(sync("uid=U1")).toBeNull();
  });

  it("keeps the stored mode on a page without ?test (e.g. /survey/linked)", () => {
    sync("test=k3y&uid=U1");
    expect(sync("")).toEqual({ test: "k3y", uid: "U1" });
  });

  it("replaces the stored mode when ?test changes", () => {
    sync("test=k3y&uid=U1");
    expect(sync("test=other")).toEqual({ test: "other", uid: null });
  });

  it("clears on an empty ?test=", () => {
    sync("test=k3y&uid=U1");
    expect(sync("test=")).toBeNull();
    expect(sessionStorage.length).toBe(0);
  });

  it("clears on request", () => {
    sync("test=k3y");
    clearSurveyTestMode();
    expect(getSurveyTestMode()).toBeNull();
  });

  it("ignores a broken stored value", () => {
    sessionStorage.setItem("G99_SURVEY_TEST", "{not json");
    expect(getSurveyTestMode()).toBeNull();
    sessionStorage.setItem("G99_SURVEY_TEST", JSON.stringify({ uid: "U1" }));
    expect(getSurveyTestMode()).toBeNull();
  });
});
