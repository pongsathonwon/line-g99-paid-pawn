import { type PropsWithChildren } from "react";
import { PawnInterestContext } from "./PawnInterest";
import { useMutation } from "@tanstack/react-query";
import { getPawnInterest } from "@/api/endpoint/pawn";
import { useCustInfo } from "../AuthContext/AuthContext";

function PawnInterestContextProvider({ children }: PropsWithChildren) {
  const custInfo = useCustInfo();
  const custCode = custInfo?.custNo;
  const { data, mutate, mutateAsync, ...res } = useMutation({
    mutationFn: getPawnInterest,
    mutationKey: ["pawn", "pawnNumb"],
    onSuccess: (res) => {
      console.log(res);
    },
    onError: console.error,
  });
  const getInterest = (pawnNumb: string) => {
    if (!custCode) throw new Error("custCode is required");
    mutate({ pawnNumb, custCode });
  };

  return (
    <PawnInterestContext.Provider
      value={{
        data,
        getInterest,
        ...res,
      }}
    >
      {children}
    </PawnInterestContext.Provider>
  );
}

export default PawnInterestContextProvider;
