import { REGISTER_API } from "@/api/endpoint/register";
import { useMutation } from "@tanstack/react-query";

function useCreateRegister() {
  const mutation = useMutation({
    mutationKey: [],
    mutationFn: REGISTER_API.registerRequest,
  });
  return mutation;
}

export default useCreateRegister;
