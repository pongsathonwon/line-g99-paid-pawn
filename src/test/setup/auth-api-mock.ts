import { vi } from "vitest";
import type { TAuthLoginRes, TUserInfo } from "@/api/endpoint/auth";

/**
 * Reusable mock data for AUTH_API tests
 */
export const mockUserInfo: TUserInfo = {
  id: "445725",
  custNo: "000002",
  fullname: "เปเล ซาน วิน",
  idCard: "0074015073011",
  lineUid: "U0bf26f4085b0a41af588f6cb1774409e",
  mobileNo: "0949028344",
  branchCode: "43",
  custType: "G",
  custStat: 1,
  isConsent: true,
  isVerified: true,
  birthDate: "1987-05-06T17:00:00.000Z",
  gender: "x",
};

export const mockAuthLoginResponse: TAuthLoginRes = {
  accessToken: "mock-access-token",
  jwtToken: "mock-jwt-token",
  jwtExpire: Date.now() + 3600000,
  userInfo: mockUserInfo,
};

/**
 * Mock AUTH_API module
 * Use this at the top of your test files with vi.mock()
 */
export const createAuthApiMock = () => {
  const mockLogin = vi.fn();
  const mockRegister = vi.fn();

  return {
    mockLogin,
    mockRegister,
    AUTH_API: {
      login: mockLogin,
      register: mockRegister,
    },
  };
};

/**
 * Setup helpers for common test scenarios
 */
export const authApiMockHelpers = {
  setupSuccessLogin: (mockLogin: ReturnType<typeof vi.fn>, customResponse?: Partial<TAuthLoginRes>) => {
    mockLogin.mockResolvedValue({
      ...mockAuthLoginResponse,
      ...customResponse,
    });
  },

  setupFailedLogin: (mockLogin: ReturnType<typeof vi.fn>, errorMessage = "Login failed") => {
    mockLogin.mockRejectedValue(new Error(errorMessage));
  },

  setupSuccessRegister: (mockRegister: ReturnType<typeof vi.fn>, customResponse?: Partial<TAuthLoginRes>) => {
    mockRegister.mockResolvedValue({
      ...mockAuthLoginResponse,
      ...customResponse,
    });
  },

  setupFailedRegister: (mockRegister: ReturnType<typeof vi.fn>, errorMessage = "Registration failed") => {
    mockRegister.mockRejectedValue(new Error(errorMessage));
  },
};
