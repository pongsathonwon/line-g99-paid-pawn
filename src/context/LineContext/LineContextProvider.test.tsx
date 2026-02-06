import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { liff } from "@line/liff";
import LineContextProvider from "./LineContextProvider";
import * as ToastContext from "../ToastContext/ToastContext";

// Mock the entire LIFF module
vi.mock("@line/liff", () => ({
  liff: {
    init: vi.fn(),
    login: vi.fn(),
    isLoggedIn: vi.fn(),
    getProfile: vi.fn(),
  },
}));

// Mock environment variables
vi.stubEnv("VITE_LIFF_ID", "test-liff-id");

describe("test LineContextProvider", () => {
  const mockToast = {
    toasts: [],
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    addToast: vi.fn(),
    removeToast: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(ToastContext, "useToast").mockReturnValue(mockToast);
  });

  it("should initialize LIFF and login when user is logged in", async () => {
    const mockProfile = {
      displayName: "Test User",
      userId: "U1234567890",
      pictureUrl: "https://example.com/picture.jpg",
    };

    // Setup mocks
    vi.mocked(liff.init).mockResolvedValue();
    vi.mocked(liff.isLoggedIn).mockReturnValue(true);
    vi.mocked(liff.getProfile).mockResolvedValue(mockProfile);

    render(
      <LineContextProvider>
        <div>Test Child</div>
      </LineContextProvider>
    );

    await waitFor(() => {
      expect(liff.init).toHaveBeenCalledWith({ liffId: "test-liff-id" });
      expect(liff.isLoggedIn).toHaveBeenCalled();
      expect(liff.getProfile).toHaveBeenCalled();
      expect(mockToast.success).toHaveBeenCalledWith("LINE Login Successful");
    });
  });

  it("should call liff.login when user is not logged in", async () => {
    vi.mocked(liff.init).mockResolvedValue();
    vi.mocked(liff.isLoggedIn).mockReturnValue(false);

    render(
      <LineContextProvider>
        <div>Test Child</div>
      </LineContextProvider>
    );

    await waitFor(() => {
      expect(liff.login).toHaveBeenCalled();
    });
  });

  it("should show error when LIFF ID is not set", async () => {
    vi.stubEnv("VITE_LIFF_ID", "");

    render(
      <LineContextProvider>
        <div>Test Child</div>
      </LineContextProvider>
    );

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        "LIFF ID is not set in environment variables."
      );
    });
  });

  it("should handle LIFF initialization error", async () => {
    const error = new Error("Init failed");
    vi.mocked(liff.init).mockRejectedValue(error);

    render(
      <LineContextProvider>
        <div>Test Child</div>
      </LineContextProvider>
    );

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledOnce();
    });
  });

  it("should handle profile fetch error", async () => {
    const error = new Error("Profile fetch failed");
    vi.mocked(liff.init).mockResolvedValue();
    vi.mocked(liff.isLoggedIn).mockReturnValue(true);
    vi.mocked(liff.getProfile).mockRejectedValue(error);

    render(
      <LineContextProvider>
        <div>Test Child</div>
      </LineContextProvider>
    );

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledOnce();
    });
  });
});
