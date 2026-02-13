import { Button } from "@/component";
import DisplayCard from "@/component/ui/DisplayCard/DisplayCard";
import QueryError from "@/component/ui/QueryError";
import QueryLoading from "@/component/ui/QueryLoading";
import { usePawnInterest } from "@/context/PawnInterestContext/PawnInterest";
import { formatThaiDate } from "@/lib/date-time";
import { NavLink } from "react-router-dom";

const formatDiscount = (membDisc: number) =>
  membDisc > 0 ? `- ${membDisc.toFixed(2)}` : "0.00";

function PaymentDetailPage() {
  const { interest, isSuccess, isError, error } = usePawnInterest();

  if (isError) {
    return <QueryError error={error} backTo="/home" />;
  }
  if (!isSuccess || !interest) {
    return <QueryLoading />;
  }

  return (
    <div>
      <DisplayCard>
        <DisplayCard.Header>สรุปการชำระ</DisplayCard.Header>
        <DisplayCard.Subheader>รายละเอียดสัญญา</DisplayCard.Subheader>
        <DisplayCard.Mute>
          <span>เลขที่สัญญา</span>
          <span>{interest.pawnNumb}</span>
        </DisplayCard.Mute>
        <DisplayCard.Mute>
          <span>วันครบกำหนด</span>
          <span>{formatThaiDate(interest.dueDate)}</span>
        </DisplayCard.Mute>
        <DisplayCard.Mute>
          <span>มูลค่าจำนำ</span>
          <span className="font-bold">{interest.pawnPrice} บาท</span>
        </DisplayCard.Mute>
        <DisplayCard.Mute>
          <span>อัตราดอกเบี้ย</span>
          <span>{interest.interestRate} %</span>
        </DisplayCard.Mute>
        <DisplayCard.Divider color="gold" line="dash" />
        <DisplayCard.Mute>
          <span>ชำระภายใน</span>
          <span>{formatThaiDate(interest.validBefore)}</span>
        </DisplayCard.Mute>
        <DisplayCard.Mute>
          <span>ดอกเบี้ย</span>
          <span>{interest.totalInterest.toFixed(2)} บาท</span>
        </DisplayCard.Mute>
        <DisplayCard.Mute>
          <span>ส่วนลดสมาชิก</span>
          <span>{formatDiscount(interest.membDisc)} บาท</span>
        </DisplayCard.Mute>
        <DisplayCard.Divider color="gold" line="dash" />
        <DisplayCard.Mute>
          <span>ดอกเบี้ยสุทธิ</span>
          <span>{interest.netInterest} บาท</span>
        </DisplayCard.Mute>
        <DisplayCard.Mute>
          <span>ค่าธรรมเนียม</span>
          <span>{interest.fee} บาท</span>
        </DisplayCard.Mute>
        <DisplayCard.Summary>
          <span>ยอดชำระ</span>
          <span>{(interest.netInterest + interest.fee).toFixed(2)} บาท</span>
        </DisplayCard.Summary>
        <DisplayCard.Divider color="base" />
        <div className="flex flex-col gap-4">
          <NavLink to="./qr">
            <Button fullWidth>ชำระดอกเบี้ย</Button>
          </NavLink>
          <NavLink to="..">
            <Button fullWidth styleType="outline">
              กลับ
            </Button>
          </NavLink>
        </div>
      </DisplayCard>
    </div>
  );
}

export default PaymentDetailPage;
