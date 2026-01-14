import QrCodeCard from "../component/QrCode/QrCodeCard";
import { Button } from "@/component";
import { useScreenshot } from "@/hook/useScreenshot";
import { usePawnInterest } from "@/context/PawnInterestContext/PawnInterest";
import { NavLink } from "react-router-dom";

function QRPage() {
  const { captureRef, isCapturing, captureScreenshot } = useScreenshot({
    fileNamePrefix: "payment-qr",
  });
  const { interest } = usePawnInterest();
  if (!interest) return <div>มีข้อผิดพลาด ไม่พบเอกสารจำนำที่ชำระได้</div>;

  const ref1 = interest.pawnNumb;
  const ref2 = interest.custCode;
  const amount = (interest.fee + interest.netInterest).toFixed(2);

  return (
    <div className="px-4">
      <div className="max-w-md mx-auto flex flex-col gap-6">
        <QrCodeCard ref={captureRef} paymentData={{ ref1, ref2, amount }} />

        <div className="flex flex-col gap-4">
          <Button
            onClick={captureScreenshot}
            disabled={isCapturing}
            className="w-full"
          >
            {isCapturing ? "กำลังบันทึก..." : "บันทึก"}
          </Button>

          <NavLink to="..">
            <Button styleType="outline" className="w-full">
              กลับ
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default QRPage;
