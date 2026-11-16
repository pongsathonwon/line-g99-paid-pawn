import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SURVEY_API } from "@/api/endpoint/survey";
import {
  parseBranchParam,
  retryOnServiceUnavailable,
} from "@/component/feature/SurveyForm/lib";
import {
  clearSurveyTestMode,
  syncSurveyTestMode,
} from "@/lib/survey-test-mode";

export const SURVEY_TRANSACTIONS_KEY = "survey-transactions";

/**
 * State shared by the list and the form: ?b, test mode and the member's
 * GET /transactions. The form reads its transaction from the same query, so
 * a deep link or a refresh on /survey/t/... works without the list page.
 */
export function useSurveyTransactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const branchParam = parseBranchParam(searchParams);
  // read ?test=&uid= once, before the first call sends the headers
  const [testMode, setTestMode] = useState(() =>
    syncSurveyTestMode(searchParams),
  );

  const transactionsQuery = useQuery({
    queryKey: [SURVEY_TRANSACTIONS_KEY, branchParam, testMode?.test, testMode?.uid],
    queryFn: () => SURVEY_API.getTransactions(branchParam),
    retry: retryOnServiceUnavailable,
    // list -> form reuses the list; a submit invalidates it
    staleTime: 60_000,
  });

  const exitTestMode = () => {
    clearSurveyTestMode();
    setTestMode(null);
    const next = new URLSearchParams(searchParams);
    next.delete("test");
    next.delete("uid");
    setSearchParams(next, { replace: true });
  };

  return { branchParam, testMode, exitTestMode, transactionsQuery };
}
