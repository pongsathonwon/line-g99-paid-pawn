import { vi } from "vitest";
import type {
  TSessionContext,
  TSessionStatus,
} from "@/context/SessionContext/SessionContext";
import { mockUserInfo } from "./auth-api-mock";

export const mockLineProfile = {
  userId: "Usurvey0001",
  displayName: "ลูกค้าทดสอบ",
  pictureUrl: "https://example.com/picture.jpg",
};

/**
 * A plain session value for <SessionContext.Provider>. Defaults to a member
 * with LINE ready; pass `status` (and overrides) for the other cases.
 */
export const createMockSession = (
  overrides: Partial<TSessionContext> = {},
): TSessionContext => {
  const status: TSessionStatus = overrides.status ?? "member";
  return {
    status,
    errorKind: null,
    lineUid: mockLineProfile.userId,
    lineProfile: mockLineProfile,
    auth: status === "member" ? mockUserInfo : null,
    isRefreshing: false,
    getIdToken: vi.fn(() => "mock-id-token"),
    refresh: vi.fn(async () => status),
    login: vi.fn(),
    ...overrides,
  };
};

/** Every session state the guards handle. */
export const SESSION_CASES = {
  loading: () =>
    createMockSession({ status: "loading", lineUid: null, lineProfile: null }),
  // LINE is ready, the g99-online login has not answered yet
  loadingLineReady: () => createMockSession({ status: "loading" }),
  guest: () => createMockSession({ status: "guest" }),
  member: () => createMockSession({ status: "member" }),
  apiError: () => createMockSession({ status: "error", errorKind: "api" }),
  lineError: () =>
    createMockSession({
      status: "error",
      errorKind: "line",
      lineUid: null,
      lineProfile: null,
    }),
};
