import type { TGetHistPaidRes, TGetManyPawmRes } from "@/api/endpoint/pawn";
import { Button } from "@/component";
import type {
  ButtonColor,
  ButtonSize,
  ButtonStyleType,
} from "@/component/Button";
import FormControl, { type TColor } from "@/component/FormControl";
import HistoryCard from "@/component/ui/HistoryCard/HistoryCard";
import PayCard from "@/component/ui/PayCard/PayCard";
import Toast from "@/component/ui/Toast/Toast";
import type { TPawnStatusEnum } from "@/hook/query/lib";
import type { TToast } from "@/types/toast.type";

const formFieldStyle: Array<{
  color: TColor;
  label: string;
  helper?: string;
  error?: string;
}> = [
  {
    color: "base",
    label: "พื้น",
  },
  {
    color: "gold",
    label: "สีทอง",
  },
  {
    color: "base",
    label: "พื้น",
    helper: "กรอกข้อมูล",
  },
  {
    color: "gold",
    label: "สีทอง",
    helper: "กรอกข้อมูล",
  },
  {
    color: "base",
    label: "พื้น",
    error: "ข้อมูลไม่ถูกต้อง",
  },
  {
    color: "gold",
    label: "สีทอง",
    error: "ข้อมูลไม่ถูกต้อง",
  },
];

const buttonStyle: Array<{
  color: ButtonColor;
  styleType: ButtonStyleType;
  size: ButtonSize;
}> = [
  { color: "black", styleType: "solid", size: "lg" },
  { color: "gold", styleType: "solid", size: "lg" },
  { color: "primary", styleType: "solid", size: "lg" },
  { color: "secondary", styleType: "solid", size: "lg" },
  { color: "green", styleType: "solid", size: "lg" },
  { color: "black", styleType: "outline", size: "lg" },
  { color: "gold", styleType: "outline", size: "lg" },
  { color: "primary", styleType: "outline", size: "lg" },
  { color: "secondary", styleType: "outline", size: "lg" },
  { color: "green", styleType: "outline", size: "lg" },
  { color: "black", styleType: "solid", size: "sm" },
  { color: "gold", styleType: "solid", size: "sm" },
  { color: "primary", styleType: "solid", size: "sm" },
  { color: "secondary", styleType: "solid", size: "sm" },
  { color: "green", styleType: "solid", size: "sm" },
  { color: "black", styleType: "outline", size: "sm" },
  { color: "gold", styleType: "outline", size: "sm" },
  { color: "primary", styleType: "outline", size: "sm" },
  { color: "secondary", styleType: "outline", size: "sm" },
  { color: "green", styleType: "outline", size: "sm" },
];

const pawnList: Array<TGetManyPawmRes & { pawnStatus: TPawnStatusEnum }> = [
  {
    pawnNumb: "1234",
    pawnPrice: 10,
    pawnStatus: "normal",
    interest: 20,
    interestMonth: 1,
    goodWeight: 1,
    nextPaidDate: "2025-01-01",
  },
  {
    pawnNumb: "1234",
    pawnPrice: 10,
    pawnStatus: "due-soon",
    interest: 20,
    interestMonth: 1,
    goodWeight: 1,
    nextPaidDate: "2025-01-01",
  },
  {
    pawnNumb: "1234",
    pawnPrice: 10,
    pawnStatus: "due",
    interest: 20,
    interestMonth: 1,
    goodWeight: 1,
    nextPaidDate: "2025-01-01",
  },
  {
    pawnNumb: "1234",
    pawnPrice: 10,
    pawnStatus: "overdue",
    interest: 20,
    interestMonth: 1,
    goodWeight: 1,
    nextPaidDate: "2025-01-01",
  },
];

const historyList: Array<
  Pick<
    TGetHistPaidRes,
    "paidStat" | "pawnNumb" | "paidDisc" | "paidAmou" | "paidDate" | "dueDate"
  >
> = [
  {
    paidAmou: 20,
    pawnNumb: "123456",
    paidDisc: 0,
    paidDate: "2025-01-31",
    dueDate: "2025-01-31",
    paidStat: "1",
  },
  {
    paidAmou: 100,
    pawnNumb: "123456",
    paidDisc: 10,
    paidDate: "2025-01-30",
    dueDate: "2025-01-31",
    paidStat: "1",
  },
  {
    paidAmou: 20,
    pawnNumb: "123456",
    paidDisc: 0,
    paidDate: "2025-01-31",
    dueDate: "2025-01-31",
    paidStat: "2",
  },
  {
    paidAmou: 100,
    pawnNumb: "123456",
    paidDisc: 10,
    paidDate: "2025-01-30",
    dueDate: "2025-01-31",
    paidStat: "2",
  },
];

const toastList: Array<TToast> = [
  { id: "4", type: "info", message: "info" },
  { id: "2", type: "success", message: "success" },
  { id: "3", type: "warning", message: "warning" },
  { id: "1", type: "error", message: "error" },
];

function TestPage() {
  return (
    <section>
      <div className="flex flex-col p-4 gap-4">
        <span>input box</span>
        {formFieldStyle.map(({ color, label, helper, error }, i) => (
          <FormControl color={color} key={i}>
            <FormControl.Label>{label}</FormControl.Label>
            <FormControl.Input placeholder="กรอก" />
            {helper && <FormControl.Helper>{helper}</FormControl.Helper>}
            {error && <FormControl.Error>{error}</FormControl.Error>}
          </FormControl>
        ))}
        <span>button</span>
        {buttonStyle.map((b, i) => (
          <Button
            {...b}
            key={i}
          >{`${b.color}-${b.styleType}-${b.size}`}</Button>
        ))}
        <span>pawn card</span>
        {pawnList.map(
          ({ pawnNumb, pawnPrice, nextPaidDate, pawnStatus }, i) => (
            <PayCard
              key={i}
              dateDiff={20}
              contractNumber={pawnNumb}
              principal={pawnPrice}
              dueDate={nextPaidDate}
              pawnStatus={pawnStatus}
            />
          ),
        )}
        <span>history card</span>
        {historyList.map((h, i) => (
          <HistoryCard {...h} key={i} />
        ))}
        <span>toast</span>
        {toastList.map((t, i) => (
          <Toast toast={t} key={i} />
        ))}
      </div>
    </section>
  );
}

export default TestPage;
