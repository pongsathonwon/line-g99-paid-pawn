import DisplayCard from "@/component/ui/DisplayCard/DisplayCard";
import useHistPaid from "@/hook/query/useHistPaid";
import { formatThaiDate } from "@/lib/date-time";

function HistoryPage() {
  const { data: histPaidData, isLoading } = useHistPaid();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!histPaidData || histPaidData.length === 0) {
    return (
      <div>
        <h3 className="font-semibold text-2xl text-center mb-6 lg:text-3xl">
          ประวัติการชำระเงิน
        </h3>
        <div className="text-center text-gray-500">ไม่มีประวัติการชำระ</div>;
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold text-2xl text-center mb-6 lg:text-3xl">
        ประวัติการชำระเงิน
      </h3>

      <ul className="flex flex-col gap-4">
        {histPaidData.map((item) => (
          <li key={item.paidNumb}>
            <DisplayCard
              withBorder
              color={item.paidStat === "1" ? "gold" : "red"}
            >
              <DisplayCard.Mute>
                <span>เลขที่สัญญา</span>
                <span>{item.pawnNumb}</span>
              </DisplayCard.Mute>
              <DisplayCard.Mute>
                <span>วันครบกำหนด</span>
                <span>{formatThaiDate(item.dueDate)}</span>
              </DisplayCard.Mute>
              <DisplayCard.Mute>
                <span>วันชำระ</span>
                <span>{formatThaiDate(item.paidDate)}</span>
              </DisplayCard.Mute>
              <DisplayCard.Summary>
                <span>ยอดชำระ</span>
                <span>{item.paidAmou.toLocaleString()} บาท</span>
              </DisplayCard.Summary>
              {item.paidDisc > 0 && (
                <DisplayCard.Mute>
                  <span className="text-green-300">ประหยัดไป</span>
                  <span className="text-green-300">
                    {item.paidDisc.toLocaleString()} บาท
                  </span>
                </DisplayCard.Mute>
              )}
            </DisplayCard>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoryPage;
