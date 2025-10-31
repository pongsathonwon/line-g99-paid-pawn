import React from "react";
import QRCode from "qrcode";

type TQrCode = {
  prefix: string;
  taxId: string;
  suffix: string;
  amount: string;
  ref1: string;
  ref2: string;
};

type TQrCodeProps = Pick<TQrCode, "ref1" | "ref2" | "amount">;

function QrCode({ ref1, ref2, amount }: TQrCodeProps) {
  const prefix = "|";
  const taxId = "1234567890123";
  const suffix = "00";
  const qrRef = React.useRef(null);
  React.useEffect(() => {
    // This data will show when scan your QR Code
    const data =
      prefix + taxId + suffix + "\r" + ref1 + "\r" + ref2 + "\r" + amount;

    QRCode.toCanvas(qrRef.current, data, { errorCorrectionLevel: "H" });
  }, [suffix, ref1, ref2, amount]);

  return <canvas ref={qrRef} />;
}

export default QrCode;
