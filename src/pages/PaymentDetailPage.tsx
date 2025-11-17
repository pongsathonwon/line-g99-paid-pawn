import { Button } from "@/component";
import DisplayCard from "@/component/ui/DisplayCard/DisplayCard";
import { usePawnInterest } from "@/context/PawnInterestContext/PawnInterest";
import { NavLink } from "react-router-dom";

function PaymentDetailPage() {
  const { interest, isSuccess } = usePawnInterest();

  return (
    <div>
      {!isSuccess || !interest ? (
        <div>loading ....</div>
      ) : (
        <DisplayCard>
          <DisplayCard.Header>สรุปการชำระ</DisplayCard.Header>
          <DisplayCard.Subheader>รายละเอียดสัญญา</DisplayCard.Subheader>
          <DisplayCard.Mute>
            <span>เลขที่สัญญา</span>
            <span>{interest.pawnNumb}</span>
          </DisplayCard.Mute>
          <DisplayCard.Mute>
            <span>วันครบกำหนด</span>
            <span>{interest.dueDate}</span>
          </DisplayCard.Mute>
          <DisplayCard.Mute>
            <span>มูลค่าจำนำ</span>
            <span className="font-bold">{interest.pawnPrice} บาท</span>
          </DisplayCard.Mute>
          <DisplayCard.Mute>
            <span>ดอกเบี้ย</span>
            <span>{interest.interestRate} %</span>
          </DisplayCard.Mute>
          <DisplayCard.Divider color="gold" line="dash" />
          <DisplayCard.Mute>
            <span>ชำระภายใน</span>
            <span>{interest.validBefore}</span>
          </DisplayCard.Mute>
          <DisplayCard.Mute>
            <span>ดอกเบี้ย</span>
            <span>{interest.totalInterest.toFixed(2)} บาท</span>
          </DisplayCard.Mute>
          <DisplayCard.Mute>
            <span>ส่วนลดสมาชิก</span>
            <span>{interest.membDisc.toFixed(2)} บาท</span>
          </DisplayCard.Mute>
          <DisplayCard.Summary>
            <span>ยอดชำระ</span>
            <span>{interest.netInterest.toFixed(2)} บาท</span>
          </DisplayCard.Summary>
          <DisplayCard.Divider color="base" />

          <NavLink to="./qr">
            <Button fullWidth>ชำระดอกเบี้ย</Button>
          </NavLink>
        </DisplayCard>
      )}
    </div>
  );
}

export default PaymentDetailPage;
