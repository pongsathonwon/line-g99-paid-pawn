import FormControl from "@/component/FormControl/FormControl";
import { useMemo, type PropsWithChildren } from "react";
import type { TSearchUserMethod, TSearchUserRes } from "@/types/register";
import { Button } from "@/component/Button";
import { searchLabelMapper, searchMethodMapper } from "./lib";
import DisplayCard from "@/component/ui/DisplayCard/DisplayCard";
import { useMutation } from "@tanstack/react-query";
import { REGISTER_API } from "@/api/endpoint/register";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSearchCustomerSchema } from "./validation";
import { useMultistepForm } from "@/context/MultistepFormContext/MultiStepFormContext";
import type { TMaybe } from "@/types/base.type";

type TSearchCustomerProps = {
  searchMethod: TSearchUserMethod;
  userForm: TMaybe<TSearchUserRes>;
  onSetUser: (res: TSearchUserRes) => void;
};

type TSearchCustomerFormState = {
  searchValue: string;
};

function SearchCustomer({
  searchMethod,
  userForm,
  onSetUser,
}: PropsWithChildren<TSearchCustomerProps>) {
  const { next } = useMultistepForm();
  const validUserForm = userForm !== null;
  const requestKey = useMemo(
    () => searchMethodMapper(searchMethod),
    [searchMethod]
  );
  const searchLabel = useMemo(
    () => searchLabelMapper(searchMethod),
    [searchMethod]
  );
  const validationSchema = useMemo(
    () => createSearchCustomerSchema(searchMethod),
    [searchMethod]
  );

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TSearchCustomerFormState>({
    defaultValues: { searchValue: "" },
    resolver: zodResolver(validationSchema),
  });

  const searchMutation = useMutation({
    mutationFn: (searchValue: string) =>
      REGISTER_API.searchUser({ [requestKey]: searchValue }),
    onSuccess: (data) => {
      onSetUser(data);
    },
    onError: (error: any) => {
      setError("searchValue", {
        type: "manual",
        message:
          error.message || "ไม่พบข้อมูลลูกค้า กรุณาตรวจสอบข้อมูลอีกครั้ง",
      });
    },
  });

  const onSubmit = ({ searchValue }: TSearchCustomerFormState) => {
    searchMutation.mutate(searchValue);
  };

  const onGoNext = () => {
    if (!validUserForm) {
      return;
    }
    next();
  };

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">ค้นหาสมาชิก</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="searchValue"
          control={control}
          rules={{ maxLength: 13, minLength: 13 }}
          render={({ field }) => (
            <FormControl>
              <FormControl.Label>{searchLabel}</FormControl.Label>
              <FormControl.Input type="numberic" {...field} />
              <FormControl.Error>
                {errors.searchValue?.message ?? " "}
              </FormControl.Error>
            </FormControl>
          )}
        />
        <Button fullWidth type="submit" disabled={searchMutation.isPending}>
          {searchMutation.isPending ? "กำลังค้นหา..." : "ค้นหา"}
        </Button>
      </form>
      {userForm && (
        <DisplayCard>
          <DisplayCard.Header>ข้อมูลสมาชิก</DisplayCard.Header>
          <DisplayCard.Mute>
            <span>ชื่อ</span>
            <span>{userForm.fullname}</span>
          </DisplayCard.Mute>
          <DisplayCard.Mute>
            <span>เบอร์โทรศัพท์มือถือ</span>
            <span>{userForm.mobileNo}</span>
          </DisplayCard.Mute>
          <DisplayCard.Divider />
          <Button fullWidth onClick={onGoNext} disabled={!validUserForm}>
            ยืนยันตัวตน
          </Button>
        </DisplayCard>
      )}
    </section>
  );
}

export default SearchCustomer;
