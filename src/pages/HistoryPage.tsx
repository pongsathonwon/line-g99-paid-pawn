import HistoryCard from "@/component/ui/HistoryCard/HistoryCard";
import QueryError from "@/component/ui/QueryError";
import QueryLoading from "@/component/ui/QueryLoading";
import useHistPaid from "@/hook/query/useHistPaid";
import { NavLink } from "react-router-dom";

function HistoryPage() {
  const { data: histPaidData, isLoading, isError, error } = useHistPaid();

  if (isLoading) {
    return <QueryLoading />;
  }

  if (isError) {
    return <QueryError error={error} />;
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
            <NavLink to={item.paidNumb}>
              <HistoryCard {...item} />
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-auto text-center text-gray-400 p-2">
        ยอดชำระไม่รวมค่าธรรมเนียมธนาคาร 5 บาท
      </div>
    </>
  );
}

export default HistoryPage;
