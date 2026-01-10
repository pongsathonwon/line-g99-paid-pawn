import type {
  TGetPawnInterestReq,
  TGetPawnInterestRes,
} from "@/api/endpoint/pawn";
import type { TMaybe } from "@/types/base.type";
import type { UseMutationResult } from "@tanstack/react-query";
import React from "react";

export const PawnInterestContext =
  React.createContext<TMaybe<TPawnInterestContext>>(null);

export const usePawnInterestContext = () => {
  const ctx = React.useContext(PawnInterestContext);
  if (ctx === null) throw new Error("pawn interest ctx provider required");
  return ctx;
};

export const usePawnInterest = () => {
  const { data, getInterest, isIdle, isPaused, isSuccess, isError, error } =
    usePawnInterestContext();
  return {
    interest: data,
    getInterest,
    isIdle,
    isPaused,
    isSuccess,
    isError,
    error,
  };
};

type TPawnInterestContext = { getInterest: (pawnNumb: string) => void } & Omit<
  UseMutationResult<TGetPawnInterestRes, Error, TGetPawnInterestReq>,
  "mutate" | "mutateAsync"
>;
