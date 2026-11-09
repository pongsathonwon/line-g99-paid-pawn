import { liff } from "@line/liff";

/**
 * Thin LINE adapter: LIFF init, profile, ID token and the app's only call to
 * liff.login(). No routing decisions here; the session layer and route guards
 * decide where the user goes.
 */
export type TLineProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
};

const LOGIN_AT_KEY = "G99_LINE_LOGIN_AT";
export const AUTO_LOGIN_COOLDOWN_MS = 60_000;

const readLoginAt = () => {
  try {
    return Number(sessionStorage.getItem(LOGIN_AT_KEY) ?? 0);
  } catch {
    return 0;
  }
};

const writeLoginAt = () => {
  try {
    sessionStorage.setItem(LOGIN_AT_KEY, String(Date.now()));
  } catch {
    // storage unavailable: the guard cannot remember, login still works
  }
};

type TLoginOptions = {
  /** where LINE sends the user back; LIFF's default is the endpoint URL */
  redirectUri?: string;
  /**
   * true for logins nobody tapped (no LINE session after init, a 401 from
   * GoldenApi): at most one a minute, so a token or session that keeps
   * failing cannot loop. A tap on a button always goes through.
   */
  auto?: boolean;
};

/** The only place that calls liff.login(). Returns whether it redirected. */
export const loginWithLine = ({ redirectUri, auto = false }: TLoginOptions = {}) => {
  if (auto && Date.now() - readLoginAt() <= AUTO_LOGIN_COOLDOWN_MS) {
    return false;
  }
  writeLoginAt();
  if (redirectUri) liff.login({ redirectUri });
  else liff.login();
  return true;
};

export class LineInitError extends Error {}

/**
 * Inits LIFF and reads the profile. Resolves null while LINE login (or the
 * liff.state deep-link reload) takes over the page. Throws LineInitError.
 */
export const initLine = async (liffId: string | undefined) => {
  if (!liffId) {
    throw new LineInitError("LIFF ID is not set in environment variables.");
  }
  try {
    await liff.init({ liffId });
  } catch (error) {
    throw new LineInitError(`LIFF Initialization Error: ${(error as Error)?.message ?? ""}`);
  }
  if (!liff.isLoggedIn()) {
    if (loginWithLine({ auto: true })) return null;
    throw new LineInitError("LINE login did not complete");
  }
  try {
    const profile = await liff.getProfile();
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
    } satisfies TLineProfile;
  } catch (error) {
    throw new LineInitError(`LINE Profile Fetch Error: ${(error as Error)?.message ?? ""}`);
  }
};

export const getLineIdToken = () => liff.getIDToken();
