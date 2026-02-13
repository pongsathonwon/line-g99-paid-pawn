import DisplayCard from "@/component/ui/DisplayCard/DisplayCard";
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
    return <QueryError error={error} />;
  }

  if (!data) return <div className="text-center text-gray-500 p-6">ไม่พบข้อมูล</div>;

  return (
    <DisplayCard>
      <DisplayCard.Mute>
        <span>เลขที่สัญญา</span>
        <span>{data.pawnNumb}</span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>ครบกำหนด</span>
        <span>{data.dueDate}</span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>วันที่ชำระ</span>
        <span>{data.paidDate}</span>
      </DisplayCard.Mute>
      <DisplayCard.Summary>
        <span>ยอดชำระ</span>
        <span>{data.paidAmou} บาท</span>
      </DisplayCard.Summary>
      <DisplayCard.Mute>
        <span>ส่วนลดสมาชิก</span>
        <span>{data.paidDisc} บาท</span>
      </DisplayCard.Mute>
      <DisplayCard.Divider />
      <DisplayCard.Mute>
        <span>ชื่อลูกค้า</span>
        <span>{data.custName}</span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>สาขา</span>
        <span>{data.branchName}</span>
      </DisplayCard.Mute>
      <DisplayCard.Divider />
      <DisplayCard.Mute>
        <span>สินค้า</span>
        <span>
          {data.typeDesc} {data.goldType}
        </span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>น้ำหนัก</span>
        <span>{data.goodWeight} กรัม</span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>เงินต้น</span>
        <span>{data.pawnPrice} บาท</span>
      </DisplayCard.Mute>
      <DisplayCard.Mute>
        <span>ผู้ทำรายการ</span>
        <span>{data.emplName}</span>
      </DisplayCard.Mute>
    </DisplayCard>
  );
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
