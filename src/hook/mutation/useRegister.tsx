import { REGISTER_API } from "@/api/endpoint/register";
import { useMutation } from "@tanstack/react-query";

function useRegister() {
  const mutation = useMutation({
    mutationKey: [],
    mutationFn: REGISTER_API.registerUser,
  });
  return mutation;
}

export default useRegister;
