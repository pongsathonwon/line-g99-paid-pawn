import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useRegisterFormState } from "./useRegisterFormState";
import type { TOtpRequestRes, TSearchUserRes } from "@/types/register";

const MOCK_USER: TSearchUserRes = {
  custNo: "C001",
  fullname: "John Doe",
  idCard: "1234567890123",
  birthDate: "1990-01-01",
  mobileNo: "0812345678",
  branchCode: "B01",
  custType: "1",
  custStat: 1,
  nationCode: "1",
  gender: 'x',
  currentPoint: 0,
  totalBuy: 0
};

const MOCK_OTP: TOtpRequestRes = {
  status: "success",
  token: "token-abc",
  refno: "REF001",
};

describe("useRegisterFormState", () => {
  describe("initial state", () => {
    it("should initialise with null user and reqOtp", () => {
      const { result } = renderHook(() =>
        useRegisterFormState({ defaultSearchMethod: "idCard", includeOtp: true })
      );
      expect(result.current.user).toBeNull();
      expect(result.current.reqOtp).toBeNull();
    });

    it("should initialise searchMethod from config", () => {
      const { result } = renderHook(() =>
        useRegisterFormState({
          defaultSearchMethod: "mobileNumber",
          includeOtp: true,
        })
      );
      expect(result.current.searchMethod).toBe("mobileNumber");
    });

    it("should set isVerify=false when includeOtp=true", () => {
      const { result } = renderHook(() =>
        useRegisterFormState({ defaultSearchMethod: "idCard", includeOtp: true })
      );
      expect(result.current.isVerify).toBe(false);
    });

    it("should set isVerify=true when includeOtp=false", () => {
      const { result } = renderHook(() =>
        useRegisterFormState({
          defaultSearchMethod: "idCard",
          includeOtp: false,
        })
      );
      expect(result.current.isVerify).toBe(true);
    });

    it("should initialise isConsent=false", () => {
      const { result } = renderHook(() =>
        useRegisterFormState({ defaultSearchMethod: "idCard", includeOtp: true })
      );
      expect(result.current.isConsent).toBe(false);
    });

    it("mobileNo should be null when user is null", () => {
      const { result } = renderHook(() =>
        useRegisterFormState({ defaultSearchMethod: "idCard", includeOtp: true })
      );
      expect(result.current.mobileNo).toBeNull();
    });
  });

  describe("setUser", () => {
    it("should update user and expose mobileNo", () => {
      const { result } = renderHook(() =>
        useRegisterFormState({ defaultSearchMethod: "idCard", includeOtp: true })
      );
      act(() => {
        result.current.setUser(MOCK_USER);
      });
      expect(result.current.user).toEqual(MOCK_USER);
      expect(result.current.mobileNo).toBe("0812345678");
    });
  });

  describe("setSearchMethod", () => {
    it("should update searchMethod", () => {
      const { result } = renderHook(() =>
        useRegisterFormState({ defaultSearchMethod: "idCard", includeOtp: true })
      );
      act(() => {
        result.current.setSearchMethod("custCode");
      });
      expect(result.current.searchMethod).toBe("custCode");
    });
  });

  describe("setOtp", () => {
    it("should store the OTP response", () => {
      const { result } = renderHook(() =>
        useRegisterFormState({ defaultSearchMethod: "idCard", includeOtp: true })
      );
      act(() => {
        result.current.setOtp(MOCK_OTP);
      });
      expect(result.current.reqOtp).toEqual(MOCK_OTP);
    });

    it("should set isVerify=false after setOtp", () => {
      const { result } = renderHook(() =>
        useRegisterFormState({ defaultSearchMethod: "idCard", includeOtp: true })
      );
      // manually verify first, then call setOtp
      act(() => {
        result.current.setVerified(true);
      });
      expect(result.current.isVerify).toBe(true);
      act(() => {
        result.current.setOtp(MOCK_OTP);
      });
      expect(result.current.isVerify).toBe(false);
    });
  });

  describe("setVerified", () => {
    it("should update isVerify", () => {
      const { result } = renderHook(() =>
        useRegisterFormState({ defaultSearchMethod: "idCard", includeOtp: true })
      );
      act(() => {
        result.current.setVerified(true);
      });
      expect(result.current.isVerify).toBe(true);
    });
  });

  describe("setConsent", () => {
    it("should update isConsent", () => {
      const { result } = renderHook(() =>
        useRegisterFormState({ defaultSearchMethod: "idCard", includeOtp: true })
      );
      act(() => {
        result.current.setConsent(true);
      });
      expect(result.current.isConsent).toBe(true);
    });
  });

  describe("resetForm", () => {
    it("should clear user, reqOtp and isConsent", () => {
      const { result } = renderHook(() =>
        useRegisterFormState({ defaultSearchMethod: "idCard", includeOtp: true })
      );
      act(() => {
        result.current.setUser(MOCK_USER);
        result.current.setOtp(MOCK_OTP);
        result.current.setConsent(true);
      });
      act(() => {
        result.current.resetForm();
      });
      expect(result.current.user).toBeNull();
      expect(result.current.reqOtp).toBeNull();
      expect(result.current.isConsent).toBe(false);
    });

    it("should reset isVerify=false when includeOtp=true", () => {
      const { result } = renderHook(() =>
        useRegisterFormState({ defaultSearchMethod: "idCard", includeOtp: true })
      );
      act(() => {
        result.current.setVerified(true);
        result.current.resetForm();
      });
      expect(result.current.isVerify).toBe(false);
    });

    it("should reset isVerify=true when includeOtp=false", () => {
      const { result } = renderHook(() =>
        useRegisterFormState({
          defaultSearchMethod: "idCard",
          includeOtp: false,
        })
      );
      act(() => {
        result.current.setVerified(false);
        result.current.resetForm();
      });
      expect(result.current.isVerify).toBe(true);
    });
  });
});
