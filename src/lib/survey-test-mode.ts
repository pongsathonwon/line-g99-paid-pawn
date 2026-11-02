/**
 * Survey test mode: /survey?test=<key>&uid=<LINE uid> lets a tester answer as
 * another LINE uid on production. The key is never in the bundle; the page
 * only passes it on and GoldenApi checks it. Kept in sessionStorage (never
 * localStorage) so it survives /register?redirect=/survey/linked.
 */
export type TSurveyTestMode = {
  test: string;
  uid: string | null;
};

const STORAGE_KEY = "G99_SURVEY_TEST";

export const getSurveyTestMode = (): TSurveyTestMode | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { test, uid } = JSON.parse(raw) as Partial<TSurveyTestMode>;
    if (typeof test !== "string" || !test) return null;
    return { test, uid: typeof uid === "string" && uid ? uid : null };
  } catch {
    return null;
  }
};

export const clearSurveyTestMode = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage unavailable: nothing is kept anyway
  }
};

/**
 * Applies ?test= / ?uid= from the URL: a non-empty test saves both, an empty
 * test clears, no test param keeps what is stored. Returns the current mode.
 */
export const syncSurveyTestMode = (params: URLSearchParams) => {
  if (params.has("test")) {
    const test = params.get("test")?.trim();
    if (!test) {
      clearSurveyTestMode();
    } else {
      const uid = params.get("uid")?.trim() || null;
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ test, uid }));
      } catch {
        // storage unavailable: test mode lasts for this page only
        return { test, uid };
      }
    }
  }
  return getSurveyTestMode();
};
