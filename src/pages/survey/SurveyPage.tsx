import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SURVEY_API, type TSurveyResponseRes } from "@/api/endpoint/survey";
import { Button } from "@/component/Button";
import { buttonVariants } from "@/component/button.variants";
import QueryLoading from "@/component/ui/QueryLoading";
import SurveyForm from "@/component/feature/SurveyForm/SurveyForm";
import { SURVEY_TEXT } from "@/component/feature/SurveyForm/survey.locale";
import {
  SURVEY_REGISTER_PATH,
  getHttpStatus,
  isTestKeyRefused,
  retryOnServiceUnavailable,
} from "@/component/feature/SurveyForm/lib";
import {
  clearSurveyTestMode,
  syncSurveyTestMode,
} from "@/lib/survey-test-mode";
import { useLineContext } from "@/context/LineContext/LineContext";
import { useToast } from "@/context/ToastContext/ToastContext";
import SurveyLayout, {
  ReloginButton,
  SurveyMessage,
  TestKeyRefused,
} from "./SurveyLayout";

const t = SURVEY_TEXT;

function SurveyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const branchParam = searchParams.get("b");
  // read ?test=&uid= once, before the first /form call sends the headers
  const [testMode, setTestMode] = useState(() =>
    syncSurveyTestMode(searchParams),
  );
  const { lineCtx } = useLineContext();
  const isLineReady = Boolean(lineCtx?.isLogin);
  const toast = useToast();
  const [result, setResult] = useState<TSurveyResponseRes | null>(null);

  const formQuery = useQuery({
    queryKey: ["survey-form", branchParam, testMode?.test, testMode?.uid],
    queryFn: () => SURVEY_API.getForm(branchParam),
    enabled: isLineReady,
    retry: retryOnServiceUnavailable,
    staleTime: Infinity,
  });

  const submitMutation = useMutation({
    mutationFn: SURVEY_API.submitResponse,
    onSuccess: setResult,
    onError: (error) => {
      const status = getHttpStatus(error);
      if (status === 409) {
        // the question set was replaced while the page was open
        toast.warning(t.errors.setChanged);
        formQuery.refetch();
        return;
      }
      if (isTestKeyRefused(error)) {
        toast.error(t.testMode.refusedTitle);
        return;
      }
      toast.error(status === 401 ? t.errors.unauthorized : t.errors.submit);
    },
  });

  const exitTestMode = () => {
    clearSurveyTestMode();
    setTestMode(null);
    const next = new URLSearchParams(searchParams);
    next.delete("test");
    next.delete("uid");
    setSearchParams(next, { replace: true });
  };

  const renderContent = () => {
    if (result) return <SurveyThankYou isMember={result.isMember} />;
    if (!isLineReady || formQuery.isPending) return <QueryLoading />;
    if (formQuery.isError) {
      if (isTestKeyRefused(formQuery.error)) {
        return <TestKeyRefused onExit={exitTestMode} />;
      }
      return getHttpStatus(formQuery.error) === 401 ? (
        <SurveyMessage title={t.errors.unauthorized} tone="error">
          <ReloginButton />
        </SurveyMessage>
      ) : (
        <SurveyMessage title={t.errors.loadForm} tone="error">
          <Button type="button" fullWidth onClick={() => formQuery.refetch()}>
            {t.retry}
          </Button>
        </SurveyMessage>
      );
    }
    return (
      <>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {formQuery.data.questionSet.title || t.title}
          </h1>
          <p className="text-sm text-gray-600">{t.subtitle}</p>
        </div>
        <SurveyForm
          key={formQuery.data.questionSet.setId}
          form={formQuery.data}
          onSubmit={(req) => submitMutation.mutate(req)}
          isPending={submitMutation.isPending}
        />
      </>
    );
  };

  return (
    <SurveyLayout
      isTestMode={Boolean(formQuery.data?.testMode)}
      testUid={formQuery.data?.effectiveUid}
    >
      {renderContent()}
    </SurveyLayout>
  );
}

function SurveyThankYou({ isMember }: { isMember: boolean }) {
  return (
    <SurveyMessage title={t.thankYou.title} tone="success">
      <p className="text-gray-600">{t.thankYou.message}</p>
      {isMember ? (
        <Link
          to="/home"
          className={buttonVariants({ fullWidth: true, styleType: "outline" })}
        >
          {t.home}
        </Link>
      ) : (
        <>
          <p className="text-sm text-gray-600">{t.thankYou.nonMember}</p>
          <Link
            to={SURVEY_REGISTER_PATH}
            className={buttonVariants({ fullWidth: true })}
          >
            {t.thankYou.linkAccount}
          </Link>
        </>
      )}
    </SurveyMessage>
  );
}

export default SurveyPage;
