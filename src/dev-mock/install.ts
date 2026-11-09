/**
 * Dev-only fake backends for `npm run dev:mock`. vite.config.ts injects this
 * script before main.tsx in mock mode only. It swaps the adapters of the
 * g99-online client and the GoldenApi survey client, so no request leaves the
 * browser. Scenario (member / guest / line-error) comes from ./liff.ts.
 *
 * Survey test mode works too: ?test=<anything>&uid=U… is accepted, ?test=bad
 * is refused with 403 40101 like GoldenApi.
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
import type { TSurveyForm, TSurveyResponseReq } from "@/api/endpoint/survey";
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

// ---------- GoldenApi /api/survey/v1 ----------

const QUESTIONS = [
  "ความพึงพอใจในการใช้บริการ",
  "ความสุภาพของพนักงานในการให้บริการ (อารมณ์ สีหน้า และท่าทาง)",
  "ความรวดเร็วในการให้บริการ",
  "ความสะอาด และบรรยากาศของร้าน (กลิ่น อากาศ ความเรียบร้อยภายในร้าน)",
  "โอกาสแนะนำให้ผู้อื่นมาใช้บริการ",
];
const KEYS = ["satisfaction", "courtesy", "speed", "cleanliness", "recommend"];

const BRANCHES = [0, 1, 2, 3, 6, 23, 30, 33].map((code) => ({
  branchCode: code,
  branchShortName: `G${String(code).padStart(3, "0")}`,
  branchName: `สาขาจำลอง ${code}`,
}));

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

let nextResponseId = 1;

const surveyAdapter: AxiosAdapter = async (config) => {
  await wait(400);
  const headers = AxiosHeaders.from(config.headers);
  if (!String(headers.get("X-Line-Id-Token") ?? "").startsWith("mock-id-token.")) {
    return reply(config, 401, fail("40100", "mock: missing ID token"));
  }

  const testKey = headers.get("X-Survey-Test-Key");
  const testMode = testKey != null && testKey !== "";
  if (testMode && testKey === "bad") {
    return reply(config, 403, fail("40101", "invalid test key"));
  }
  const effectiveUid = testMode
    ? String(headers.get("X-Survey-Test-Uid") ?? MOCK_UIDS[mockScenario])
    : MOCK_UIDS[mockScenario];
  // test mode with ?uid= stands for "a real customer's uid", so it is a member
  const isMember =
    (testMode && headers.get("X-Survey-Test-Uid") != null) ||
    mockScenario === "member";

  const r = route(config);
  if (r === "GET form") {
    const b = Number(config.params?.b);
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
      txnTypes: [
        { code: "BUY_GOLD", label: "ซื้อทอง" },
        { code: "SELL_GOLD", label: "ขายทอง" },
        { code: "CHANGE_GOLD", label: "เปลี่ยนทอง" },
        { code: "PAWN", label: "จำนำ" },
        { code: "PAY_INTEREST", label: "ต่อดอก" },
        { code: "REDEEM", label: "ไถ่ถอน" },
        { code: "OTHER", label: "อื่นๆ" },
      ],
      branches: BRANCHES,
      presetBranchCode: BRANCHES.some((x) => x.branchCode === b) ? b : null,
      member: { isMember, custCode: isMember ? MEMBER_CUST : null },
      ...(testMode ? { testMode: true, effectiveUid } : {}),
    };
    return reply(config, 200, ok(form));
  }

  if (r === "POST responses") {
    const req = parseBody(config) as TSurveyResponseReq;
    const ratings = req.answers.filter((a) => a.rating !== undefined);
    const bad = ratings.filter((a) => !Number.isInteger(a.rating) || a.rating! < 1 || a.rating! > 5);
    if (ratings.length < 5 || bad.length > 0) {
      return reply(config, 400, fail("40000", "mock: every rating must be 1-5"));
    }
    console.info("[mock] survey answer saved", { ...req, entry: testMode ? "test" : req.entry, effectiveUid });
    return reply(config, 200, ok({ responseId: nextResponseId++, isMember }));
  }

  if (r === "POST link") {
    return reply(config, 200, ok({ linked: isMember ? 1 : 0, isMember }));
  }

  console.warn("[mock] survey route not mocked:", r);
  return reply(config, 404, fail("40400", `mock: ${r} not mocked`));
};

axiosClient.defaults.adapter = g99OnlineAdapter;
surveyClient.defaults.adapter = surveyAdapter;

// small corner badge so a mock screen is never mistaken for the real thing
const badge = document.createElement("div");
badge.textContent = `MOCK · ${mockScenario}`;
badge.setAttribute(
  "style",
  "position:fixed;right:8px;bottom:8px;z-index:9999;padding:2px 8px;border-radius:9999px;background:#7c3aed;color:#fff;font:600 11px/18px system-ui;opacity:.85;pointer-events:none",
);
document.addEventListener("DOMContentLoaded", () => document.body.appendChild(badge));
if (document.readyState !== "loading") document.body.appendChild(badge);

console.info(`[mock] dev mock mode: scenario=${mockScenario}. Switch with ?mock=member|guest|line-error`);
