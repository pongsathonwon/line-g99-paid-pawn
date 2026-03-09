/**
 * Gate 2 — no cache (deep-link), guard from interest result's dueDate (cases 6, 7, 8, 9)
 * getInterest is always called; after it resolves the dueDate determines whether to block.
 */
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PawnInterestContext } from "@/context/PawnInterestContext/PawnInterest";
import { AuthContext } from "@/context/AuthContext/AuthContext";
import PawnInterestLoader from "./PawnInterestLoader";
import type { TGetPawnInterestRes } from "@/api/endpoint/pawn";
import type { TAuthContext } from "@/context/AuthContext/AuthContext";
import type { TUserInfo } from "@/api/endpoint/auth";
import dayjs from "dayjs";

// ─── constants ────────────────────────────────────────────────────────────────

const PAWN_NUMB = "P001";
const CUST_CODE = "C001";

const MOCK_USER: TUserInfo = {
  id: "u1",
  custNo: CUST_CODE,
  fullname: "Test User",
  idCard: "1234567890123",
  lineUid: "Uabc",
  mobileNo: "0812345678",
  branchCode: "30",
  custType: "G",
  custStat: 1,
  isConsent: true,
  isVerified: true,
  birthDate: "1990-01-01",
  gender: "m",
};

const makeAuthCtx = (auth: TAuthContext["auth"]): TAuthContext => ({
  auth,
  error: null,
  relogin: vi.fn(),
  loginStatus: { isPending: false, isSuccess: true, isError: false },
});

function makeInterestResult(dueDate: string): TGetPawnInterestRes {
  return {
    id: 1,
    createAt: "2024-01-01T00:00:00Z",
    pawnNumb: PAWN_NUMB,
    custCode: CUST_CODE,
    branchCode: "B001",
    paidOrder: 1,
    dueDate,
    validBefore: dueDate,
    baseFactor: 1,
    penaltyFactor: 0,
    factor: 1,
    baseInterest: 100,
    penaltyInterest: 0,
    totalInterest: 100,
    membDisc: 0,
    netInterest: 100,
    interestRate: 1.5,
    pawnPrice: 5000,
    fee: 0,
  };
}

const mockGetInterest = vi.fn();

function makePawnInterestCtx(
  interest: TGetPawnInterestRes | undefined,
  isSuccess: boolean,
) {
  return {
    data: interest,
    getInterest: mockGetInterest,
    isIdle: !isSuccess,
    isPaused: false,
    isSuccess,
    isError: false,
    error: null,
    isPending: false,
    isSettled: isSuccess,
    variables: undefined,
    context: undefined,
    failureCount: 0,
    failureReason: null,
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    reset: vi.fn(),
    submittedAt: 0,
    status: (isSuccess ? "success" : "idle") as "success" | "idle",
  };
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function renderLoader(interest: TGetPawnInterestRes | undefined, isSuccess: boolean) {
  // No cache — simulates deep-link (empty QueryClient)
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={makeAuthCtx(MOCK_USER)}>
        <PawnInterestContext.Provider value={makePawnInterestCtx(interest, isSuccess)}>
          <MemoryRouter initialEntries={[`/home/${PAWN_NUMB}`]}>
            <Routes>
              <Route
                path="/home/:id"
                element={
                  <PawnInterestLoader>
                    <div>children content</div>
                  </PawnInterestLoader>
                }
              />
              <Route path="/home" element={<div>home page</div>} />
            </Routes>
          </MemoryRouter>
        </PawnInterestContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>,
  );
}

// ─── tests ────────────────────────────────────────────────────────────────────

describe("PawnInterestLoader — Gate 2: no cache (deep-link), interest result", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("case 6 — interest dueDate maps to 'due' (0 to -7 days)", () => {
    const interest = makeInterestResult(dayjs().subtract(3, "day").format("YYYY-MM-DD"));

    it("renders children", () => {
      renderLoader(interest, true);
      expect(screen.getByText("children content")).toBeInTheDocument();
    });

    it("does NOT show the not-payable message", () => {
      renderLoader(interest, true);
      expect(
        screen.queryByText("รายการนี้ยังไม่ถึงกำหนดชำระดอกเบี้ย"),
      ).not.toBeInTheDocument();
    });
  });

  describe("case 7 — interest dueDate maps to 'due-soon' (1–7 days away)", () => {
    const interest = makeInterestResult(dayjs().add(4, "day").format("YYYY-MM-DD"));

    it("renders children", () => {
      renderLoader(interest, true);
      expect(screen.getByText("children content")).toBeInTheDocument();
    });

    it("does NOT show the not-payable message", () => {
      renderLoader(interest, true);
      expect(
        screen.queryByText("รายการนี้ยังไม่ถึงกำหนดชำระดอกเบี้ย"),
      ).not.toBeInTheDocument();
    });
  });

  describe("case 8 — interest dueDate maps to 'normal' (> 7 days away)", () => {
    const interest = makeInterestResult(dayjs().add(10, "day").format("YYYY-MM-DD"));

    it("does NOT render children", () => {
      renderLoader(interest, true);
      expect(screen.queryByText("children content")).not.toBeInTheDocument();
    });

    it("shows the not-payable helper message", () => {
      renderLoader(interest, true);
      expect(
        screen.getByText("รายการนี้ยังไม่ถึงกำหนดชำระดอกเบี้ย"),
      ).toBeInTheDocument();
    });

    it("shows the home navigation link", () => {
      renderLoader(interest, true);
      expect(screen.getByText("กลับหน้าหลัก")).toBeInTheDocument();
    });
  });

  describe("case 9 — interest dueDate maps to 'overdue' (> 7 days past)", () => {
    const interest = makeInterestResult(dayjs().subtract(10, "day").format("YYYY-MM-DD"));

    it("does NOT render children", () => {
      renderLoader(interest, true);
      expect(screen.queryByText("children content")).not.toBeInTheDocument();
    });

    it("shows the not-payable helper message", () => {
      renderLoader(interest, true);
      expect(
        screen.getByText("รายการนี้ยังไม่ถึงกำหนดชำระดอกเบี้ย"),
      ).toBeInTheDocument();
    });

    it("shows the home navigation link", () => {
      renderLoader(interest, true);
      expect(screen.getByText("กลับหน้าหลัก")).toBeInTheDocument();
    });
  });
});
