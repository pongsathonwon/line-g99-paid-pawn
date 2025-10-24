// src/components/OrientationLock.tsx
import { useEffect, useState } from "react";

export function OrientationLock() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!isLandscape) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white">
      <div className="text-center p-32">
        <div className="text-6xl mb-16">📱</div>
        <p className="text-xl text-gray">กรุณาหมุนอุปกรณ์เป็นแนวตั้ง</p>
        <p className="text-sm text-gray mt-8">
          Please rotate your device to portrait mode
        </p>
      </div>
    </div>
  );
}
