import type { TGetManyPawmRes } from "@/api/endpoint/pawn";
import dayjs from "dayjs";

export type TPawnStatusEnum = "overdue" | "due-soon" | "normal" | "due";

type TGetManyPawnWithStatus = TGetManyPawmRes & {
    pawnStatus: TPawnStatusEnum
    dateDiff: number
}

export const transformPawnStatus = (pawn: TGetManyPawmRes[]): TGetManyPawnWithStatus[] => {
    const today = dayjs();
    return pawn.map((item) => {
        const nextPaidDate = dayjs(item.nextPaidDate);
        const diffInDays = nextPaidDate.diff(today, "day");

        if (diffInDays > 7) return { ...item, pawnStatus: "normal", dateDiff: diffInDays };

        if (diffInDays > 0) return { ...item, pawnStatus: "due-soon", dateDiff: diffInDays };

        if (diffInDays > -7) return { ...item, pawnStatus: "due", dateDiff: diffInDays };

        return { ...item, pawnStatus: "overdue", dateDiff: diffInDays };
    });
} 