import PaidPawnCard from "@/component/ui/PaidPawnCard/PaidPawnCard";
import QueryError from "@/component/ui/QueryError";
import QueryLoading from "@/component/ui/QueryLoading";
import usePaidPawn from "@/hook/query/usePaidPawn";
import { useParams } from "react-router-dom";

function HistroyDetailPage() {
  const { paidNumb } = useParams();
  const parsePaidNumb = paidNumb ?? "";
  const { data, isLoading, isError, error } = usePaidPawn({
    paidNumb: parsePaidNumb,
  });

  if (isLoading) {
    return <QueryLoading />;
  }

  if (isError) {
    return <QueryError error={error} backTo="/history" />;
  }

  if (!data)
    return <div className="text-center text-gray-500 p-6">ไม่พบข้อมูล</div>;

  return <PaidPawnCard {...data} />;
}

export default HistroyDetailPage;

// select top 10
//     pp.paidNumb, pp.pawnDate as dueDate, pp.paidDate, pp. paidOrder
//     , pl.pawnPrice, pl.goodWeight, pl.goldType, pl.barPawnPrice, pl.goodRemark, pl.priceRemark
//     , ti.typeDesc , li.laiDesc ,ci.compDesc
// from paidPawn pp
// inner join pawnInfo pi on pp.pawnNumb = pi.pawnNumb
// inner join pawnList pl on  pp.pawnNumb = pl.pawnNumb
// inner join dbo.TypeInfo ti on pl.typeCode = ti.typeCode
// inner join dbo.LaiInfo li on pl.laiCode = li.laiCode
// inner join dbo.CompInfo ci on pl.compCode = ci.compCode
// where pl.pawnNumb = '3300196'
