import React from "react";
import QRCode from "qrcode";

export type TPaymentData = {
  ref1: string;
  ref2: string;
  amount: string;
};

type TQrCodeConfig = {
  prefix: string;
  taxId: string;
  suffix: string;
};

type TQrCodeProps = {
  paymentData: TPaymentData;
  width?: number;
  className?: string;
};

function QrCode({ paymentData, width = 256, className = "" }: TQrCodeProps) {
  const config: TQrCodeConfig = {
    prefix: "|",
    taxId: "1234567890123", // TODO: Replace with actual merchant Tax ID from API
    suffix: "00",
  };

  const qrRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!qrRef.current) return;

    const data =
      config.prefix +
      config.taxId +
      config.suffix +
      "\r" +
      paymentData.ref1 +
      "\r" +
      paymentData.ref2 +
      "\r" +
      paymentData.amount;

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
