import FormControl from "@/component/FormControl/FormControl";
import { useMemo, useState, type PropsWithChildren } from "react";
import type { TSearchUserMethod, TSearchUserRes } from "@/types/register";
import { Button } from "@/component/Button";
import { searchLabelMapper, searchMethodMapper } from "./lib";
import DisplayCard from "@/component/ui/DisplayCard/DisplayCard";
import { useMutation } from "@tanstack/react-query";
import { REGISTER_API } from "@/api/endpoint/register";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSearchCustomerSchema } from "./validation";

type TSearchCustomerProps = {
  searchMethod: TSearchUserMethod;
};

type TSearchCustomerFormState = {
  searchValue: string;
};

function SearchCustomer({
  searchMethod,
  children,
}: PropsWithChildren<TSearchCustomerProps>) {
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
  const [userData, setUserData] = useState<TSearchUserRes | null>(null);

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
      setUserData(data);
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
      {userData && (
        <DisplayCard>
          <DisplayCard.Header>ข้อมูลสมาชิก</DisplayCard.Header>
          <DisplayCard.Mute>
            <span>ชื่อ</span>
            <span>{userData.fullname}</span>
          </DisplayCard.Mute>
          <DisplayCard.Mute>
            <span>เบอร์โทรศัพท์มือถือ</span>
            <span>{userData.mobileNo}</span>
          </DisplayCard.Mute>
          <DisplayCard.Divider />
          {children}
          <Button fullWidth>ยืนยันตัวตน</Button>
        </DisplayCard>
      )}
    </section>
  );
}

export default SearchCustomer;
