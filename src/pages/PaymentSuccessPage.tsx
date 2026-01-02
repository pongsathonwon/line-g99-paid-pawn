import { Button } from "@/component";
import DisplayCard from "@/component/ui/DisplayCard/DisplayCard";
import { usePawnInterest } from "@/context/PawnInterestContext/PawnInterest";
import { NavLink, useParams } from "react-router-dom";

function PaymentSuccessPage() {
  // const { id: pawnNumb } = useParams();
  const { interest } = usePawnInterest();

  const pawnNumb = interest?.pawnNumb ?? "-";
  const netInterest = interest?.netInterest ?? 0;

  return (
    <div className="flex flex-col items-center text-center pt-16">
      <h2 className="text-2xl font-bold text-black mb-1">ยินดีด้วย</h2>
      <p className="text-xl text-black font-semibold mb-4">คุณทำรายการสำเร็จ</p>

      <img src="/SuccessIcon.png" alt="success" className="size-[120px] mb-6" />
      <DisplayCard className="w-full max-w-[360px] mx-auto">
        <DisplayCard.Header>สรุปรายการชำระ</DisplayCard.Header>

        <DisplayCard.Subheader className="text-left">
          รายละเอียดสัญญา
        </DisplayCard.Subheader>

        <DisplayCard.Mute>
          <span>เลขที่สัญญา</span>
          <span>{pawnNumb}</span>
        </DisplayCard.Mute>

        <DisplayCard.Mute>
          <span>วันที่ชำระ</span>
          <span>10/11/2568</span>
        </DisplayCard.Mute>

        <DisplayCard.Summary>
          <span>ยอดชำระ</span>
          <span>{netInterest.toFixed(2)} บาท</span>
        </DisplayCard.Summary>
      </DisplayCard>

      <NavLink to="/history" className="mt-10 w-full max-w-[260px]">
        <Button fullWidth>ดูประวัติการทำรายการ</Button>
      </NavLink>
    </div>
  );
}

export default PaymentSuccessPage;
