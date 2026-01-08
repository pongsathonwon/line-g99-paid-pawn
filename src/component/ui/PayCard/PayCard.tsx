import React from "react";
import { Button } from "@/component/Button";
import { formatThaiDate } from "@/lib/date-time";

interface PaymentCardProps {
  contractNumber: string;
  principal: number;
  dueDate: string;
  paymentLink: string;
  status?: "pending" | "upcoming" | "notDue";
  backgroundImage?: string;
}

export const PayCard: React.FC<PaymentCardProps> = ({
  contractNumber,
  principal,
  dueDate,
  status = "notDue",
  backgroundImage = "/bg_paycard.png",
}) => {
  const today = new Date();
  const due = new Date(dueDate);
  //* อาจจะมีวิธีดีกว่า นี้ในการคำนวณวันต่าง ๆ */
  const diffDays = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  let computedStatus: "pending" | "upcoming" | "notDue" = status;

  if (diffDays <= 0) {
    computedStatus = "pending";
  } else if (diffDays <= 7) {
    computedStatus = "upcoming";
  } else {
    computedStatus = "notDue";
  }

  const statusColors = {
    pending: "text-brand-red-600",
    upcoming: "text-gold",
    notDue: "text-gray-600",
  };

  const buttonStyles = {
    pending: { color: "primary", styleType: "solid" },
    upcoming: { color: "gold", styleType: "solid" },
    notDue: { color: "black", styleType: "solid" },
  };

  const statusText = {
    pending: "รอการชำระ",
    upcoming: `${diffDays} วันกำหนดชำระ`,
    notDue: "ยังไม่ถึงกำหนด",
  };

  return (
    <div
      className="flex justify-between items-center gap-6 bg-white rounded-2xl shadow-sm 
       h-24 lg:h-36 w-full px-4 py-3"
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
      <div className="flex-1 flex flex-col gap-0.5 text-[#845A01] text-[12px] leading-[120%] lg:gap-1 lg:text-lg">
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
          className={`font-bold text-[10px] leading-[120%] ${statusColors[computedStatus]} lg:text-base`}
        >
          {statusText[computedStatus]}
        </span>

        <Button
          color={
            buttonStyles[computedStatus].color as "primary" | "gold" | "black"
          }
          styleType={
            buttonStyles[computedStatus].styleType as "solid" | "outline"
          }
          size="xs"
          className="text-[10px] rounded-md lg:text-base"
        >
          ชำระเลย
        </Button>
      </div>
    </div>
  );
};

export default PayCard;
