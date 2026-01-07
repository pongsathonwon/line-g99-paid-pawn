import React from "react";
import QRCode from "qrcode";
import type { TQrCodeConfig } from "./lib.type";
import { createBarcodeClean } from "./lib";

export type TPaymentData = {
  ref1: string;
  ref2: string;
  amount: string;
};

type TQrCodeProps = {
  paymentData: TPaymentData;
  width?: number;
  className?: string;
};

function QrCode({ paymentData, width = 256, className = "" }: TQrCodeProps) {
  const config: TQrCodeConfig = {
    prefix: "|",
    taxId: "0105555097424",
    suffix: "01",
  };

  const qrRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!qrRef.current) return;

    const data = createBarcodeClean(paymentData, config);

    QRCode.toCanvas(qrRef.current, data, {
      errorCorrectionLevel: "H",
      width: width,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
  }, [paymentData, width, config]);

  return <canvas ref={qrRef} className={className} />;
}

export default QrCode;
