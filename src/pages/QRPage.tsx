import QrCodeCard from "../component/QrCode/QrCodeCard";
import { Button } from "@/component";
import { usePawnInterest } from "@/context/PawnInterestContext/PawnInterest";
import { NavLink } from "react-router-dom";
import { Smartphone } from "lucide-react";

function QRPage() {
  const { interest } = usePawnInterest();
  if (!interest) return <div>มีข้อผิดพลาด ไม่พบเอกสารจำนำที่ชำระได้</div>;

  const ref1 = interest.pawnNumb;
  const ref2 = String(interest.id).padStart(13, "0");
  const amount = (interest.fee + interest.netInterest).toFixed(2);

  return (
    <div className="px-4">
      <div className="max-w-md mx-auto flex flex-col gap-6">
        <QrCodeCard paymentData={{ ref1, ref2, amount }} />

        <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3">
          <Smartphone className="size-5 shrink-0 text-gray-600" />
          <p className="text-sm font-medium text-gray-600">
            บันทึกหน้าจอ QR เพื่อชำระเงิน
          </p>
        </div>

        <NavLink to="..">
          <Button styleType="outline" className="w-full">
            กลับ
          </Button>
        </NavLink>
      </div>
    </div>
  );
}

export default QRPage;
