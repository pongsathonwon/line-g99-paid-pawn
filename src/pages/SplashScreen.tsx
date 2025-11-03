import { ButtonIcon, Input } from "@/component";
import { QrCode, Phone } from "lucide-react";
import { Icon } from "@iconify/react";
import FormControl from "@/component/FormControl/FormControl";
import PaymentCard from "@/component/Ui/PayCard";
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-6">
      {/* ปุ่มกลุ่มแรก */}
      <div className="flex flex-col gap-3">
        <ButtonIcon
          startIcon={<Icon icon="circum:save-down-1" width="24" height="24" />}
          color="primary"
          styleType="solid"
        >
          บันทึก QR Code
        </ButtonIcon>
        <ButtonIcon
          endIcon={<Icon icon="circum:save-down-1" width="24" height="24" />}
          color="secondary"
          styleType="solid"
        >
          บันทึก QR Code
        </ButtonIcon>
      </div>

      {/* ปุ่มกลุ่มสอง */}
      <div className="flex flex-col gap-3">
        <ButtonIcon
          endIcon={<Phone size={18} />}
          startIcon={<QrCode size={18} />}
          color="secondary"
          styleType="outline"
        >
          เข้าสู่ระบบเพื่อดูสัญญา
        </ButtonIcon>
        <ButtonIcon endIcon={<QrCode size={18} />} color="secondary">
          เข้าสู่ระบบเพื่อดูสัญญา
        </ButtonIcon>
      </div>
      <ButtonIcon color="primary" styleType="solid" size="xs">
        ชำระเลย
      </ButtonIcon>
      <ButtonIcon color="gold" styleType="solid" size="xs">
        ชำระเลย
      </ButtonIcon>
      <ButtonIcon color="black" styleType="solid" size="xs">
        ชำระเลย
      </ButtonIcon>
      <div className="flex flex-col gap-3">
        <Input
          label="input Test"
          placeholder="Input Text"
          variant="default"
          isRequired
          errorMessage=""
        />
        <Input
          placeholder="Input Text"
          variant="error"
          errorMessage="Error Text"
        />
        <Input placeholder="Input Text" variant="success" errorMessage="" />

        <Input
          label="input Test"
          placeholder="Input Text"
          variant="default"
          isRequired
          errorMessage=""
          inputSize="large"
        />
        <FormControl>
          <FormControl.Label>ฟหกดเาสว</FormControl.Label>
          <FormControl.Input disabled />
          <FormControl.Error>error message</FormControl.Error>
        </FormControl>
        <FormControl color="gold">
          <FormControl.Label>ฟหกดเาสว</FormControl.Label>
          <FormControl.Input />
        </FormControl>

        <PaymentCard
          contractNumber="C-001"
          principal={5000}
          dueDate="2025-11-10"
          status="pending"
        />

        <PaymentCard
          contractNumber="C-002"
          principal={12000}
          dueDate="2025-11-15"
          status="upcoming"
        />

        <PaymentCard
          contractNumber="C-002"
          principal={12000}
          dueDate="2025-11-03"
          status="upcoming"
        />

        <PaymentCard
          contractNumber="C-003"
          principal={8000}
          dueDate="2025-12-01"
          status="notDue"
        />
      </div>

      {/* ปุ่มขอบสีทอง */}
      <div className="mt-6">
        <ButtonIcon
          endIcon={<Phone size={18} />}
          color="gold"
          styleType="outline"
        >
          ติดต่อเจ้าหน้าที่
        </ButtonIcon>
      </div>
    </div>
  );
}
