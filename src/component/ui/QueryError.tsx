import { Button } from "@/component";
import { parseApiError } from "@/zod/api-error";
import { AxiosError } from "axios";
import { NavLink } from "react-router-dom";

function getErrorMessage(error: Error | null): string {
  if (!error) return "";
  if (error instanceof AxiosError) {
    const body = parseApiError(error.response?.data);
    return body?.message ?? "เกิดข้อผิดพลาดในการโหลดข้อมูล";
  }
  return error.message ?? "เกิดข้อผิดพลาดในการโหลดข้อมูล";
}

type QueryErrorProps = {
  error: Error | null;
  backTo?: string;
};

function QueryError({ error, backTo = ".." }: QueryErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="text-red-600 font-semibold text-lg mb-2">
        เกิดข้อผิดพลาด
      </div>
      <div className="text-gray-700 mb-4">{getErrorMessage(error)}</div>
      <NavLink to={backTo}>
        <Button>กลับ</Button>
      </NavLink>
    </div>
  );
}

export default QueryError;
