import React from "react";
import { Button } from "@/component/Button";

interface PaymentCardProps {
  contractNumber: string;
  principal: number;
  dueDate: string;
  status?: "pending" | "upcoming" | "notDue";
}

export const PayCard: React.FC<PaymentCardProps> = ({
  contractNumber,
  principal,
  dueDate,
  status = "notDue",
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
      className="flex justify-between items-center bg-white rounded-2xl shadow-sm 
      w-[347px] h-[89px] px-4 py-3 font-Roboto"
    >
      {/* รูป */}
      <img
        src="/money-bag-small.png"
        alt="money bag"
        className="w-8 h-[41px] shrink-0"
      />

      {/* ข้อมูลสัญญา */}
      <div className="flex-1 ml-3 text-[#6B4E00] text-[12px] leading-[120%]">
        <div className="flex justify-between font-normal">
          <span>เลขที่สัญญา</span>
          <span className="font-semibold">{contractNumber}</span>
        </div>
        <div className="flex justify-between font-normal mt-0.5">
          <span>จำนวนเงินต้น</span>
          <span className="font-semibold">
            {principal.toLocaleString("th-TH")}
          </span>
        </div>
        <div className="flex justify-between font-normal mt-0.5">
          <span>วันครบกำหนด</span>
          <span className="font-semibold">
            {new Date(dueDate).toLocaleDateString("th-TH")}
          </span>
        </div>
      </div>

      {/* ด้านขวา */}
      <div className="flex flex-col items-center gap-1 ml-4 text-center w-[90px]">
        <span
          className={`font-bold text-[10px] leading-[120%] ${statusColors[computedStatus]}`}
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
          className="min-w-[65px] h-6 text-[10px] rounded-md"
        >
          ชำระเลย
        </Button>
      </div>
    </div>
  );
};

export default PayCard;
