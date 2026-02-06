import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PawnInterestContextProvider from "./PawnInterestContextProvider";
import {
  usePawnInterest,
  usePawnInterestContext,
} from "./PawnInterest";
import * as AuthContext from "../AuthContext/AuthContext";
import * as PawnApi from "@/api/endpoint/pawn";
import type { TGetPawnInterestRes } from "@/api/endpoint/pawn";

// Mock the API
vi.mock("@/api/endpoint/pawn", () => ({
  getPawnInterest: vi.fn(),
}));

// Mock auth context
vi.mock("../AuthContext/AuthContext", () => ({
  useCustInfo: vi.fn(),
}));

const mockInterestResponse: TGetPawnInterestRes = {
  id: 123,
  createAt: "2024-01-01T00:00:00Z",
  pawnNumb: "P001",
  custCode: "0000000001234",
  branchCode: "B001",
  paidOrder: 1,
  dueDate: "2024-02-01",
  validBefore: "2024-02-15",
  baseFactor: 1.0,
  penaltyFactor: 0.5,
  factor: 1.5,
  baseInterest: 100,
  penaltyInterest: 50,
  totalInterest: 150,
  membDisc: 10,
  netInterest: 140,
  interestRate: 1.5,
  pawnPrice: 10000,
  fee: 50,
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <PawnInterestContextProvider>{children}</PawnInterestContextProvider>
    </QueryClientProvider>
  );
};

describe("PawnInterestContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("usePawnInterestContext", () => {
    it("should throw error when used outside provider", () => {
      expect(() => {
        renderHook(() => usePawnInterestContext());
      }).toThrow("pawn interest ctx provider required");
    });
  });

  describe("usePawnInterest", () => {
    it("should return initial state", () => {
      vi.mocked(AuthContext.useCustInfo).mockReturnValue({
        id: "ext-001",
        custNo: "0000000001234",
        fullname: "Test User",
        idCard: "1234567890123",
        lineUid: "U1234567890",
        mobileNo: "0812345678",
        branchCode: "30",
        custType: "G",
        custStat: 1,
        isConsent: true,
        isVerified: true,
        birthDate: "1990-01-01",
        gender: "m",
      });

      const { result } = renderHook(() => usePawnInterest(), {
        wrapper: createWrapper(),
      });

      expect(result.current.interest).toBeUndefined();
      expect(result.current.isIdle).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it("should fetch interest when getInterest is called", async () => {
      vi.mocked(AuthContext.useCustInfo).mockReturnValue({
        id: "ext-001",
        custNo: "0000000001234",
        fullname: "Test User",
        idCard: "1234567890123",
        lineUid: "U1234567890",
        mobileNo: "0812345678",
        branchCode: "30",
        custType: "G",
        custStat: 1,
        isConsent: true,
        isVerified: true,
        birthDate: "1990-01-01",
        gender: "m",
      });
      vi.mocked(PawnApi.getPawnInterest).mockResolvedValue(mockInterestResponse);

      const { result } = renderHook(() => usePawnInterest(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.getInterest("P001");
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(PawnApi.getPawnInterest).toHaveBeenCalledWith(
        { pawnNumb: "P001", custCode: "0000000001234" },
        expect.anything()
      );
      expect(result.current.interest).toEqual(mockInterestResponse);
    });

    it("should throw error when custCode is not available", () => {
      vi.mocked(AuthContext.useCustInfo).mockReturnValue(null);

      const { result } = renderHook(() => usePawnInterest(), {
        wrapper: createWrapper(),
      });

      expect(() => {
        result.current.getInterest("P001");
      }).toThrow("custCode is required");
    });

    it("should handle API error", async () => {
      vi.mocked(AuthContext.useCustInfo).mockReturnValue({
        id: "ext-001",
        custNo: "0000000001234",
        fullname: "Test User",
        idCard: "1234567890123",
        lineUid: "U1234567890",
        mobileNo: "0812345678",
        branchCode: "30",
        custType: "G",
        custStat: 1,
        isConsent: true,
        isVerified: true,
        birthDate: "1990-01-01",
        gender: "m",
      });
      vi.mocked(PawnApi.getPawnInterest).mockRejectedValue(
        new Error("API Error")
      );

      const { result } = renderHook(() => usePawnInterest(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.getInterest("P001");
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe("PawnInterestContextProvider", () => {
    it("should render children", () => {
      vi.mocked(AuthContext.useCustInfo).mockReturnValue({
        id: "ext-001",
        custNo: "0000000001234",
        fullname: "Test User",
        idCard: "1234567890123",
        lineUid: "U1234567890",
        mobileNo: "0812345678",
        branchCode: "30",
        custType: "G",
        custStat: 1,
        isConsent: true,
        isVerified: true,
        birthDate: "1990-01-01",
        gender: "m",
      });

      const queryClient = new QueryClient();

      const { getByText } = render(
        <QueryClientProvider client={queryClient}>
          <PawnInterestContextProvider>
            <div>Test Child</div>
          </PawnInterestContextProvider>
        </QueryClientProvider>
      );

      expect(getByText("Test Child")).toBeInTheDocument();
    });
  });
});
