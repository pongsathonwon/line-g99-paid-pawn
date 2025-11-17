import QrCodeCard from "../component/QrCode/QrCodeCard";
import { type TPaymentData } from "../component/QrCode/QrCode";
import { Button } from "@/component";
import { useScreenshot } from "@/hook/useScreenshot";
import { usePawnInterest } from "@/context/PawnInterestContext/PawnInterest";

function QRPage() {
  const { captureRef, isCapturing, captureScreenshot } = useScreenshot({
    fileNamePrefix: "payment-qr",
  });
  const { interest } = usePawnInterest();
  const paymentData: TPaymentData = {
    ref1: "9999999",
    ref2: "9999999",
    amount: "9000.00",
  };
  if (!interest) return <div>มีข้อผิดพลาด ไม่พบเอกสารจำนำที่ชำระได้</div>;

  const ref1 = interest.pawnNumb;
  const ref2 = interest.custCode;
  const amount = interest.netInterest.toFixed(2);

  return (
    <div className="px-4">
      <div className="max-w-md mx-auto flex flex-col gap-6">
        <QrCodeCard ref={captureRef} paymentData={{ ref1, ref2, amount }} />

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
