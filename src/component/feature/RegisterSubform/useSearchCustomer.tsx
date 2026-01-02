import { REGISTER_API } from "@/api/endpoint/register";
import { useMutation } from "@tanstack/react-query";

function useSearchCustomer() {
  const mutate = useMutation({
    mutationKey: ["search-cust"],
    mutationFn: REGISTER_API.searchUser,
  });
  return mutate;
}

export default useSearchCustomer;
