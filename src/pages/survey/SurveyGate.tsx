import type { ReactNode } from "react";
import { Link, Navigate } from "react-router-dom";
import type { UseQueryResult } from "@tanstack/react-query";
import type { TSurveyTransactions } from "@/api/endpoint/survey";
import { Button } from "@/component/Button";
import { buttonVariants } from "@/component/button.variants";
import QueryLoading from "@/component/ui/QueryLoading";
import { SURVEY_TEXT } from "@/component/feature/SurveyForm/survey.locale";
import {
  getHttpStatus,
  isMemberServiceDown,
  isTestKeyRefused,
  surveyListPath,
  surveyRegisterPath,
} from "@/component/feature/SurveyForm/lib";
import { useSession } from "@/context/SessionContext/SessionContext";
import { ReloginButton, SurveyMessage, TestKeyRefused } from "./SurveyLayout";

const t = SURVEY_TEXT;

type TSurveyLoadErrorProps = {
  error: unknown;
  /** what failed to load, for errors that are not one of the known cases */
  title: string;
  onRetry: () => void;
  isRetrying?: boolean;
  onExitTestMode: () => void;
};

/** A failed survey call: refused test key, LINE login, Simatic down, other. */
export function SurveyLoadError({
  error,
  title,
  onRetry,
  isRetrying = false,
  onExitTestMode,
}: TSurveyLoadErrorProps) {
  if (isTestKeyRefused(error)) return <TestKeyRefused onExit={onExitTestMode} />;
  if (getHttpStatus(error) === 401) {
    return (
      <SurveyMessage title={t.errors.unauthorized} tone="error">
        <ReloginButton />
      </SurveyMessage>
    );
  }
  const memberServiceDown = isMemberServiceDown(error);
  return (
    <SurveyMessage
      title={memberServiceDown ? t.errors.memberServiceDown : title}
      tone="error"
    >
      {memberServiceDown && (
        <p className="text-gray-600">{t.errors.memberServiceDownHint}</p>
      )}
      <Button type="button" fullWidth disabled={isRetrying} onClick={onRetry}>
        {t.retry}
      </Button>
    </SurveyMessage>
  );
}

type TSurveyGateProps = {
  transactionsQuery: UseQueryResult<TSurveyTransactions, unknown>;
  branchParam: string | null;
  onExitTestMode: () => void;
  /** rendered only for a member, once the list is loaded */
  children: (data: TSurveyTransactions) => ReactNode;
};

/**
 * Loads GET /transactions and lets only members through (PV-20, PV-26).
 * Membership is GoldenApi's answer, not the g99-online session's.
 */
export function SurveyGate({
  transactionsQuery,
  branchParam,
  onExitTestMode,
  children,
}: TSurveyGateProps) {
  const { status } = useSession();

  if (transactionsQuery.isPending) return <QueryLoading />;
  if (transactionsQuery.isError) {
    return (
      <SurveyLoadError
        error={transactionsQuery.error}
        title={t.errors.loadList}
        onRetry={() => transactionsQuery.refetch()}
        isRetrying={transactionsQuery.isFetching}
        onExitTestMode={onExitTestMode}
      />
    );
  }

  const data = transactionsQuery.data;
  if (data.isMember) return <>{children(data)}</>;

  // a tester acting as someone else's uid is never sent to register
  if (data.testMode) {
    return (
      <SurveyMessage title={t.testMode.notMember} tone="info">
        <p className="text-gray-600">{t.testMode.notMemberHint}</p>
        <Button type="button" fullWidth styleType="outline" onClick={onExitTestMode}>
          {t.testMode.exit}
        </Button>
      </SurveyMessage>
    );
  }

  // g99-online already knows this LINE account (e.g. just registered) but
  // GoldenApi does not yet: register would send them straight back here
  if (status === "member") {
    return (
      <SurveyMessage title={t.errors.notMember} tone="info">
        <p className="text-gray-600">{t.errors.notMemberHint}</p>
        <Button
          type="button"
          fullWidth
          disabled={transactionsQuery.isFetching}
          onClick={() => transactionsQuery.refetch()}
        >
          {t.retry}
        </Button>
      </SurveyMessage>
    );
  }

  return <Navigate to={surveyRegisterPath(branchParam)} replace />;
}

export function BackToListLink({
  branchParam,
  primary = false,
  label = t.backToList,
}: {
  branchParam: string | null;
  primary?: boolean;
  label?: string;
}) {
  return (
    <Link
      to={surveyListPath(branchParam)}
      className={buttonVariants({
        fullWidth: true,
        styleType: primary ? undefined : "outline",
      })}
    >
      {label}
    </Link>
  );
}
