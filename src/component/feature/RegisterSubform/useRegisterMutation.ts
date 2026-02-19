import { useMutation } from "@tanstack/react-query";
import { REGISTER_API } from "@/api/endpoint/register";
import type { TRegisterReq, TRegisterRequestReq } from "@/types/register";
import { useMultistepForm } from "@/context/MultistepFormContext/MultiStepFormContext";
import { useToast } from "@/context/ToastContext/ToastContext";

type TMode = "thai" | "foreign" | "foreign-counter";

const ERROR_MESSAGE = "เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง";

export function useRegisterMutation(mode: TMode) {
  const { next } = useMultistepForm();
  const { error: showError } = useToast();

  const onSuccess = () => next();
  const onError = (error: any) => showError(error.message || ERROR_MESSAGE);

  const registerMutation = useMutation({
    mutationFn: (req: TRegisterReq) => REGISTER_API.registerUser(req),
    onSuccess,
    onError,
  });

  const registerRequestMutation = useMutation({
    mutationFn: (req: TRegisterRequestReq) => REGISTER_API.registerRequest(req),
    onSuccess,
    onError,
  });

  const isPending = registerMutation.isPending || registerRequestMutation.isPending;

  const mutate = (req: TRegisterReq | TRegisterRequestReq) => {
    if (mode === "foreign-counter") {
      registerRequestMutation.mutate(req as TRegisterRequestReq);
    } else {
      registerMutation.mutate(req as TRegisterReq);
    }
  };

  return { mutate, isPending };
}
