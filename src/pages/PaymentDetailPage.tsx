import { Button } from "@/component";
import DisplayCard from "@/component/ui/DisplayCard/DisplayCard";
import { NavLink } from "react-router-dom";

function PaymentDetailPage() {
  return (
    <div>
      <DisplayCard>
        <DisplayCard.Header>สรุปการชำระ</DisplayCard.Header>
        <DisplayCard.Subheader>รายละเอียดสัญญา</DisplayCard.Subheader>
        <DisplayCard.Mute>
          <span>เลขที่สัญญา</span>
          <span>123456789</span>
        </DisplayCard.Mute>
        <DisplayCard.Mute>
          <span>วันครบกำหนด</span>
          <span>31/12/2568</span>
        </DisplayCard.Mute>
        <DisplayCard.Mute>
          <span>ยอดชำระ</span>
          <span className="font-bold">4950 บาท</span>
        </DisplayCard.Mute>
        <DisplayCard.Divider color="gold" line="dash" />
        <DisplayCard.Mute>
          <span>เลขที่สัญญา</span>
          <span>123456789</span>
        </DisplayCard.Mute>
        <DisplayCard.Mute>
          <span>วันครบกำหนด</span>
          <span>31/12/2568</span>
        </DisplayCard.Mute>
        <DisplayCard.Summary>
          <span>ยอดชำระ</span>
          <span>4950 บาท</span>
        </DisplayCard.Summary>
        <DisplayCard.Divider color="base" />
        <DisplayCard.OrderList>
          <li>dadasdasd</li>
          <li>dasdkpjo</li>
          <li>nhgyguik</li>
        </DisplayCard.OrderList>
        <DisplayCard.Divider />
        <NavLink to="./qr">
          <Button fullWidth>ชำระดอกเบี้ย</Button>
        </NavLink>
      </DisplayCard>
    </div>
  );
}

export default PaymentDetailPage;
