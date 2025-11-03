import { getManyPawnByCust } from "@/api/endpoint/pawn";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type TUseQueryPawnByIdProps = {
  custCode: string;
};

function useQueryPawnById({ custCode }: TUseQueryPawnByIdProps) {
  const q = useQuery({
    queryKey: ["pawn-cust", custCode],
    queryFn: async ({ queryKey }) => await getManyPawnByCust({ custCode }),
    initialData: [],
  });
  return q;
}

export default useQueryPawnById;
