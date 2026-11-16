/**
 * Dev-only fake backends for `npm run dev:mock`. vite.config.ts injects this
 * script before main.tsx in mock mode only. It swaps the adapters of the
 * g99-online client and the GoldenApi survey client, so no request leaves the
 * browser. Scenario (member / guest / line-error) comes from ./liff.ts.
 *
 * Survey v2: GET /transactions lists all 6 types (one already rated, one
 * trade-in); a submit marks the item rated for the rest of the tab session.
 * ?mock-fail= fakes GoldenApi failures (see readMockFail).
 *
 * Survey test mode works too: ?test=<anything>&uid=U… is accepted, ?test=bad
 * is refused with 403 40101 like GoldenApi. In test mode any uid is a member
 * except the mock guest's, and test answers never mark an item rated (as in
 * GoldenApi).
 */
import {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { axiosClient } from "@/api/axios";
import { surveyClient } from "@/api/survey-axios";
import type { TAuthLoginRes } from "@/api/endpoint/auth";
import type { TGetManyPawmRes } from "@/api/endpoint/pawn";
import type {
  TSurveyForm,
  TSurveyResponseReq,
  TSurveyTransaction,
  TSurveyTransactions,
} from "@/api/endpoint/survey";
import { MOCK_UIDS, mockScenario } from "./liff";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const reply = (
  config: InternalAxiosRequestConfig,
  status: number,
  data: unknown,
): AxiosResponse => {
  const response: AxiosResponse = {
    data,
    status,
    statusText: String(status),
    headers: new AxiosHeaders(),
    config,
  };
  if (status >= 400) {
    throw new AxiosError(
      `mock ${status}`,
      status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
      config,
      null,
      response,
    );
  }
  return response;
};

const parseBody = (config: InternalAxiosRequestConfig) =>
  typeof config.data === "string" ? JSON.parse(config.data) : config.data;

const route = (config: InternalAxiosRequestConfig) =>
  `${(config.method ?? "get").toUpperCase()} ${(config.url ?? "").replace(/^\//, "")}`;

// ---------- g99-online ----------

const MEMBER_CUST = "M000001";

const memberLogin = (): TAuthLoginRes => ({
  accessToken: "mock-access-token",
  jwtToken: "mock-jwt",
  jwtExpire: Math.floor(Date.now() / 1000) + 3600,
  userInfo: {
    id: "mock-1",
    custNo: MEMBER_CUST,
    fullname: "สมาชิก ทดสอบ",
    idCard: "0000000000000",
    lineUid: MOCK_UIDS.member,
    mobileNo: "0800000000",
    branchCode: "1",
    custType: "G",
    custStat: 1,
    isConsent: true,
    isVerified: true,
    birthDate: "1990-01-01T00:00:00",
    gender: "x",
  },
});

const isoDaysFromNow = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

const mockPawns: TGetManyPawmRes[] = [
  { pawnNumb: "MOCK-0001", nextPaidDate: isoDaysFromNow(3), goodWeight: 7.6, pawnPrice: 25000, interest: 312.5, interestMonth: 1 },
  { pawnNumb: "MOCK-0002", nextPaidDate: isoDaysFromNow(20), goodWeight: 15.2, pawnPrice: 52000, interest: 650, interestMonth: 1 },
];

const g99OnlineAdapter: AxiosAdapter = async (config) => {
  await wait(250);
  const r = route(config);
  if (r === "POST login") {
    if (mockScenario === "member") return reply(config, 200, memberLogin());
    return reply(config, 401, {
      message: "User not registered",
      error: "mock guest",
      requiresRegistration: true,
    });
  }
  if (r.startsWith("GET pawn/hist-paid/")) return reply(config, 200, []);
  if (r.startsWith("GET pawn/")) return reply(config, 200, mockPawns);
  console.warn("[mock] g99-online route not mocked:", r);
  return reply(config, 404, { message: `mock: ${r} not mocked` });
};

// ---------- GoldenApi /api/survey/v1 (v2: members rate their own POS transactions) ----------

const QUESTIONS = [
  "ความพึงพอใจในการใช้บริการ",
  "ความสุภาพของพนักงานในการให้บริการ (อารมณ์ สีหน้า และท่าทาง)",
  "ความรวดเร็วในการให้บริการ",
  "ความสะอาด และบรรยากาศของร้าน (กลิ่น อากาศ ความเรียบร้อยภายในร้าน)",
  "โอกาสแนะนำให้ผู้อื่นมาใช้บริการ",
];
const KEYS = ["satisfaction", "courtesy", "speed", "cleanliness", "recommend"];

const ok = <T,>(resultData: T) => ({
  resultCode: "20000",
  resultDescription: "Success",
  resultData,
});

const fail = (resultCode: string, errorMessage: string) => ({
  resultCode,
  resultDescription: "mock error",
  resultData: { errorMessage },
});

/**
 * ?mock-fail=<case> fakes a GoldenApi failure; kept for the tab like ?mock.
 * `?mock-fail=` (empty) or `none` turns it off.
 * - simatic: GET /transactions and POST /responses answer 503 50003
 * - simatic-once: only the next GET /transactions fails, then "ลองใหม่" works
 * - duplicate: POST /responses answers 409 40901 (rated meanwhile elsewhere)
 * - window: POST /responses answers 422 42201 (cancelled or > 30 days)
 * - notfound: POST /responses answers 404 40401 (not this member's)
 * - empty: a member with no transactions in the window
 */
type TMockFail = "simatic" | "simatic-once" | "duplicate" | "window" | "notfound" | "empty";
const FAILS: TMockFail[] = ["simatic", "simatic-once", "duplicate", "window", "notfound", "empty"];
const FAIL_KEY = "G99_DEV_MOCK_FAIL";

// read on page load only, so "simatic-once" is not re-armed by a retry while
// the param is still in the address bar
const params = new URLSearchParams(window.location.search);
if (params.has("mock-fail")) {
  const fromUrl = params.get("mock-fail") as TMockFail;
  if (FAILS.includes(fromUrl)) sessionStorage.setItem(FAIL_KEY, fromUrl);
  else sessionStorage.removeItem(FAIL_KEY);
}

const readMockFail = (): TMockFail | null => {
  const stored = sessionStorage.getItem(FAIL_KEY) as TMockFail | null;
  return stored && FAILS.includes(stored) ? stored : null;
};

// Bangkok wall clock, ISO without offset, like GoldenApi
const bangkokAt = (daysAgo: number, hhmm: string) => {
  const d = new Date(Date.now() + 7 * 3600_000 - daysAgo * 86_400_000);
  return `${d.toISOString().slice(0, 10)}T${hhmm}:00`;
};
const bangkokDay = (daysAgo: number) => bangkokAt(daysAgo, "00:00").slice(0, 10);

const branch = (branchCode: number) => ({
  branchCode,
  branchShortName: `G${String(branchCode).padStart(3, "0")}`,
});

// All 6 types. The trade-in is one CHANGE_GOLD item (its sale and buy legs
// are not listed), PAY_INTEREST is rated already, and PAWN / REDEEM share a
// pawnNumb (the key is type + docNumb).
const baseTransactions = (): TSurveyTransaction[] => [
  { txnType: "BUY_GOLD", label: "ซื้อทอง", docNumb: "S060001234", txnAt: bangkokAt(0, "10:42"), ...branch(6), amount: 41250, surveyed: false },
  { txnType: "CHANGE_GOLD", label: "เปลี่ยนทอง", docNumb: "C030000456", txnAt: bangkokAt(1, "15:20"), ...branch(30), amount: 3800, surveyed: false },
  { txnType: "REDEEM", label: "ไถ่ถอน", docNumb: "P060000789", txnAt: bangkokAt(3, "11:05"), ...branch(6), amount: 25000, surveyed: false },
  { txnType: "PAY_INTEREST", label: "ต่อดอก", docNumb: "R010000321", txnAt: bangkokAt(6, "13:30"), ...branch(1), amount: 750, surveyed: true },
  { txnType: "SELL_GOLD", label: "ขายทอง", docNumb: "B230000654", txnAt: bangkokAt(12, "16:45"), ...branch(23), amount: 18900.5, surveyed: false },
  { txnType: "PAWN", label: "จำนำ", docNumb: "P060000789", txnAt: bangkokAt(27, "09:15"), ...branch(6), amount: 25000, surveyed: false },
];

// "Rated" survives reloads for the rest of the tab session
const RATED_KEY = "G99_DEV_MOCK_RATED";
const txnKey = (txnType: string, docNumb: string) => `${txnType}/${docNumb}`;
const readRated = (): string[] => {
  try {
    return JSON.parse(sessionStorage.getItem(RATED_KEY) ?? "[]");
  } catch {
    return [];
  }
};
const markRated = (key: string) =>
  sessionStorage.setItem(RATED_KEY, JSON.stringify([...new Set([...readRated(), key])]));

/** GoldenApi's order: branch b first, then newest txnAt, then txnType, docNumb. */
const memberTransactions = (b: number | null): TSurveyTransaction[] => {
  const rated = readRated();
  return baseTransactions()
    .map((x) => ({ ...x, surveyed: x.surveyed || rated.includes(txnKey(x.txnType, x.docNumb)) }))
    .sort(
      (x, y) =>
        Number(y.branchCode === b) - Number(x.branchCode === b) ||
        y.txnAt.localeCompare(x.txnAt) ||
        x.txnType.localeCompare(y.txnType) ||
        x.docNumb.localeCompare(y.docNumb),
    );
};

const simaticDown = (config: InternalAxiosRequestConfig) =>
  reply(config, 503, fail("50003", "Member lookup is unavailable, try again"));

let nextResponseId = 1;

const surveyAdapter: AxiosAdapter = async (config) => {
  await wait(400);
  const mockFail = readMockFail();
  updateBadge(mockFail);
  const headers = AxiosHeaders.from(config.headers);
  if (!String(headers.get("X-Line-Id-Token") ?? "").startsWith("mock-id-token.")) {
    return reply(config, 401, fail("40100", "mock: missing ID token"));
  }

  const testKey = headers.get("X-Survey-Test-Key");
  const testMode = testKey != null && testKey !== "";
  if (testMode && testKey === "bad") {
    return reply(config, 403, fail("40101", "invalid test key"));
  }
  const testUid = testMode ? headers.get("X-Survey-Test-Uid") : null;
  if (testUid != null && !/^U[0-9a-f]{32}$/.test(String(testUid))) {
    return reply(config, 400, fail("40000", "X-Survey-Test-Uid must look like a LINE uid (U + 32 hex digits)"));
  }
  const effectiveUid = String(testUid ?? MOCK_UIDS[mockScenario]);
  // only the member scenario's uid, or any other test uid, is a member: so
  // ?test=k&uid=<MOCK_UIDS.guest> shows "uid นี้ยังไม่เป็นสมาชิก"
  const isMember = effectiveUid !== MOCK_UIDS.guest && effectiveUid !== MOCK_UIDS["line-error"];
  const testFields = testMode ? { testMode: true, effectiveUid } : {};

  const r = route(config);
  if (r === "GET transactions") {
    if (mockFail === "simatic") return simaticDown(config);
    if (mockFail === "simatic-once") {
      sessionStorage.removeItem(FAIL_KEY);
      return simaticDown(config);
    }
    const raw = config.params?.b;
    const b = raw != null && /^\d+$/.test(String(raw)) ? Number(raw) : null;
    const data: TSurveyTransactions = {
      isMember,
      custCode: isMember ? MEMBER_CUST : null,
      windowDays: 30,
      windowFrom: bangkokDay(30),
      windowTo: bangkokDay(0),
      items: !isMember || mockFail === "empty" ? [] : memberTransactions(b),
      ...testFields,
    };
    return reply(config, 200, ok(data));
  }

  if (r === "GET form") {
    const form: TSurveyForm = {
      questionSet: {
        setId: 1,
        version: 1,
        title: "แบบประเมินหลังใช้บริการ",
        questions: [
          ...QUESTIONS.map((textTh, i) => ({
            questionId: i + 1,
            seq: i + 1,
            questionKey: KEYS[i],
            kind: "RATING_1_5" as const,
            isRequired: true,
            textTh,
          })),
          { questionId: 6, seq: 6, questionKey: "comment", kind: "TEXT", isRequired: false, textTh: "ความเห็นเพิ่มเติม" },
        ],
      },
      ...testFields,
    };
    return reply(config, 200, ok(form));
  }

  if (r === "POST responses") {
    // same order of checks as GoldenApi (docs/SURVEY_API.md, POST /responses)
    const req = parseBody(config) as TSurveyResponseReq;
    const ratings = req.answers.filter((a) => a.rating !== undefined);
    const bad = ratings.filter((a) => !Number.isInteger(a.rating) || a.rating! < 1 || a.rating! > 5);
    if (ratings.length < 5 || bad.length > 0) {
      return reply(config, 400, fail("40000", "mock: every rating must be 1-5"));
    }
    if (mockFail === "simatic") return simaticDown(config);
    if (!isMember) {
      return reply(config, 403, fail("40301", "This LINE account is not linked to a member"));
    }
    const label = `${req.txnType} ${req.docNumb}`;
    const txn = baseTransactions().find((x) => x.txnType === req.txnType && x.docNumb === req.docNumb);
    if (!txn || mockFail === "notfound") {
      return reply(config, 404, fail("40401", `No ${label} for this member`));
    }
    if (mockFail === "window") {
      return reply(config, 422, fail("42201", `${label} is cancelled or older than 30 days`));
    }
    const key = txnKey(req.txnType, req.docNumb);
    if (mockFail === "duplicate" || txn.surveyed || readRated().includes(key)) {
      return reply(config, 409, fail("40901", `${label} has already been surveyed`));
    }
    // test answers never use up a transaction (surveyed counts qr/manual only)
    if (!testMode) markRated(key);
    console.info("[mock] survey answer saved", { ...req, entry: testMode ? "test" : req.entry, effectiveUid });
    return reply(config, 200, ok({ responseId: nextResponseId++ }));
  }

  // POST link is gone in v2: ASP.NET's plain 404, without the envelope
  console.warn("[mock] survey route not mocked:", r);
  return reply(config, 404, "");
};

axiosClient.defaults.adapter = g99OnlineAdapter;
surveyClient.defaults.adapter = surveyAdapter;

// small corner badge so a mock screen is never mistaken for the real thing
const badge = document.createElement("div");
function updateBadge(mockFail: string | null) {
  badge.textContent = `MOCK · ${mockScenario}${mockFail ? ` · fail=${mockFail}` : ""}`;
}
updateBadge(readMockFail());
badge.setAttribute(
  "style",
  "position:fixed;right:8px;bottom:8px;z-index:9999;padding:2px 8px;border-radius:9999px;background:#7c3aed;color:#fff;font:600 11px/18px system-ui;opacity:.85;pointer-events:none",
);
document.addEventListener("DOMContentLoaded", () => document.body.appendChild(badge));
if (document.readyState !== "loading") document.body.appendChild(badge);

console.info(`[mock] dev mock mode: scenario=${mockScenario}. Switch with ?mock=member|guest|line-error; fake failures with ?mock-fail=simatic|simatic-once|duplicate|window|notfound|empty (empty value clears)`);
