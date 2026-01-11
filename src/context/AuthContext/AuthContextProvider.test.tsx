import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import * as LineContext from "../LineContext/LineContext";
import AuthContextProvider from "./AuthContextProvider";
import { useAuthLogin } from "@/hook/mutation/useAuthLogin";
import { mockAuthLoginResponse } from "@/test/setup/auth-api-mock";
import LineContextProvider from "../LineContext/LineContextProvider";
import ToastContextProvider from "../ToastContext/ToastContextProvider";

// mock hook

// Mock auth-context-helper
vi.mock("./auth-context-helper", () => ({
  registerAxiosTokenBearer: vi.fn(() => vi.fn()),
}));

// Mock the useAuthLogin hook at the top of your test file
vi.mock("@/hook/mutation/useAuthLogin", () => ({
  useAuthLogin: vi.fn(),
}));

describe("AuthContextProvider", () => {
  const mockLogin = vi.fn();
  describe("test success line login", () => {
    beforeEach(() => {
      vi.clearAllMocks();

      vi.spyOn(LineContext, "useLineContext").mockResolvedValue({
        lineCtx: {
          isLogin: true,
          profile: {
            displayName: "Test User",
            userId: "U1234567890",
            pictureUrl: "https://example.com/picture.jpg",
          },
        },
      });

      vi.mocked(useAuthLogin).mockReturnValue({
        auth: mockAuthLoginResponse.userInfo,
        error: null,
        login: mockLogin,
        isPending: false,
        isSuccess: true,
        isError: false,
      });
    });

    it("should call login when uid is available", async () => {
      // 3. NOW render (after mocks are set up)
      render(<AuthContextProvider />);

      // 4. Assert
      await waitFor(() => {
        expect(mockLogin).not.toBeCalled();
      });
    });
  });

  describe("test failed line login ", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.spyOn(LineContext, "useLineContext").mockRejectedValue({
        lineCtx: {
          isLogin: false,
          profile: null,
        },
      });
      vi.mocked(useAuthLogin).mockReturnValue({
        auth: null,
        error: "login failed",
        login: mockLogin,
        isPending: false,
        isSuccess: true,
        isError: false,
      });
    });

    it("should not call login when uid is not available", async () => {
      render(
        <AuthContextProvider>
          <div>Test</div>
        </AuthContextProvider>
      );

      await waitFor(() => {
        expect(mockLogin).not.toHaveBeenCalled();
      });
    });
  });
});
