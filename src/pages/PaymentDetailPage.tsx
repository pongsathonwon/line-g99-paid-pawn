import { getPawnInterest, type TGetPawnInterestRes } from "@/api/endpoint/pawn";
import { Button } from "@/component";
import DisplayCard from "@/component/ui/DisplayCard/DisplayCard";
import { useCustCode } from "@/context/AuthContext/AuthContext";
import type { TMaybe } from "@/types/base.type";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

function PaymentDetailPage() {
  const { id: pawnNumb } = useParams();
  const custCode = useCustCode();
  const [interest, setInterest] = useState<TMaybe<TGetPawnInterestRes>>(null);

  const interestMutation = useMutation({
    mutationFn: getPawnInterest,
    mutationKey: ["pawn", "pawnNumb"],
    onSuccess: (res) => {
      console.log(res);
      setInterest(res);
    },
    onError: console.error,
  });

  useEffect(() => {
    console.log(pawnNumb);
    if (!pawnNumb || !custCode) return;
    interestMutation.mutate({ pawnNumb, custCode });
  }, [pawnNumb, custCode]);

  return (
    <div>
      {!interestMutation.isSuccess || !interest ? (
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
