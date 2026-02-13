import type { TGetHistPaidByIdRes } from "@/api/endpoint/pawn";
import DisplayCard from "../DisplayCard/DisplayCard";
import { formatThaiDate } from "@/lib/date-time";

function PaidPawnCard(data: TGetHistPaidByIdRes) {
  const getDiscount = ({ paidDisc, paidAmou }: TGetHistPaidByIdRes) => {
    if (paidDisc > 0 && paidAmou != 20) return paidDisc;
    return 0;
  };
  return (
    <DisplayCard>
      <DisplayCard.Mute>
        <span>เลขที่สัญญา</span>
        <span>{data.pawnNumb}</span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>ครบกำหนด</span>
        <span>{formatThaiDate(data.dueDate)}</span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>วันที่ชำระ</span>
        <span>{formatThaiDate(data.paidDate)}</span>
      </DisplayCard.Mute>
      <DisplayCard.Summary>
        <span>ยอดชำระ</span>
        <span>{data.paidAmou.toLocaleString()} บาท</span>
      </DisplayCard.Summary>
      <DisplayCard.Mute>
        <span>ส่วนลดสมาชิก</span>
        <span>{getDiscount(data).toLocaleString()} บาท</span>
      </DisplayCard.Mute>
      <DisplayCard.Divider />
      <DisplayCard.Mute>
        <span>ชื่อลูกค้า</span>
        <span>{data.custName}</span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>สาขา</span>
        <span>{data.branchName}</span>
      </DisplayCard.Mute>
      <DisplayCard.Divider />
      <DisplayCard.Mute>
        <span>สินค้า</span>
        <span>
          {data.typeDesc} {data.goldType}
        </span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>น้ำหนัก</span>
        <span>{data.goodWeight} กรัม</span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>เงินต้น</span>
        <span>{data.pawnPrice.toLocaleString()} บาท</span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>ผู้ทำรายการ</span>
        <span>{data.emplName}</span>
      </DisplayCard.Mute>
    </DisplayCard>
  );
}

export default PaidPawnCard;
