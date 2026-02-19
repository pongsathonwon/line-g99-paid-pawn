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

  describe("non foreign-counter mode (thai / foreign)", () => {
    it("calls registerUser and advances to next step on success", async () => {
      vi.mocked(REGISTER_API.registerUser).mockResolvedValue(mockRegisterRes);

      const { result } = renderHook(() => useRegisterMutation("thai"), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate(mockRegisterReq);
      });

      await waitFor(() => {
        expect(REGISTER_API.registerUser).toHaveBeenCalledWith(mockRegisterReq);
        expect(REGISTER_API.registerRequest).not.toHaveBeenCalled();
      });
    });

    it("does NOT call registerRequest for thai mode", async () => {
      vi.mocked(REGISTER_API.registerUser).mockResolvedValue(mockRegisterRes);

      const { result } = renderHook(() => useRegisterMutation("foreign"), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate(mockRegisterReq);
      });

      await waitFor(() => {
        expect(REGISTER_API.registerRequest).not.toHaveBeenCalled();
      });
    });

    it("sets isPending to true while registerUser is in-flight", async () => {
      vi.mocked(REGISTER_API.registerUser).mockImplementation(
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

    it("sets isPending to false after registerUser error", async () => {
      vi.mocked(REGISTER_API.registerUser).mockRejectedValue(
        new Error("ลงทะเบียนไม่สำเร็จ"),
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

      expect(REGISTER_API.registerUser).toHaveBeenCalledOnce();
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
