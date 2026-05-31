import React from "react";
import QRCode from "qrcode";
import type { TQrCodeConfig } from "./lib.type";
import { createBarcodeFilled } from "./lib";

export type TPaymentData = {
  ref1: string;
  ref2: string;
  amount: string;
  interestDate: string;
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

  const [dataUrl, setDataUrl] = React.useState<string>("");

  React.useEffect(() => {
    const data = createBarcodeFilled(paymentData, config);

    QRCode.toDataURL(data, {
      errorCorrectionLevel: "H",
      width: width,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    }).then(setDataUrl);
  }, [paymentData, width, config]);

  if (!dataUrl) return null;

  return (
    <img
      src={dataUrl}
      alt="QR Code"
      width={width}
      height={width}
      className={className}
    />
  );
}

export default QrCode;
