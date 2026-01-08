import { Button } from "@/component";
import DisplayCard from "@/component/ui/DisplayCard/DisplayCard";
import { usePawnInterest } from "@/context/PawnInterestContext/PawnInterest";
import { parseApiError } from "@/zod/api-error";
import { AxiosError } from "axios";
import { NavLink } from "react-router-dom";

function PaymentDetailPage() {
  const { interest, isSuccess, isError, error } = usePawnInterest();

  const getErrorMessage = (error: Error | null): string => {
    if (!error) return "";
    if (error instanceof AxiosError) {
      const body = parseApiError(error.response?.data);
      return body?.message ?? "เกิดข้อผิดพลาดในการโหลดข้อมูล";
    }

    return error.message ?? "เกิดข้อผิดพลาดในการโหลดข้อมูล";
  };

  return (
    <div>
      {isError ? (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="text-red-600 font-semibold text-lg mb-2">
            เกิดข้อผิดพลาด
          </div>
          <div className="text-gray-700 mb-4">{getErrorMessage(error)}</div>
          <NavLink to="/home">
            <Button>กลับหน้าหลัก</Button>
          </NavLink>
        </div>
      ) : !isSuccess || !interest ? (
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
