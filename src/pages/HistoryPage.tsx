import HistoryCard from "@/component/ui/HistoryCard/HistoryCard";
import useHistPaid from "@/hook/query/useHistPaid";

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
    <>
      <h3 className="font-semibold text-2xl text-center mb-6 lg:text-3xl">
        ประวัติการชำระเงิน
      </h3>

      <ul className="flex flex-col gap-4">
        {histPaidData.map((item) => (
          <li key={item.paidNumb}>
            <HistoryCard {...item} />
          </li>
        ))}
      </ul>
      <div className="mt-auto text-center text-gray-400 p-2">
        ยอดชำระไม่รวมค่าธรรมเนียม 5 บาท
      </div>
    </>
  );
}

export default HistoryPage;
