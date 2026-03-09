/**
 * Gate 1 — cache present, pawn is NOT payable (cases 3 & 4)
 * Status "normal" or "overdue" → block children, show NotPayable UI, skip getInterest call
 */
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PawnInterestContext } from "@/context/PawnInterestContext/PawnInterest";
import { AuthContext } from "@/context/AuthContext/AuthContext";
import PawnInterestLoader from "./PawnInterestLoader";
import type { TGetManyPawmRes } from "@/api/endpoint/pawn";
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

const mockGetInterest = vi.fn();

const makePawnInterestCtx = () => ({
  data: undefined,
  getInterest: mockGetInterest,
  isIdle: true,
  isPaused: false,
  isSuccess: false,
  isError: false,
  error: null,
  isPending: false,
  isSettled: false,
  variables: undefined,
  context: undefined,
  failureCount: 0,
  failureReason: null,
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
  reset: vi.fn(),
  submittedAt: 0,
  status: "idle" as const,
});

// ─── helpers ──────────────────────────────────────────────────────────────────

function makePawn(nextPaidDate: string): TGetManyPawmRes {
  return {
    pawnNumb: PAWN_NUMB,
    nextPaidDate,
    goodWeight: 10,
    pawnPrice: 5000,
    interest: 100,
    interestMonth: 1,
  };
}

function renderLoader(pawn: TGetManyPawmRes) {
  const queryClient = new QueryClient();
  queryClient.setQueryData(["pawn", "cust", CUST_CODE], [pawn]);

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={makeAuthCtx(MOCK_USER)}>
        <PawnInterestContext.Provider value={makePawnInterestCtx()}>
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

describe("PawnInterestLoader — Gate 1: cache present, not payable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("case 3 — pawn status is 'normal' (dueDate > 7 days away)", () => {
    const pawn = makePawn(dayjs().add(10, "day").format("YYYY-MM-DD"));

    it("does NOT render children", () => {
      renderLoader(pawn);
      expect(screen.queryByText("children content")).not.toBeInTheDocument();
    });

    it("shows the not-payable helper message", () => {
      renderLoader(pawn);
      expect(
        screen.getByText("รายการนี้ยังไม่ถึงกำหนดชำระดอกเบี้ย"),
      ).toBeInTheDocument();
    });

    it("shows the home navigation link", () => {
      renderLoader(pawn);
      expect(screen.getByText("กลับหน้าหลัก")).toBeInTheDocument();
    });

    it("does NOT call getInterest", () => {
      renderLoader(pawn);
      expect(mockGetInterest).not.toHaveBeenCalled();
    });
  });

  describe("case 4 — pawn status is 'overdue' (dueDate > 7 days past)", () => {
    const pawn = makePawn(dayjs().subtract(10, "day").format("YYYY-MM-DD"));

    it("does NOT render children", () => {
      renderLoader(pawn);
      expect(screen.queryByText("children content")).not.toBeInTheDocument();
    });

    it("shows the not-payable helper message", () => {
      renderLoader(pawn);
      expect(
        screen.getByText("รายการนี้ยังไม่ถึงกำหนดชำระดอกเบี้ย"),
      ).toBeInTheDocument();
    });

    it("shows the home navigation link", () => {
      renderLoader(pawn);
      expect(screen.getByText("กลับหน้าหลัก")).toBeInTheDocument();
    });

    it("does NOT call getInterest", () => {
      renderLoader(pawn);
      expect(mockGetInterest).not.toHaveBeenCalled();
    });
  });
});
