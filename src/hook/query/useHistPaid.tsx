import { getHistPaid } from "@/api/endpoint/pawn";
import { useAuthContext } from "@/context/AuthContext/AuthContext";
import { useQuery } from "@tanstack/react-query";

function useHistPaid() {
  const { auth } = useAuthContext();
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
