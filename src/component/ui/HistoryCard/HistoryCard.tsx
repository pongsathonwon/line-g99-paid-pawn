import { type PropsWithChildren } from "react";
import DisplayCard from "../DisplayCard/DisplayCard";
import { formatThaiDate } from "@/lib/date-time";
import type { TGetHistPaidRes } from "@/api/endpoint/pawn";

type THistoryCardProps = Pick<
  TGetHistPaidRes,
  "paidStat" | "pawnNumb" | "paidDisc" | "paidAmou" | "paidDate" | "dueDate"
>;

function HistoryCard({
  paidStat,
  pawnNumb,
  dueDate,
  paidDate,
  paidAmou,
  paidDisc,
}: PropsWithChildren<THistoryCardProps>) {
  return (
    <DisplayCard withBorder color={paidStat === "1" ? "gold" : "red"}>
      <DisplayCard.Mute>
        <span>เลขที่สัญญา</span>
        <span>{pawnNumb}</span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>วันครบกำหนด</span>
        <span>{formatThaiDate(dueDate)}</span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>วันชำระ</span>
        <span>{formatThaiDate(paidDate)}</span>
      </DisplayCard.Mute>
      <DisplayCard.Summary>
        <span>ยอดชำระ</span>
        <span>{paidAmou.toLocaleString()} บาท</span>
      </DisplayCard.Summary>
      {paidDisc > 0 && paidAmou != 20 && (
        <DisplayCard.Mute>
          <span className="text-green-300">ประหยัดไป</span>
          <span className="text-green-300">
            {paidDisc.toLocaleString()} บาท
          </span>
        </DisplayCard.Mute>
      )}
    </DisplayCard>
  );
}

export default HistoryCard;
