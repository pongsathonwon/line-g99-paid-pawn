import type { TMaybe } from "@/types/base.type";
import { useRef, useState, useCallback } from "react";
import { useToast } from "@/context/ToastContext/ToastContext";

export type UseScreenshotOptions = {
  backgroundColor?: string;
  scale?: number;
  fileNamePrefix?: string;
};

export type UseScreenshotReturn = {
  captureRef: React.RefObject<TMaybe<HTMLDivElement>>;
  isCapturing: boolean;
  captureScreenshot: () => Promise<void>;
};

export function useScreenshot(
  options: UseScreenshotOptions = {}
): UseScreenshotReturn {
  const {
    backgroundColor = "#ffffff",
    scale = 2,
    fileNamePrefix = "screenshot",
  } = options;

  const captureRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const { error: showError } = useToast();

  const captureScreenshot = useCallback(async () => {
    if (!captureRef.current) return;

    setIsCapturing(true);

    try {
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(captureRef.current, {
        backgroundColor,
        scale,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      canvas.toBlob((blob: Blob | null) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const timestamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
        link.download = `${fileNamePrefix}-${timestamp}.png`;
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (error) {
      console.error("Screenshot failed:", error);
      showError("ไม่สามารถบันทึกภาพหน้าจอได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsCapturing(false);
    }
  }, [backgroundColor, scale, fileNamePrefix, showError]);

  return {
    captureRef,
    isCapturing,
    captureScreenshot,
  };
}
