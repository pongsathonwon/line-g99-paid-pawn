/**
 * Edge cases & UI (cases 1, 2, 5, 10, 11, 12, 13, 14)
 * - Gate 1 pass-through (due / due-soon)
 * - id not in cache → falls through to Gate 2
 * - id undefined → getInterest never called
 * - custCode null → cache miss, falls through
 * - interest still pending → no premature block
 * - NotPayable UI: message text and home link href
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

function makePawnInterestCtx(isSuccess = false) {
  return {
    data: undefined,
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

function makePawn(pawnNumb: string, nextPaidDate: string): TGetManyPawmRes {
  return { pawnNumb, nextPaidDate, goodWeight: 10, pawnPrice: 5000, interest: 100, interestMonth: 1 };
}

// ─── render helpers ───────────────────────────────────────────────────────────

type RenderOptions = {
  path?: string;
  cachedPawns?: TGetManyPawmRes[];
  custCode?: string | null;
  isSuccess?: boolean;
};

function renderLoader({ path = `/home/${PAWN_NUMB}`, cachedPawns, custCode = CUST_CODE, isSuccess = false }: RenderOptions = {}) {
  const queryClient = new QueryClient();
  if (cachedPawns) {
    queryClient.setQueryData(["pawn", "cust", custCode], cachedPawns);
  }

  const user = custCode ? { ...MOCK_USER, custNo: custCode } : null;

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={makeAuthCtx(user)}>
        <PawnInterestContext.Provider value={makePawnInterestCtx(isSuccess)}>
          <MemoryRouter initialEntries={[path]}>
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

describe("PawnInterestLoader — edge cases & UI", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("case 1 — cache present, status 'due' → pass-through", () => {
    const pawn = makePawn(PAWN_NUMB, dayjs().subtract(3, "day").format("YYYY-MM-DD"));

    it("renders children", () => {
      renderLoader({ cachedPawns: [pawn] });
      expect(screen.getByText("children content")).toBeInTheDocument();
    });

    it("calls getInterest", () => {
      renderLoader({ cachedPawns: [pawn] });
      expect(mockGetInterest).toHaveBeenCalledWith(PAWN_NUMB);
    });
  });

  describe("case 2 — cache present, status 'due-soon' → pass-through", () => {
    const pawn = makePawn(PAWN_NUMB, dayjs().add(4, "day").format("YYYY-MM-DD"));

    it("renders children", () => {
      renderLoader({ cachedPawns: [pawn] });
      expect(screen.getByText("children content")).toBeInTheDocument();
    });

    it("calls getInterest", () => {
      renderLoader({ cachedPawns: [pawn] });
      expect(mockGetInterest).toHaveBeenCalledWith(PAWN_NUMB);
    });
  });

  describe("case 5 — cache present but pawnNumb not found", () => {
    const otherPawn = makePawn("P999", dayjs().add(10, "day").format("YYYY-MM-DD"));

    it("renders children (falls through to Gate 2 pending state)", () => {
      renderLoader({ cachedPawns: [otherPawn] });
      expect(screen.getByText("children content")).toBeInTheDocument();
    });

    it("still calls getInterest", () => {
      renderLoader({ cachedPawns: [otherPawn] });
      expect(mockGetInterest).toHaveBeenCalledWith(PAWN_NUMB);
    });
  });

  describe("case 10 — NotPayable message text", () => {
    const pawn = makePawn(PAWN_NUMB, dayjs().add(10, "day").format("YYYY-MM-DD"));

    it("displays the correct Thai message", () => {
      renderLoader({ cachedPawns: [pawn] });
      expect(screen.getByText("รายการนี้ยังไม่ถึงกำหนดชำระดอกเบี้ย")).toBeInTheDocument();
    });
  });

  describe("case 11 — NotPayable home link", () => {
    const pawn = makePawn(PAWN_NUMB, dayjs().add(10, "day").format("YYYY-MM-DD"));

    it("home link points to /home", () => {
      renderLoader({ cachedPawns: [pawn] });
      const link = screen.getByText("กลับหน้าหลัก").closest("a");
      expect(link).toHaveAttribute("href", "/home");
    });
  });

  describe("case 12 — id is undefined (no :id param)", () => {
    it("does NOT call getInterest", () => {
      const queryClient = new QueryClient();
      render(
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={makeAuthCtx(MOCK_USER)}>
            <PawnInterestContext.Provider value={makePawnInterestCtx()}>
              <MemoryRouter initialEntries={["/home"]}>
                <Routes>
                  <Route
                    path="/home"
                    element={
                      <PawnInterestLoader>
                        <div>children content</div>
                      </PawnInterestLoader>
                    }
                  />
                </Routes>
              </MemoryRouter>
            </PawnInterestContext.Provider>
          </AuthContext.Provider>
        </QueryClientProvider>,
      );
      expect(mockGetInterest).not.toHaveBeenCalled();
    });
  });

  describe("case 13 — custCode null (unauthenticated)", () => {
    it("falls through and renders children while interest is pending", () => {
      renderLoader({ custCode: null });
      expect(screen.getByText("children content")).toBeInTheDocument();
    });
  });

  describe("case 14 — interest still pending (isSuccess=false)", () => {
    it("renders children without blocking", () => {
      renderLoader({ isSuccess: false });
      expect(screen.getByText("children content")).toBeInTheDocument();
    });

    it("does NOT show not-payable message", () => {
      renderLoader({ isSuccess: false });
      expect(
        screen.queryByText("รายการนี้ยังไม่ถึงกำหนดชำระดอกเบี้ย"),
      ).not.toBeInTheDocument();
    });
  });
});
