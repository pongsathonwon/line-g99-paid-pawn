import React from "react";
import { formatThaiDate } from "@/lib/date-time";
import type { TPawnStatusEnum } from "@/hook/query/lib";

interface PaymentCardProps {
  contractNumber: string;
  principal: number;
  dueDate: string;
  dateDiff: number;
  pawnStatus: TPawnStatusEnum;
  backgroundImage?: string;
}

export const PayCard: React.FC<PaymentCardProps> = ({
  contractNumber,
  principal,
  dueDate,
  dateDiff,
  pawnStatus,
  backgroundImage = "/bg_paycard.png",
}) => {
  const statusColors = {
    expire: "text-brand-red",
    overdue: "text-brand-red",
    normal: "text-gray-600",
    "due-soon": "text-gold",
    due: "text-brand-red",
  };

  const buttonColors: Record<TPawnStatusEnum, string> = {
    expire: "bg-gray text-white",
    overdue: "bg-gray text-white",
    normal: "bg-gray text-white",
    "due-soon": "bg-gold text-white",
    due: "bg-brand-red text-white",
  };

  const statusText: Record<TPawnStatusEnum, (dateDiff: number) => string> = {
    expire: (diff) => "หมดอายุ",
    overdue: (diffDays) => "เลยกำหนด",
    normal: (dateDiff) => "ยังไม่ถึงกำหนด",
    "due-soon": (dateDiff) => `${dateDiff} วันก่อนกำหนด`,
    due: (dateDiff) => "รอการชำระ",
  };

  return (
    <div
      className="flex justify-between items-center gap-6 bg-white rounded-2xl shadow-sm 
       h-24 lg:h-36 w-full px-4 py-3"
      data-testid="card-background"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "80% 120%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
      }}
    >
      {/* รูป */}
      <div className="w-1/5 flex justify-center">
        <img
          src="/money-bag-small.png"
          alt="money bag"
          className="w-8 shrink-0 lg:w-16"
        />
      </div>

      {/* ข้อมูลสัญญา */}
      <div className="flex-1 flex flex-col gap-0.5 text-[#845A01] text-sm leading-[120%] lg:gap-1 lg:text-lg">
        <div className="flex justify-between">
          <span>เลขที่สัญญา</span>
          <span className="font-semibold">{contractNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>จำนวนเงินต้น</span>
          <span className="font-semibold">
            {principal.toLocaleString("th-TH")}
          </span>
        </div>
        <div className="flex justify-between">
          <span>วันครบกำหนด</span>
          <span className="font-semibold">{formatThaiDate(dueDate)}</span>
        </div>
      </div>

      {/* ด้านขวา */}
      <div className="flex flex-col items-center gap-1 text-center w-1/5 lg:gap-2">
        <span
          data-testid="button-label"
          className={`font-bold text-[10px] leading-[120%] ${statusColors[pawnStatus]} lg:text-base`}
        >
          {statusText[pawnStatus](dateDiff)}
        </span>

        <div
          className={`inline-flex items-center justify-center font-medium px-2.5 py-0.5 text-[10px] rounded-md lg:text-base ${buttonColors[pawnStatus]}`}
        >
          ชำระเลย
        </div>
      </div>
    </div>
  );
};

export default PayCard;
