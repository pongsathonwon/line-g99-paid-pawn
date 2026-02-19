import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext/AuthContext";
import PreventReRegister from "./PreventReRegister";
import type { TAuthContext } from "@/context/AuthContext/AuthContext";
import type { TUserInfo } from "@/api/endpoint/auth";

// ─── helpers ──────────────────────────────────────────────────────────────────

const MOCK_USER: TUserInfo = {
  id: "u1",
  custNo: "C001",
  fullname: "John Doe",
  idCard: "1234567890123",
  lineUid: "Uabc123",
  mobileNo: "0812345678",
  branchCode: "30",
  custType: "G",
  custStat: 1,
  isConsent: true,
  isVerified: true,
  birthDate: "1990-01-01",
  gender: "m",
};

const makeAuthContext = (auth: TAuthContext["auth"]): TAuthContext => ({
  auth,
  error: null,
  relogin: vi.fn(),
  loginStatus: { isPending: false, isSuccess: true, isError: false },
});

function renderPreventReRegister(
  authValue: TAuthContext,
  initialPath = "/register",
) {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/home" element={<div>home page</div>} />
          <Route
            path="/register"
            element={
              <PreventReRegister>
                <div>register content</div>
              </PreventReRegister>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

// ─── tests ────────────────────────────────────────────────────────────────────

describe("PreventReRegister", () => {
  describe("when NOT authenticated (auth is null)", () => {
    it("renders children", () => {
      renderPreventReRegister(makeAuthContext(null));
      expect(screen.getByText("register content")).toBeInTheDocument();
    });

    it("does not redirect to home", () => {
      renderPreventReRegister(makeAuthContext(null));
      expect(screen.queryByText("home page")).not.toBeInTheDocument();
    });
  });

  describe("when authenticated (already logged in)", () => {
    it("does not render children", () => {
      renderPreventReRegister(makeAuthContext(MOCK_USER));
      expect(screen.queryByText("register content")).not.toBeInTheDocument();
    });

    it("redirects to /home", () => {
      renderPreventReRegister(makeAuthContext(MOCK_USER));
      expect(screen.getByText("home page")).toBeInTheDocument();
    });
  });
});
