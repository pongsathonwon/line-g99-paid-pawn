import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  SURVEY_API,
  type TSurveyAnswer,
  type TSurveyResponseRes,
  type TSurveyTransaction,
} from "@/api/endpoint/survey";
import QueryLoading from "@/component/ui/QueryLoading";
import SurveyForm from "@/component/feature/SurveyForm/SurveyForm";
import SurveyTxnCard from "@/component/feature/SurveyForm/SurveyTxnCard";
import { SURVEY_TEXT } from "@/component/feature/SurveyForm/survey.locale";
import {
  getHttpStatus,
  getResultCode,
  getSurveyEntry,
  isMemberServiceDown,
  isTestKeyRefused,
  retryOnServiceUnavailable,
  surveyListPath,
} from "@/component/feature/SurveyForm/lib";
import { useToast } from "@/context/ToastContext/ToastContext";
import SurveyLayout, { SurveyMessage } from "./SurveyLayout";
import { BackToListLink, SurveyGate, SurveyLoadError } from "./SurveyGate";
import {
  SURVEY_TRANSACTIONS_KEY,
  useSurveyTransactions,
} from "./useSurveyTransactions";

const t = SURVEY_TEXT;
// long enough to read before the page changes (the app default is 1 s)
const TOAST_MS = 4000;

/** Submit refused for this transaction: the page shows why, with a way back. */
type TBlocked = "notFound" | "notEligible";

/**
 * /survey/t/:txnType/:docNumb?b=: rate one transaction. The summary comes
 * from GET /transactions (also after a refresh); only {txnType, docNumb} are
 * sent, GoldenApi takes branch, type and time from POS (PV-25).
 */
function SurveyTxnPage() {
  const { txnType, docNumb } = useParams();
  const { branchParam, testMode, exitTestMode, transactionsQuery } =
    useSurveyTransactions();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const [result, setResult] = useState<TSurveyResponseRes | null>(null);
  const [blocked, setBlocked] = useState<TBlocked | null>(null);

  // opened from a scrolled list: start at the transaction summary
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formQuery = useQuery({
    queryKey: ["survey-form", testMode?.test, testMode?.uid],
    queryFn: SURVEY_API.getForm,
    retry: retryOnServiceUnavailable,
    staleTime: Infinity,
  });

  const refreshList = () =>
    queryClient.invalidateQueries({ queryKey: [SURVEY_TRANSACTIONS_KEY] });
  const backToList = () =>
    navigate(surveyListPath(branchParam), { replace: true });

  const submitMutation = useMutation({
    mutationFn: SURVEY_API.submitResponse,
    onSuccess: (res) => {
      setResult(res);
      refreshList();
    },
    onError: (error) => {
      const status = getHttpStatus(error);
      const code = getResultCode(error);
      if (code === "40901") {
        // someone (or another device) rated it first
        toast.warning(t.errors.alreadySurveyed, TOAST_MS);
        refreshList();
        backToList();
        return;
      }
      if (code === "40401" || code === "42201") {
        setBlocked(code === "40401" ? "notFound" : "notEligible");
        refreshList();
        return;
      }
      if (code === "40301") {
        // no longer a member: the list sends them on to register
        refreshList();
        backToList();
        return;
      }
      if (status === 409) {
        // 40900: the question set was replaced while the page was open
        toast.warning(t.errors.setChanged, TOAST_MS);
        formQuery.refetch();
        return;
      }
      if (isTestKeyRefused(error)) {
        toast.error(t.testMode.refusedTitle, TOAST_MS);
        return;
      }
      if (isMemberServiceDown(error)) {
        toast.error(`${t.errors.memberServiceDown} ${t.errors.memberServiceDownHint}`, TOAST_MS);
        return;
      }
      toast.error(status === 401 ? t.errors.unauthorized : t.errors.submit, TOAST_MS);
    },
  });

  const submit = (txn: TSurveyTransaction, answers: TSurveyAnswer[]) => {
    if (!formQuery.data) return;
    submitMutation.mutate({
      setId: formQuery.data.questionSet.setId,
      txnType: txn.txnType,
      docNumb: txn.docNumb,
      entry: getSurveyEntry(branchParam),
      answers,
    });
  };

  const renderTxn = (items: TSurveyTransaction[]) => {
    const txn = items.find(
      (item) => item.txnType === txnType && item.docNumb === docNumb,
    );
    if (!txn) {
      return (
        <SurveyMessage title={t.errors.txnNotFound} tone="info">
          <p className="text-gray-600">{t.errors.txnNotFoundHint}</p>
          <BackToListLink branchParam={branchParam} primary />
        </SurveyMessage>
      );
    }
    if (txn.surveyed) {
      return (
        <SurveyMessage title={t.errors.alreadySurveyed} tone="info">
          <SurveyTxnCard txn={txn} />
          <BackToListLink branchParam={branchParam} primary />
        </SurveyMessage>
      );
    }
    return (
      <>
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            {formQuery.data?.questionSet.title || t.title}
          </h1>
          <h2 className="text-sm font-medium text-gray-600">{t.form.heading}</h2>
          <SurveyTxnCard txn={txn} />
        </div>
        {formQuery.isPending ? (
          <QueryLoading />
        ) : formQuery.isError ? (
          <SurveyLoadError
            error={formQuery.error}
            title={t.errors.loadForm}
            onRetry={() => formQuery.refetch()}
            isRetrying={formQuery.isFetching}
            onExitTestMode={exitTestMode}
          />
        ) : (
          <SurveyForm
            key={formQuery.data.questionSet.setId}
            questionSet={formQuery.data.questionSet}
            onSubmit={(answers) => submit(txn, answers)}
            isPending={submitMutation.isPending}
          />
        )}
      </>
    );
  };

  const renderContent = () => {
    if (result) {
      return (
        <SurveyMessage title={t.thankYou.title} tone="success">
          <p className="text-gray-600">{t.thankYou.message}</p>
          <BackToListLink branchParam={branchParam} primary label={t.thankYou.another} />
        </SurveyMessage>
      );
    }
    if (blocked) {
      const notFound = blocked === "notFound";
      return (
        <SurveyMessage
          title={notFound ? t.errors.txnNotFound : t.errors.txnNotEligible}
          tone="error"
        >
          <p className="text-gray-600">
            {notFound ? t.errors.txnNotFoundHint : t.errors.txnNotEligibleHint}
          </p>
          <BackToListLink branchParam={branchParam} primary />
        </SurveyMessage>
      );
    }
    return (
      <SurveyGate
        transactionsQuery={transactionsQuery}
        branchParam={branchParam}
        onExitTestMode={exitTestMode}
      >
        {(data) => renderTxn(data.items)}
      </SurveyGate>
    );
  };

  const data = transactionsQuery.data;
  return (
    <SurveyLayout isTestMode={Boolean(data?.testMode)} testUid={data?.effectiveUid}>
      {renderContent()}
    </SurveyLayout>
  );
}

export default SurveyTxnPage;
