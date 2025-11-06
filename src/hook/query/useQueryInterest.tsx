import React from "react";
import { useQuery } from "@tanstack/react-query";

type TUseQueryInterestProps = {
  pawnNumb: string;
};

function useQueryInterest({ pawnNumb }: TUseQueryInterestProps) {
  const q = useQuery({
    queryKey: ["pawn", "item", pawnNumb],
    queryFn: () => ({}),
    initialData: null,
  });
  return q;
}

export default useQueryInterest;
