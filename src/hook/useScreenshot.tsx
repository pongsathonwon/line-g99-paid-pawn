import type { TMaybe } from "@/types/base.type";
import { useRef, useState, useCallback } from "react";
import { useToast } from "@/context/ToastContext/ToastContext";
import { toBlob } from "html-to-image";

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
  options: UseScreenshotOptions = {},
): UseScreenshotReturn {
  const {
    backgroundColor = "#ffffff",
    scale = 2,
    fileNamePrefix = "screenshot",
  } = options;

  const captureRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const { error: showError, success: showSuccess } = useToast();

  const captureScreenshot = useCallback(async () => {
    if (!captureRef.current) return;

    setIsCapturing(true);

    try {
      const blob = await toBlob(captureRef.current, {
        backgroundColor,
        pixelRatio: scale,
        cacheBust: true,
      });

      if (!blob) {
        throw new Error("Failed to create image blob");
      }

      const timestamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
      const fileName = `${fileNamePrefix}-${timestamp}.png`;

      // Try Web Share API first (works on mobile for saving to Photos)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], fileName, { type: "image/png" });
        const shareData = { files: [file] };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          showSuccess("บันทึกภาพสำเร็จ");
          return;
        }
      }

      // Fallback: Try to trigger download (works on desktop)
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = fileName;
      link.href = url;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL after a short delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);

      showSuccess("บันทึกภาพสำเร็จ");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // User cancelled the share dialog
        return;
      }
      const msg = error instanceof Error ? error.message : String(error);
      showError(`บันทึกภาพไม่สำเร็จ: ${msg}`, 3000);
    } finally {
      setIsCapturing(false);
    }
  }, [backgroundColor, scale, fileNamePrefix, showError, showSuccess]);

  return {
    captureRef,
    isCapturing,
    captureScreenshot,
  };
}
