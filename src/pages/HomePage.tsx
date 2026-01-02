import { useCustInfo } from "@/context/AuthContext/AuthContext";
import useQueryPawnById from "@/hook/query/useQueryPawn";
import { NavLink } from "react-router-dom";
import PayCard from "@/component/ui/PayCard/PayCard";
//const ccREF = ["1200441", "626972", "606085", "625220"];

function HomePage() {
  const custInfo = useCustInfo();
  const custCode = custInfo?.custNo;
  const { data, isError, error, isLoading } = useQueryPawnById({
    custCode,
  });
  if (isLoading) {
    return <div>loading ...</div>;
  }
  if (isError) {
    return <div>{error.message}</div>;
  }
  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="font-semibold text-2xl text-center mb-6 lg:text-3xl">
        รายการขายฝาก
      </h3>
      <div className="flex flex-col gap-4 items-center w-full md:gap-8">
        {data?.map(({ pawnNumb, pawnPrice, nextPaidDate }) => (
          <NavLink to={pawnNumb} className="w-full flex justify-center">
            <PayCard
              key={pawnNumb}
              contractNumber={pawnNumb}
              principal={pawnPrice}
              dueDate={nextPaidDate}
              paymentLink={pawnNumb}
            />
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
