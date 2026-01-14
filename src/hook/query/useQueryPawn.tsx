import { getManyPawnByCust } from "@/api/endpoint/pawn";
import { useQuery } from "@tanstack/react-query";
import { transformPawnStatus } from "./lib";

type TUseQueryPawnByIdProps = {
  custCode?: string;
};

function useQueryPawnById({ custCode }: TUseQueryPawnByIdProps) {
  const q = useQuery({
    queryKey: ["pawn", "cust", custCode],
    queryFn: async ({ queryKey }) => await getManyPawnByCust({ custCode }),
    select: transformPawnStatus,
    refetchOnWindowFocus: true,
  });
  const canBePaid = q.data?.filter(({ pawnStatus }) =>
    ["due", "due-soon"].includes(pawnStatus)
  );
  const cannotBePaid = q.data?.filter(({ pawnStatus }) =>
    ["normal", "overdue"].includes(pawnStatus)
  );
  return { ...q, cannotBePaid, canBePaid };
}

export default useQueryPawnById;
