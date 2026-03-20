import { usePawnInterest } from "@/context/PawnInterestContext/PawnInterest";
import { useCustInfo } from "@/context/AuthContext/AuthContext";
import { mapDateIntoState, transformPawnStatus } from "@/hook/query/lib";
import type { TGetManyPawmRes } from "@/api/endpoint/pawn";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

const NotPayable = () => (
  <div className="flex flex-col items-center justify-center gap-6 py-16 px-4 text-center">
    <p className="text-gray-500 text-lg">รายการนี้ยังไม่ถึงกำหนดชำระดอกเบี้ย</p>
    <NavLink
      to="/home"
      className="px-6 py-2 rounded-lg bg-yellow-400 text-white font-semibold hover:bg-yellow-500"
    >
      กลับหน้าหลัก
    </NavLink>
  </div>
);

function PawnInterestLoader({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const { getInterest, interest, isSuccess } = usePawnInterest();
  const custInfo = useCustInfo();
  const custCode = custInfo?.custNo;
  const queryClient = useQueryClient();

  // Gate 1: fast-block from cached pawn list (avoids unnecessary API call)
  const cachedPawns = queryClient.getQueryData<TGetManyPawmRes[]>([
    "pawn",
    "cust",
    custCode,
  ]);

  const cacheStatus = cachedPawns
    ? transformPawnStatus(cachedPawns).find((p) => p.pawnNumb === id)
        ?.pawnStatus
    : undefined;

  const isCachePayable = cacheStatus === "due" || cacheStatus === "due-soon";

  useEffect(() => {
    if (id && (cacheStatus === undefined || isCachePayable)) {
      getInterest(id);
    }
  }, [id, isCachePayable]);

  if (cacheStatus !== undefined && !isCachePayable) {
    return <NotPayable />;
  }

  // Gate 2: verify against interest result's dueDate (covers deep-links / stale cache)
  if (isSuccess && interest) {
    const today = dayjs().startOf("day");
    const interestStatus = mapDateIntoState(today)({
      nextPaidDate: interest.dueDate,
    }).pawnStatus;

    if (interestStatus !== "due" && interestStatus !== "due-soon") {
      return <NotPayable />;
    }
  }

  return <>{children}</>;
}

export default PawnInterestLoader;
