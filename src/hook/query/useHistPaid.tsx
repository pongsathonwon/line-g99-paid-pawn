import { getHistPaid } from "@/api/endpoint/pawn";
import { useCustInfo } from "@/context/SessionContext/SessionContext";
import { useQuery } from "@tanstack/react-query";

function useHistPaid() {
  const auth = useCustInfo();
  const custCode = auth?.custNo ?? "";
  const q = useQuery({
    queryKey: ["hist-paid", custCode],
    queryFn: async ({ queryKey }) =>
      await getHistPaid({ custCode: queryKey[1] }),
    refetchOnWindowFocus: true,
  });
  return q;
}

export default useHistPaid;
