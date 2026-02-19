import { getHistPaidById } from "@/api/endpoint/pawn";
import { useQuery } from "@tanstack/react-query";

function usePaidPawn({ paidNumb }: { readonly paidNumb: string }) {
  return useQuery({
    queryKey: ["paid-pawn", paidNumb],
    queryFn: () => getHistPaidById({ paidNumb }),
    enabled: !!paidNumb,
  });
}

export default usePaidPawn;
