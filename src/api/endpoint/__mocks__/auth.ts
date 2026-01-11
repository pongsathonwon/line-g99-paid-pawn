import { vi } from "vitest";
import type { TAuthLoginRes, TUserInfo } from "../auth";

// Mock data that can be reused
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

// Mock functions
export const mockLogin = vi.fn();
export const mockRegister = vi.fn();

// Mock AUTH_API object
export const AUTH_API = {
  login: mockLogin,
  register: mockRegister,
};

// Helper to reset all mocks
export const resetAuthApiMocks = () => {
  mockLogin.mockReset();
  mockRegister.mockReset();
};

// Helper to setup success login
export const setupSuccessLogin = () => {
  mockLogin.mockResolvedValue(mockAuthLoginResponse);
};

// Helper to setup failed login
export const setupFailedLogin = (errorMessage = "Login failed") => {
  mockLogin.mockRejectedValue(new Error(errorMessage));
};

// Helper to setup success register
export const setupSuccessRegister = () => {
  mockRegister.mockResolvedValue(mockAuthLoginResponse);
};

// Helper to setup failed register
export const setupFailedRegister = (errorMessage = "Registration failed") => {
  mockRegister.mockRejectedValue(new Error(errorMessage));
};
