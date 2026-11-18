import { AxiosError } from "axios";
import type {
  TSurveyEntry,
  TSurveyTransaction,
} from "@/api/endpoint/survey";

export const SURVEY_LIST_PATH = "/survey";

/**
 * ?b= from the counter QR. Only a whole number counts (GoldenApi ignores
 * anything else), so a stray value neither sorts the list nor makes the
 * answer "qr".
 */
export const parseBranchParam = (params: URLSearchParams) => {
  const b = params.get("b")?.trim();
  return b && /^\d+$/.test(b) ? b : null;
};

const withBranch = (path: string, branchParam: string | null) =>
  branchParam ? `${path}?b=${encodeURIComponent(branchParam)}` : path;

/** The list, keeping the QR branch so it still sorts first. */
export const surveyListPath = (branchParam: string | null) =>
  withBranch(SURVEY_LIST_PATH, branchParam);

/** The form for one transaction. Keeps ?b so `entry` survives a refresh. */
export const surveyFormPath = (
  txn: Pick<TSurveyTransaction, "txnType" | "docNumb">,
  branchParam: string | null,
) =>
  withBranch(
    `${SURVEY_LIST_PATH}/t/${encodeURIComponent(txn.txnType)}/${encodeURIComponent(txn.docNumb)}`,
    branchParam,
  );

/** Non-members register, then the register flow comes back to the list. */
export const surveyRegisterPath = (branchParam: string | null) =>
  `/register?redirect=${encodeURIComponent(surveyListPath(branchParam))}`;

export const getSurveyEntry = (branchParam: string | null): TSurveyEntry =>
  branchParam ? "qr" : "manual";

export const getHttpStatus = (error: unknown) =>
  error instanceof AxiosError ? error.response?.status : undefined;

/** GoldenApi's 5-digit resultCode from an error envelope, if any. */
export const getResultCode = (error: unknown) => {
  if (!(error instanceof AxiosError)) return undefined;
  const code = (error.response?.data as { resultCode?: unknown } | undefined)
    ?.resultCode;
  return typeof code === "string" ? code : undefined;
};

/** 503 50003: Simatic (member lookup) failed; the user retries by hand. */
export const isMemberServiceDown = (error: unknown) =>
  getHttpStatus(error) === 503 && getResultCode(error) === "50003";

// 503 50002 = GoldenApi could not reach LINE to verify the ID token: worth a
// quiet retry. 50003 (Simatic) gets the retry screen at once, since its own
// timeout already made the user wait. 401 is answered by logging in again,
// anything else will not fix itself.
export const retryOnServiceUnavailable = (failureCount: number, error: unknown) =>
  getHttpStatus(error) === 503 && !isMemberServiceDown(error) && failureCount < 2;

// 403 40101 on a survey route = GoldenApi refused X-Survey-Test-Key
// ("test mode disabled" / "invalid test key"). Never answered by liff.login().
export const isTestKeyRefused = (error: unknown) =>
  getHttpStatus(error) === 403 && getResultCode(error) === "40101";

/** "8 พ.ย. 2569 14:05": txnAt is Bangkok wall-clock time without an offset. */
export const formatTxnAt = (txnAt: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(txnAt);
  if (!match) return txnAt;
  const [, y, mo, d, h, mi] = match;
  // built and printed in UTC, so the device's own zone never shifts it
  const date = new Date(Date.UTC(+y, +mo - 1, +d));
  const day = date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${day} ${h}:${mi}`;
};

export const formatAmount = (amount: number) =>
  `${amount.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} บาท`;
