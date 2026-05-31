import { formatThaiDate } from "@/lib/date-time";
import DisplayCard from "../ui/DisplayCard/DisplayCard";
import type { TPaymentData } from "./QrCode";
import QrCode from "./QrCode";

type TQrCodeCardProps = {
  paymentData: TPaymentData;
  qrWidth?: number;
};

function QrCodeCard2({ paymentData, qrWidth = 280 }: TQrCodeCardProps) {
  return (
    <DisplayCard>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src="/qr/qr_logo_full.png"
          alt="Payment Logo"
          style={{ height: "4rem", width: "auto", objectFit: "contain" }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <QrCode paymentData={paymentData} width={qrWidth} />
      </div>
      <DisplayCard.Mute>
        <span className="text-black text-xl">ยอดชำระ</span>
        <span className="text-black text-xl">{paymentData.amount} บาท</span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>เลขที่สัญญาฝากขาย</span>
        <span>{paymentData.ref1}</span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>เลขอ้างอิง</span>
        <span>{paymentData.ref2}</span>
      </DisplayCard.Mute>
      <DisplayCard.Divider />
      <DisplayCard.Mute>
        <span>ชื่อบัญชี</span>
        <span className="text-black">บจก. โกลด์เด้น 99 จำกัด</span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>หมายเหตุ</span>
        <span className="text-black">บันทึกหน้าจอ QR เพื่อชำระ</span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>คิวอาร์โค้ดสามารถชำระได้ถึง</span>
        <span className="text-black">
          {formatThaiDate(paymentData.interestDate)}
        </span>
      </DisplayCard.Mute>
    </DisplayCard>
  );
}

export default QrCodeCard2;
