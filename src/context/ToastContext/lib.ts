import type { TToast } from "@/types/toast.type";

export const filterToast = (stepDuration: number) => ({ duration, ...res }: TToast) => {
    if (!duration || duration <= 0) {
        return [];
    }
    return [{ ...res, duration: duration - stepDuration }];
}