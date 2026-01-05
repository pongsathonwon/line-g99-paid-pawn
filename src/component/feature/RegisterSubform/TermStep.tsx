import { useMultistepForm } from "@/context/MultistepFormContext/MultiStepFormContext";
import React, { type PropsWithChildren, useRef, useState, useEffect } from "react";
import { Button } from "@/component/Button";
import { useMutation } from "@tanstack/react-query";
import { REGISTER_API } from "@/api/endpoint/register";
import type { TRegisterReq } from "@/types/register";
import { useLineContext } from "@/context/LineContext/LineContext";
import { useToast } from "@/context/ToastContext/ToastContext";

type TTermStepProps = {
  isConsent: boolean;
  onConsent: (consent: boolean) => void;
  userData: {
    custNo: string;
    fullname: string;
    idCard: string;
    birthDate: string;
    mobileNo: string;
    branchCode: string;
    custType: string;
    custStat: number;
    nationCode: string;
    gender?: string;
  };
  isVerified: boolean;
};

function TermStep({ isConsent, onConsent, userData, isVerified }: PropsWithChildren<TTermStepProps>) {
  const { next } = useMultistepForm();
  const { lineCtx } = useLineContext();
  const { error: showError } = useToast();
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isChecked, setIsChecked] = useState(isConsent);
  const termsBoxRef = useRef<HTMLDivElement>(null);

  const registerMutation = useMutation({
    mutationFn: (req: TRegisterReq) => REGISTER_API.registerUser(req),
    onSuccess: () => {
      next();
    },
    onError: (error: any) => {
      showError(error.message || "เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง");
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      if (termsBoxRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = termsBoxRef.current;
        // Check if scrolled to bottom (with 10px tolerance)
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          setHasScrolledToBottom(true);
        }
      }
    };

    const termsBox = termsBoxRef.current;
    if (termsBox) {
      termsBox.addEventListener('scroll', handleScroll);
      return () => termsBox.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    onConsent(checked);
  };

  const handleRegister = () => {
    if (!isChecked || !hasScrolledToBottom) {
      return;
    }

    // Get LINE UID from LineContext
    const lineUid = lineCtx?.isLogin ? lineCtx.profile.userId : 'mock-line-uid';

    const registerData: TRegisterReq = {
      lineUid,
      custNo: userData.custNo,
      fullname: userData.fullname,
      idCard: userData.idCard,
      birthDate: userData.birthDate,
      mobileNo: userData.mobileNo,
      branchCode: userData.branchCode,
      custType: userData.custType,
      custStat: userData.custStat,
      nationCode: userData.nationCode,
      gender: userData.gender,
      isConsent: isChecked,
      isVerified: isVerified,
    };

    registerMutation.mutate(registerData);
  };

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">ข้อกำหนดและเงื่อนไข</h2>
      </div>

      {/* Scrollable Terms Box */}
      <div
        ref={termsBoxRef}
        className="h-96 overflow-y-auto border-2 border-gray-300 rounded-lg p-4 bg-white"
      >
        <div className="space-y-4 text-sm text-gray-700">
          <h3 className="text-lg font-semibold text-gray-900">ข้อกำหนดและเงื่อนไขการใช้บริการ</h3>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

          <h4 className="font-semibold text-gray-800">1. การยอมรับข้อกำหนด</h4>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>

          <h4 className="font-semibold text-gray-800">2. การใช้บริการ</h4>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
            eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>

          <h4 className="font-semibold text-gray-800">3. ความรับผิดชอบของผู้ใช้</h4>
          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
            qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
          </p>

          <h4 className="font-semibold text-gray-800">4. นโยบายความเป็นส่วนตัว</h4>
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
            quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
          </p>

          <h4 className="font-semibold text-gray-800">5. การเก็บรักษาข้อมูล</h4>
          <p>
            Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum
            facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit.
          </p>

          <h4 className="font-semibold text-gray-800">6. การแก้ไขข้อกำหนด</h4>
          <p>
            Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae
            sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.
          </p>

          <h4 className="font-semibold text-gray-800">7. การระงับบริการ</h4>
          <p>
            Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <h4 className="font-semibold text-gray-800">8. ข้อจำกัดความรับผิด</h4>
          <p>
            Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur,
            vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. Sed ut perspiciatis unde omnis iste natus error.
          </p>

          <h4 className="font-semibold text-gray-800">9. กฎหมายที่ใช้บังคับ</h4>
          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
            qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur.
          </p>

          <h4 className="font-semibold text-gray-800">10. การติดต่อ</h4>
          <p>
            หากท่านมีข้อสงสัยหรือต้องการสอบถามเพิ่มเติมเกี่ยวกับข้อกำหนดและเงื่อนไขนี้ กรุณาติดต่อเราผ่านช่องทางที่ระบุไว้ในเว็บไซต์
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.
          </p>

          <p className="font-semibold text-gray-900 mt-6">
            การลงทะเบียนใช้บริการถือว่าท่านได้อ่านและยอมรับข้อกำหนดและเงื่อนไขทั้งหมดแล้ว
          </p>
        </div>
      </div>

      {/* Checkbox - only enabled when scrolled to bottom */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="consent-checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          disabled={!hasScrolledToBottom}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <label
          htmlFor="consent-checkbox"
          className={`text-sm ${!hasScrolledToBottom ? 'text-gray-400' : 'text-gray-700'}`}
        >
          ข้าพเจ้าได้อ่านและยอมรับข้อกำหนดและเงื่อนไขการใช้บริการ
          {!hasScrolledToBottom && (
            <span className="block text-xs text-orange-600 mt-1">
              กรุณาเลื่อนอ่านข้อกำหนดและเงื่อนไขจนจบก่อนทำการยอมรับ
            </span>
          )}
        </label>
      </div>

      {/* Register Button */}
      <Button
        fullWidth
        onClick={handleRegister}
        disabled={!isChecked || !hasScrolledToBottom || registerMutation.isPending}
      >
        {registerMutation.isPending ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
      </Button>
    </section>
  );
}

export default TermStep;
