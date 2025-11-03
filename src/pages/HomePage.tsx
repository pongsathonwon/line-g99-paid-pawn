import React from "react";
import { useAuthContext } from "@/context/AuthContext/AuthContext";
import useQueryPawnById from "@/hook/query/useQueryPawn";
import { NavLink } from "react-router-dom";

function HomePage() {
  const { token } = useAuthContext();
  const { data, isError, error, isLoading } = useQueryPawnById({
    custCode: "1200441",
  });
  if (isLoading) {
    return <div>loading ...</div>;
  }
  if (isError) {
    return <div>{error.message}</div>;
  }
  return (
    <>
      <h3 className="font-semibold text-2xl text-center mb-6">รายการขายฝาก</h3>
      <div className="flex flex-col gap-4 overflow-hidden">
        {data.map(({ pawnNumb, pawnPrice, nextPaidDate }) => (
          <div key={pawnNumb} className="bg-gray-100 p-4 rounded-lg">
            <NavLink to={`${pawnNumb}`}>
              <div className="flex justify-between">
                <span>เลขใบรับฝาก</span>
                <span>{pawnNumb}</span>
              </div>
              <div className="flex justify-between">
                <span>เงินต้น</span>
                <span>{pawnPrice.toLocaleString("us-en")}</span>
              </div>
              <div className="flex justify-between">
                <span>วันครบกำหนด</span>
                <span>{nextPaidDate}</span>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </>
  );
}

export default HomePage;
