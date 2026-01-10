import React from "react";
import { ButtonIcon } from "@/component";
import { Icon } from "@iconify/react";
import { Phone } from "lucide-react";

interface ErrorPageProps {
  onRetry?: () => void;
  onContact?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  onRetry = () => {},
  onContact = () => {},
}) => {
  return (
    <div className="w-full flex flex-col items-center text-center px-6 py-10">
      <h2 className="text-2xl font-bold text-black mb-1">ขออภัย</h2>
      <p className="text-2xl text-black font-semibold mb-3">
        คุณทำรายการไม่สำเร็จ
      </p>

      <div className="flex-1 flex items-center justify-center my-8">
        <img src="/Erroricon.png" alt="error" className="w-[120px] h-[120px]" />
      </div>

      <ButtonIcon
        startIcon={<Phone size={18} />}
        color="gold"
        styleType="outline"
        size="md"
        fullWidth
        className="mb-4 max-w-[260px]"
        onClick={onContact}
      >
        ติดต่อเจ้าหน้าที่
      </ButtonIcon>

      <ButtonIcon
        startIcon={<Icon icon="pajamas:retry" width="16" height="16" />}
        color="primary"
        styleType="solid"
        size="md"
        fullWidth
        className="max-w-[260px]"
        onClick={onRetry}
      >
        ตรวจสอบอีกครั้ง
      </ButtonIcon>
    </div>
  );
};

export default ErrorPage;
