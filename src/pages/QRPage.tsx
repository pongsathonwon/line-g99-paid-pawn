import QrCodeCard from "../QrCode/QrCode/QrCodeCard";
import { type TPaymentData } from "../QrCode/QrCode/QrCode";
import { Button } from "@/component";
import { useScreenshot } from "@/hook/useScreenshot";

function QRPage() {
  const { captureRef, isCapturing, captureScreenshot } = useScreenshot({
    fileNamePrefix: "payment-qr",
  });

  const paymentData: TPaymentData = {
    ref1: "9999999",
    ref2: "9999999",
    amount: "9000.00",
  };

  return (
    <div className="px-4">
      <div className="max-w-md mx-auto flex flex-col gap-6">
        <QrCodeCard ref={captureRef} paymentData={paymentData} />

        <div className="space-y-3">
          <Button
            onClick={captureScreenshot}
            disabled={isCapturing}
            className="w-full"
          >
            {isCapturing ? "Capturing..." : "Save QR Code"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QRPage;
