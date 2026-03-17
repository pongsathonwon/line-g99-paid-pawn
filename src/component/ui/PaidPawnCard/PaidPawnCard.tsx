import type { TGetHistPaidByIdRes } from "@/api/endpoint/pawn";
import DisplayCard from "../DisplayCard/DisplayCard";
import { formatThaiDate } from "@/lib/date-time";
import { Fragment } from "react/jsx-runtime";

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
      {data.pawnItem.map((item, i) => (
        <Fragment key={i}>
          <DisplayCard.Mute>
            <span>สินค้า</span>
            <span>
              {item.typeDesc} {item.laiDesc}
            </span>
          </DisplayCard.Mute>
          <DisplayCard.Mute>
            <span>น้ำหนัก</span>
            <span>{item.goodWeight} กรัม</span>
          </DisplayCard.Mute>
          <DisplayCard.Mute>
            <span>เงินต้น</span>
            <span>{item.pawnPrice.toLocaleString()} บาท</span>
          </DisplayCard.Mute>
          <DisplayCard.Divider line="dash" />
        </Fragment>
      ))}
      <DisplayCard.Mute>
        <span>เงินต้นรวม</span>
        <span>
          {data.pawnItem
            .reduce((acc, cur) => acc + cur.pawnPrice, 0)
            .toLocaleString()}{" "}
          บาท
        </span>
      </DisplayCard.Mute>
      <DisplayCard.Divider />
      <DisplayCard.Mute>
        <span>ผู้ทำรายการ</span>
        <span>{data.emplName}</span>
      </DisplayCard.Mute>
    </DisplayCard>
  );
}

export default PaidPawnCard;
