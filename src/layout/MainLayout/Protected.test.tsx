import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext/AuthContext";
import Protected from "./Protected";
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

/** Capture the current location.search so we can assert the redirect param */
function LocationCapture({ onCapture }: { onCapture: (s: string) => void }) {
  const loc = useLocation();
  onCapture(loc.search);
  return <div>splash page</div>;
}

function renderProtected(authValue: TAuthContext, initialPath = "/home") {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/" element={<div>splash page</div>} />
          <Route
            path="/home"
            element={
              <Protected>
                <div>protected content</div>
              </Protected>
            }
          />
          <Route
            path="/home/nested"
            element={
              <Protected>
                <div>nested content</div>
              </Protected>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

// ─── tests ────────────────────────────────────────────────────────────────────

describe("Protected", () => {
  describe("when authenticated", () => {
    it("renders children", () => {
      renderProtected(makeAuthContext(MOCK_USER));
      expect(screen.getByText("protected content")).toBeInTheDocument();
    });

    it("does not redirect to splash page", () => {
      renderProtected(makeAuthContext(MOCK_USER));
      expect(screen.queryByText("splash page")).not.toBeInTheDocument();
    });
  });

  describe("when NOT authenticated (auth is null)", () => {
    it("does not render children", () => {
      renderProtected(makeAuthContext(null));
      expect(screen.queryByText("protected content")).not.toBeInTheDocument();
    });

    it("redirects to splash page", () => {
      renderProtected(makeAuthContext(null));
      expect(screen.getByText("splash page")).toBeInTheDocument();
    });

    it("includes redirect param with the original path", () => {
      let capturedSearch = "";

      render(
        <AuthContext.Provider value={makeAuthContext(null)}>
          <MemoryRouter initialEntries={["/home"]}>
            <Routes>
              <Route
                path="/"
                element={
                  <LocationCapture
                    onCapture={(s) => {
                      capturedSearch = s;
                    }}
                  />
                }
              />
              <Route
                path="/home"
                element={
                  <Protected>
                    <div>protected content</div>
                  </Protected>
                }
              />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      expect(capturedSearch).toBe("?redirect=%2Fhome");
    });

    it("encodes nested path in redirect param", () => {
      let capturedSearch = "";

      render(
        <AuthContext.Provider value={makeAuthContext(null)}>
          <MemoryRouter initialEntries={["/home/nested"]}>
            <Routes>
              <Route
                path="/"
                element={
                  <LocationCapture
                    onCapture={(s) => {
                      capturedSearch = s;
                    }}
                  />
                }
              />
              <Route
                path="/home/nested"
                element={
                  <Protected>
                    <div>nested content</div>
                  </Protected>
                }
              />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      expect(capturedSearch).toBe("?redirect=%2Fhome%2Fnested");
    });
  });
});
