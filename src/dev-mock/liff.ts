/**
 * Dev-only stand-in for @line/liff, used by `npm run dev:mock` (vite.config.ts
 * aliases @line/liff here in mock mode only; production builds never see it).
 *
 * Pick the login result with ?mock=member | guest | line-error on any URL. The
 * choice is kept in sessionStorage for the tab. Default: member.
 */

export type TMockScenario = "member" | "guest" | "line-error";

const SCENARIO_KEY = "G99_DEV_MOCK";
const SCENARIOS: TMockScenario[] = ["member", "guest", "line-error"];

export const MOCK_UIDS: Record<TMockScenario, string> = {
  member: "U0000000000000000000000000000a001",
  guest: "U0000000000000000000000000000b002",
  "line-error": "U0000000000000000000000000000c003",
};

const readScenario = (): TMockScenario => {
  const fromUrl = new URLSearchParams(window.location.search).get("mock");
  if (fromUrl && SCENARIOS.includes(fromUrl as TMockScenario)) {
    sessionStorage.setItem(SCENARIO_KEY, fromUrl);
    return fromUrl as TMockScenario;
  }
  const stored = sessionStorage.getItem(SCENARIO_KEY);
  return SCENARIOS.includes(stored as TMockScenario)
    ? (stored as TMockScenario)
    : "member";
};

export const mockScenario = readScenario();

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const liff = {
  // same signature as liff.init; the id is not needed here
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init: async (_config: { liffId: string }) => {
    await wait(300);
    if (mockScenario === "line-error") {
      throw new Error("mock: LIFF init failed (?mock=line-error)");
    }
  },
  isLoggedIn: () => true,
  getProfile: async () => ({
    userId: MOCK_UIDS[mockScenario],
    displayName: mockScenario === "member" ? "สมาชิก ทดสอบ" : "ผู้ใช้ LINE ทดสอบ",
    pictureUrl: undefined as string | undefined,
  }),
  getIDToken: () => `mock-id-token.${MOCK_UIDS[mockScenario]}`,
  login: (config?: { redirectUri?: string }) => {
    console.info("[mock] liff.login", config ?? {});
  },
};

export default liff;
