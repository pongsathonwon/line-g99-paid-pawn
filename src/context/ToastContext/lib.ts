import type { TToast } from "@/types/toast.type";

export const filterToast = (stepDuration: number) => ({ duration, ...res }: TToast) => {
    const nextDuration = (duration ?? 0) - stepDuration
    if (nextDuration <= 0) {
        return [];
    }
    return [{ ...res, duration: nextDuration }];
}