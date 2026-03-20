import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRegisterMutation } from "./useRegisterMutation";
import { REGISTER_API } from "@/api/endpoint/register";
import ToastContextProvider from "@/context/ToastContext/ToastContextProvider";
import { MultiStepFormContextProvider } from "@/context/MultistepFormContext/MultiStepFormContext";
import type { PropsWithChildren } from "react";
import type { TRegisterReq, TRegisterRequestReq } from "@/types/register";

vi.mock("@/api/endpoint/register", () => ({
  REGISTER_API: {
    registerUser: vi.fn(),
    registerUserWithFallback: vi.fn(),
    updateUser: vi.fn(),
    registerRequest: vi.fn(),
  },
}));

const mockRegisterRes = {
  id: "1",
  custNo: "000001",
  fullname: "ทดสอบ ระบบ",
  lineUid: "U123456",
  mobileNo: "0800000000",
  isVerified: true,
};

const mockRegisterRequestRes = {
  lineUid: "U123456",
  custNo: "000001",
  branchCode: "01",
  isConsent: true,
  isVerified: false,
  status: "PENDING" as const,
};

const mockRegisterReq: TRegisterReq = {
  lineUid: "U123456",
  custNo: "000001",
  fullname: "ทดสอบ ระบบ",
  idCard: "1234567890123",
  birthDate: "1990-01-01",
  mobileNo: "0800000000",
  branchCode: "01",
  custType: "G",
  custStat: 1,
  nationCode: "TH",
  isConsent: true,
  isVerified: true,
  dataFrom: "HUG_exist",
  currentPoint: 100,
  totalBuy: 5000,
};

const mockRegisterRequestReq: TRegisterRequestReq = {
  lineUid: "U123456",
  custNo: "000001",
  isConsent: true,
};

function createWrapper(totalPage = 3) {
  let queryClient: QueryClient;

  const Wrapper = ({ children }: PropsWithChildren) => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    });
    return (
      <QueryClientProvider client={queryClient}>
        <ToastContextProvider>
          <MultiStepFormContextProvider totalPage={totalPage}>
            {children}
          </MultiStepFormContextProvider>
        </ToastContextProvider>
      </QueryClientProvider>
    );
  };

  return Wrapper;
}

describe("useRegisterMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("thai mode", () => {
    it("calls updateUser and advances to next step on success", async () => {
      vi.mocked(REGISTER_API.updateUser).mockResolvedValue(mockRegisterRes);

      const { result } = renderHook(() => useRegisterMutation("thai"), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate(mockRegisterReq);
      });

      await waitFor(() => {
        expect(REGISTER_API.updateUser).toHaveBeenCalledWith(mockRegisterReq);
        expect(REGISTER_API.registerUser).not.toHaveBeenCalled();
        expect(REGISTER_API.registerRequest).not.toHaveBeenCalled();
      });
    });

    it("passes dataFrom, currentPoint and totalBuy to updateUser", async () => {
      vi.mocked(REGISTER_API.updateUser).mockResolvedValue(mockRegisterRes);

      const { result } = renderHook(() => useRegisterMutation("thai"), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate(mockRegisterReq);
      });

      await waitFor(() => {
        expect(REGISTER_API.updateUser).toHaveBeenCalledWith(
          expect.objectContaining({
            dataFrom: "HUG_exist",
            currentPoint: 100,
            totalBuy: 5000,
          }),
        );
      });
    });

    it("sets isPending to true while updateUser is in-flight", async () => {
      vi.mocked(REGISTER_API.updateUser).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockRegisterRes), 100),
          ),
      );

      const { result } = renderHook(() => useRegisterMutation("thai"), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);

      act(() => {
        result.current.mutate(mockRegisterReq);
      });

      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });
    });

    it("sets isPending to false after updateUser error", async () => {
      vi.mocked(REGISTER_API.updateUser).mockRejectedValue(
        new Error("อัปเดตข้อมูลไม่สำเร็จ"),
      );

      const { result } = renderHook(() => useRegisterMutation("thai"), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate(mockRegisterReq);
      });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(REGISTER_API.updateUser).toHaveBeenCalledOnce();
    });
  });

  describe("foreign mode", () => {
    it("calls registerUserWithFallback and does NOT call updateUser or registerRequest", async () => {
      vi.mocked(REGISTER_API.registerUserWithFallback).mockResolvedValue(mockRegisterRes);

      const { result } = renderHook(() => useRegisterMutation("foreign"), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate(mockRegisterReq);
      });

      await waitFor(() => {
        expect(REGISTER_API.registerUserWithFallback).toHaveBeenCalledWith(mockRegisterReq);
        expect(REGISTER_API.updateUser).not.toHaveBeenCalled();
        expect(REGISTER_API.registerRequest).not.toHaveBeenCalled();
      });
    });
  });

  describe("foreign-counter mode", () => {
    it("calls registerRequest and NOT registerUser on success", async () => {
      vi.mocked(REGISTER_API.registerRequest).mockResolvedValue(
        mockRegisterRequestRes,
      );

      const { result } = renderHook(
        () => useRegisterMutation("foreign-counter"),
        { wrapper: createWrapper() },
      );

      act(() => {
        result.current.mutate(mockRegisterRequestReq);
      });

      await waitFor(() => {
        expect(REGISTER_API.registerRequest).toHaveBeenCalledWith(
          mockRegisterRequestReq,
        );
        expect(REGISTER_API.registerUser).not.toHaveBeenCalled();
        expect(REGISTER_API.updateUser).not.toHaveBeenCalled();
      });
    });

    it("sets isPending to true while registerRequest is in-flight", async () => {
      vi.mocked(REGISTER_API.registerRequest).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockRegisterRequestRes), 100),
          ),
      );

      const { result } = renderHook(
        () => useRegisterMutation("foreign-counter"),
        { wrapper: createWrapper() },
      );

      expect(result.current.isPending).toBe(false);

      act(() => {
        result.current.mutate(mockRegisterRequestReq);
      });

      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });
    });

    it("sets isPending to false after registerRequest error", async () => {
      vi.mocked(REGISTER_API.registerRequest).mockRejectedValue(
        new Error("เกิดข้อผิดพลาด"),
      );

      const { result } = renderHook(
        () => useRegisterMutation("foreign-counter"),
        { wrapper: createWrapper() },
      );

      act(() => {
        result.current.mutate(mockRegisterRequestReq);
      });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(REGISTER_API.registerRequest).toHaveBeenCalledOnce();
    });
  });
});
