import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useScreenshot } from "./useScreenshot";

const mockToast = {
  error: vi.fn(),
  success: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  addToast: vi.fn(),
  removeToast: vi.fn(),
  toasts: [],
};

vi.mock("@/context/ToastContext/ToastContext", () => ({
  useToast: () => mockToast,
}));

const mockHtml2Canvas = vi.fn();
vi.mock("html2canvas", () => ({
  default: mockHtml2Canvas,
}));

describe("useScreenshot", () => {
  describe("initialization", () => {
    it("should return captureRef, isCapturing, and captureScreenshot", () => {
      const { result } = renderHook(() => useScreenshot());

      expect(result.current.captureRef).toBeDefined();
      expect(result.current.isCapturing).toBe(false);
      expect(typeof result.current.captureScreenshot).toBe("function");
    });

    it("should initialize with isCapturing as false", () => {
      const { result } = renderHook(() => useScreenshot());

      expect(result.current.isCapturing).toBe(false);
    });

    it("should provide a ref object", () => {
      const { result } = renderHook(() => useScreenshot());

      expect(result.current.captureRef.current).toBeNull();
    });
  });

  describe("captureScreenshot", () => {
    it("should do nothing if captureRef.current is null", async () => {
      const { result } = renderHook(() => useScreenshot());

      await act(async () => {
        await result.current.captureScreenshot();
      });

      expect(result.current.isCapturing).toBe(false);
    });
  });

  describe("options", () => {
    it("should accept custom options", () => {
      const options = {
        backgroundColor: "#000000",
        scale: 3,
        fileNamePrefix: "custom-screenshot",
      };

      const { result } = renderHook(() => useScreenshot(options));

      expect(result.current.captureRef).toBeDefined();
      expect(result.current.isCapturing).toBe(false);
    });

    it("should use default options when none provided", () => {
      const { result } = renderHook(() => useScreenshot());

      expect(result.current.captureRef).toBeDefined();
      expect(result.current.isCapturing).toBe(false);
    });
  });

  describe("captureScreenshot with element", () => {
    let mockCanvas: HTMLCanvasElement;

    beforeEach(() => {
      mockCanvas = document.createElement("canvas");
      mockCanvas.toBlob = vi.fn((callback) => {
        const blob = new Blob(["test"], { type: "image/png" });
        callback(blob);
      });

      mockHtml2Canvas.mockResolvedValue(mockCanvas);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("should set isCapturing to true during capture", async () => {
      const { result } = renderHook(() => useScreenshot());

      const div = document.createElement("div");
      Object.defineProperty(result.current.captureRef, "current", {
        value: div,
        writable: true,
      });

      let capturingDuringExecution = false;

      mockHtml2Canvas.mockImplementation(async () => {
        capturingDuringExecution = result.current.isCapturing;
        return mockCanvas;
      });

      await act(async () => {
        await result.current.captureScreenshot();
      });
      waitFor(() => {
        expect(capturingDuringExecution).toBe(true);
        expect(result.current.isCapturing).toBe(false);
      });
    });

    it("should call html2canvas with correct options", async () => {
      const options = {
        backgroundColor: "#ff0000",
        scale: 4,
        fileNamePrefix: "test",
      };

      const { result } = renderHook(() => useScreenshot(options));

      const div = document.createElement("div");
      Object.defineProperty(result.current.captureRef, "current", {
        value: div,
        writable: true,
      });

      await act(async () => {
        await result.current.captureScreenshot();
      });

      expect(mockHtml2Canvas).toHaveBeenCalledWith(div, {
        backgroundColor: "#ff0000",
        scale: 4,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
    });

    it("should reset isCapturing to false after capture completes", async () => {
      const { result } = renderHook(() => useScreenshot());

      const div = document.createElement("div");
      Object.defineProperty(result.current.captureRef, "current", {
        value: div,
        writable: true,
      });

      await act(async () => {
        await result.current.captureScreenshot();
      });

      expect(result.current.isCapturing).toBe(false);
    });

    it("should reset isCapturing to false even if error occurs", async () => {
      mockHtml2Canvas.mockRejectedValue(new Error("Canvas error"));

      const { result } = renderHook(() => useScreenshot());

      const div = document.createElement("div");
      Object.defineProperty(result.current.captureRef, "current", {
        value: div,
        writable: true,
      });

      await act(async () => {
        await result.current.captureScreenshot();
      });

      expect(result.current.isCapturing).toBe(false);
    });

    it("should show error toast when blob creation fails", async () => {
      mockCanvas.toBlob = vi.fn((callback) => {
        callback(null);
      });

      const { result } = renderHook(() => useScreenshot());

      const div = document.createElement("div");
      Object.defineProperty(result.current.captureRef, "current", {
        value: div,
        writable: true,
      });

      await act(async () => {
        await result.current.captureScreenshot();
      });

      expect(mockToast.error).toHaveBeenCalledWith(
        "ไม่สามารถบันทึกภาพหน้าจอได้ กรุณาลองใหม่อีกครั้ง",
      );
    });

    it("should not show error toast when user cancels share dialog", async () => {
      const abortError = new Error("User cancelled");
      abortError.name = "AbortError";
      mockHtml2Canvas.mockRejectedValue(abortError);

      const { result } = renderHook(() => useScreenshot());

      const div = document.createElement("div");
      Object.defineProperty(result.current.captureRef, "current", {
        value: div,
        writable: true,
      });

      await act(async () => {
        await result.current.captureScreenshot();
      });

      expect(mockToast.error).not.toHaveBeenCalled();
    });
  });
});
