import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { TSurveyTransaction } from "@/api/endpoint/survey";
import { cn } from "@/utils";
import { SURVEY_TEXT } from "./survey.locale";
import { formatAmount, formatTxnAt } from "./lib";

const t = SURVEY_TEXT.list;

type TSurveyTxnCardProps = {
  txn: TSurveyTransaction;
  /** the form for this transaction; without it the card is not a link */
  to?: string;
};

/**
 * One POS transaction: type, date and time, branch, document number, amount.
 * A rated one shows "ประเมินแล้ว" and is never a link (PV-23).
 */
function SurveyTxnCard({ txn, to }: TSurveyTxnCardProps) {
  const isLink = Boolean(to) && !txn.surveyed;
  const body = (
    <>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-gray-900">{txn.label}</span>
          {txn.surveyed && (
            <span className="rounded-full bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5">
              {t.surveyed}
            </span>
          )}
        </div>
        <span className="text-sm text-gray-600">
          {formatTxnAt(txn.txnAt)} · {t.branch} {txn.branchShortName}
        </span>
        <span className="text-xs text-gray-500">
          {t.docNumb} {txn.docNumb}
        </span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className="font-semibold text-gray-900">
          {formatAmount(txn.amount)}
        </span>
        {isLink && <ChevronRight aria-hidden className="w-5 h-5 text-gray-400" />}
      </div>
    </>
  );

  const className = cn(
    "flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm",
    isLink && "transition hover:border-brand-red active:bg-gray-50",
    txn.surveyed && to !== undefined && "opacity-60",
  );

  if (to && isLink) {
    return (
      <Link to={to} className={className} data-testid="survey-txn-card">
        {body}
      </Link>
    );
  }
  return (
    <div
      className={className}
      data-testid="survey-txn-card"
      aria-disabled={txn.surveyed || undefined}
    >
      {body}
    </div>
  );
}

export default SurveyTxnCard;
