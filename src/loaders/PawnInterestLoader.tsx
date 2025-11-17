import { usePawnInterest } from "@/context/PawnInterestContext/PawnInterest";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function PawnInterestLoader({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const { getInterest } = usePawnInterest();

  useEffect(() => {
    if (id) {
      getInterest(id);
    }
  }, [id]);

  return <>{children}</>;
}

export default PawnInterestLoader;
