import type { TSurveyTransactions } from "@/api/endpoint/survey";
import SurveyTxnCard from "@/component/feature/SurveyForm/SurveyTxnCard";
import { SURVEY_TEXT } from "@/component/feature/SurveyForm/survey.locale";
import { surveyFormPath } from "@/component/feature/SurveyForm/lib";
import SurveyLayout, { SurveyMessage } from "./SurveyLayout";
import { SurveyGate } from "./SurveyGate";
import { useSurveyTransactions } from "./useSurveyTransactions";

const t = SURVEY_TEXT;

/**
 * /survey?b=: the member's own transactions of the last 30 days (PV-21,
 * PV-22). The QR's branch only sorts first (PV-28); GoldenApi does the order.
 */
function SurveyPage() {
  const { branchParam, exitTestMode, transactionsQuery } =
    useSurveyTransactions();
  const data = transactionsQuery.data;

  return (
    <SurveyLayout isTestMode={Boolean(data?.testMode)} testUid={data?.effectiveUid}>
      <SurveyGate
        transactionsQuery={transactionsQuery}
        branchParam={branchParam}
        onExitTestMode={exitTestMode}
      >
        {(loaded) => (
          <TransactionList data={loaded} branchParam={branchParam} />
        )}
      </SurveyGate>
    </SurveyLayout>
  );
}

function TransactionList({
  data,
  branchParam,
}: {
  data: TSurveyTransactions;
  branchParam: string | null;
}) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <p className="text-sm text-gray-600">{t.subtitle}</p>
      </div>
      {data.items.length === 0 ? (
        <SurveyMessage title={t.list.empty} tone="info" />
      ) : (
        <section className="flex flex-col gap-3" aria-labelledby="survey-list-heading">
          <div className="flex flex-col gap-1">
            <h2 id="survey-list-heading" className="text-lg font-bold text-gray-900">
              {t.list.heading}
            </h2>
            <p className="text-sm text-gray-500">{t.list.hint(data.windowDays)}</p>
          </div>
          <ul className="flex flex-col gap-3">
            {data.items.map((txn) => (
              <li key={`${txn.txnType}-${txn.docNumb}`}>
                <SurveyTxnCard txn={txn} to={surveyFormPath(txn, branchParam)} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

export default SurveyPage;
