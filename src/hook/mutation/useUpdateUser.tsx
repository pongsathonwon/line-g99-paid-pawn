import { REGISTER_API } from "@/api/endpoint/register";
import { useMutation } from "@tanstack/react-query";

function useUpdateUser() {
  const mutation = useMutation({
    mutationKey: [],
    mutationFn: REGISTER_API.updateUser,
  });
  return mutation;
}

export default useUpdateUser;
