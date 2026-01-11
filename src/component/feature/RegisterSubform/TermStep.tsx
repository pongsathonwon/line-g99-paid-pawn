import { useMultistepForm } from "@/context/MultistepFormContext/MultiStepFormContext";
import React, {
  type PropsWithChildren,
  useRef,
  useState,
  useEffect,
} from "react";
import { Button } from "@/component/Button";
import { useMutation } from "@tanstack/react-query";
import { REGISTER_API } from "@/api/endpoint/register";
import type { TRegisterReq } from "@/types/register";
import { useLineContext } from "@/context/LineContext/LineContext";
import { useToast } from "@/context/ToastContext/ToastContext";
import { REGISTER_LOCALE_TEXT } from "@/component/feature/RegisterForm/register.locale";
import { REGISTER_TERMS } from "@/component/feature/RegisterForm/register.terms";

type TTermStepProps = {
  locale: "th" | "en";
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

function TermStep({
  isConsent,
  onConsent,
  userData,
  isVerified,
  locale,
}: PropsWithChildren<TTermStepProps>) {
  const { next } = useMultistepForm();
  const { lineCtx } = useLineContext();
  const { error: showError } = useToast();
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isChecked, setIsChecked] = useState(isConsent);
  const termsBoxRef = useRef<HTMLDivElement>(null);

  const t = REGISTER_LOCALE_TEXT[locale].term;
  const terms = REGISTER_TERMS[locale] ?? REGISTER_TERMS.th;

  const registerMutation = useMutation({
    mutationFn: (req: TRegisterReq) => REGISTER_API.registerUser(req),
    onSuccess: () => {
      next();
    },
    onError: (error: any) => {
      showError(
        error.message || "เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง"
      );
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
      termsBox.addEventListener("scroll", handleScroll);
      return () => termsBox.removeEventListener("scroll", handleScroll);
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
    const lineUid = lineCtx?.isLogin ? lineCtx.profile.userId : "mock-line-uid";

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
        <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
      </div>

      {/* Scrollable Terms Box */}
      <div
        ref={termsBoxRef}
        className="h-96 overflow-y-auto border-2 border-gray-300 rounded-lg p-4 bg-white"
      >
        <div className="space-y-4 text-sm text-gray-700">
          <h3 className="text-lg font-semibold text-gray-900">{terms.title}</h3>

          <p>{terms.intro}</p>

          {terms.items.map((item, index) => (
            <React.Fragment key={index}>
              <h4 className="font-semibold text-gray-800">{item.heading}</h4>
              <p>{item.content}</p>
            </React.Fragment>
          ))}

          <p className="font-semibold text-gray-900 mt-6">{terms.footer}</p>
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
          className={`text-sm ${
            hasScrolledToBottom ? "text-gray-700" : "text-gray-400"
          }`}
        >
          {t.consentLabel}
          {!hasScrolledToBottom && (
            <span className="block text-xs text-orange-600 mt-1">
              {t.mustScroll}
            </span>
          )}
        </label>
      </div>

      {/* Register Button */}
      <Button
        fullWidth
        onClick={handleRegister}
        disabled={
          !isChecked || !hasScrolledToBottom || registerMutation.isPending
        }
      >
        {registerMutation.isPending ? t.submitting : t.submit}
      </Button>
    </section>
  );
}

export default TermStep;
