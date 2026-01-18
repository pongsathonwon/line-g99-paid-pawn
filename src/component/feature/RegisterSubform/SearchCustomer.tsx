import FormControl from "@/component/FormControl/FormControl";
import { useMemo, type PropsWithChildren } from "react";
import type { TSearchUserMethod, TSearchUserRes } from "@/types/register";
import { Button } from "@/component/Button";
import { searchMethodMapper } from "./lib";
import DisplayCard from "@/component/ui/DisplayCard/DisplayCard";
import RadioGroup, { type TRadioOption } from "@/component/ui/RadioGroup/RadioGroup";
import { useMutation } from "@tanstack/react-query";
import { REGISTER_API } from "@/api/endpoint/register";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSearchCustomerSchema } from "./validation";
import { useMultistepForm } from "@/context/MultistepFormContext/MultiStepFormContext";
import type { TMaybe } from "@/types/base.type";
import { REGISTER_LOCALE_TEXT } from "@/component/feature/RegisterForm/register.locale";

type TSearchCustomerProps = {
  searchMethod: TSearchUserMethod;
  userForm: TMaybe<TSearchUserRes>;
  onSetUser: (res: TSearchUserRes | null) => void;
  onChangeSearchMethod: (method: TSearchUserMethod) => void;
  locale: "th" | "en";
  mode?: "thai" | "foreign" | "foreign-counter";
  nationCode: string;
};

type TSearchCustomerFormState = {
  searchValue: string;
};

const SEARCH_METHOD_OPTIONS: {
  value: TSearchUserMethod;
  labelTh: string;
  labelEn: string;
}[] = [
  {
    value: "idCard",
    labelTh: "บัตรประชาชน / Passport",
    labelEn: "ID Card / Passport",
  },
  {
    value: "mobileNumber",
    labelTh: "เบอร์โทรศัพท์",
    labelEn: "Mobile Number",
  },
  {
    value: "custCode",
    labelTh: "รหัสลูกค้า",
    labelEn: "Customer Code",
  },
];

function SearchCustomer({
  searchMethod,
  userForm,
  onSetUser,
  onChangeSearchMethod,
  locale,
  mode,
  nationCode,
}: PropsWithChildren<TSearchCustomerProps>) {
  const t = REGISTER_LOCALE_TEXT[locale];
  const { next } = useMultistepForm();
  const validUserForm = userForm !== null;
  const radioOptions = useMemo((): TRadioOption<TSearchUserMethod>[] => {
    const filtered =
      mode === "foreign-counter"
        ? SEARCH_METHOD_OPTIONS.filter(
            (opt) => opt.value === "idCard" || opt.value === "custCode"
          )
        : SEARCH_METHOD_OPTIONS;

    return filtered.map((opt) => ({
      value: opt.value,
      label: locale === "th" ? opt.labelTh : opt.labelEn,
    }));
  }, [mode, locale]);

  const handleSearchMethodChange = (method: TSearchUserMethod) => {
    onChangeSearchMethod(method);
    onSetUser(null);
    reset({ searchValue: "" });
  };
  const requestKey = useMemo(
    () => searchMethodMapper(searchMethod),
    [searchMethod],
  );

  const searchLabel = useMemo(
    () => t.labels[searchMethod],
    [locale, searchMethod],
  );

  const validationSchema = useMemo(
    () =>
      createSearchCustomerSchema(searchMethod, {
        required: t.errors.requiredByField[searchMethod],
        pattern: t.errors.pattern[searchMethod],
      }),
    [locale, searchMethod],
  );

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<TSearchCustomerFormState>({
    defaultValues: { searchValue: "" },
    resolver: zodResolver(validationSchema),
  });

  const searchMutation = useMutation({
    mutationFn: (searchValue: string) =>
      REGISTER_API.searchUser({ [requestKey]: searchValue, nationCode }),
    onSuccess: (data) => {
      onSetUser(data);
    },
    onError: () => {
      setError("searchValue", {
        type: "manual",
        message: t.notFound,
      });
    },
  });

  const onSubmit = ({ searchValue }: TSearchCustomerFormState) => {
    searchMutation.mutate(searchValue);
  };

  const onGoNext = () => {
    if (!validUserForm) return;
    next();
  };

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-900">{t.searchTitle}</h2>

      <RadioGroup
        options={radioOptions}
        value={searchMethod}
        onChange={handleSearchMethodChange}
        label={locale === "th" ? "ค้นหาด้วย" : "Search By"}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="searchValue"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormControl.Label>{searchLabel}</FormControl.Label>
              <FormControl.Input {...field} />
              <FormControl.Error>
                {errors.searchValue?.message ?? " "}
              </FormControl.Error>
            </FormControl>
          )}
        />

        <Button fullWidth type="submit" disabled={searchMutation.isPending}>
          {searchMutation.isPending ? t.searching : t.searchButton}
        </Button>
      </form>

      {userForm && (
        <DisplayCard>
          <DisplayCard.Header>{t.memberInfo}</DisplayCard.Header>
          <DisplayCard.Mute>
            <span>{t.fullname}</span>
            <span>{userForm.fullname}</span>
          </DisplayCard.Mute>
          <DisplayCard.Mute>
            <span>{t.mobile}</span>
            <span>{userForm.mobileNo}</span>
          </DisplayCard.Mute>
          <DisplayCard.Divider />
          <Button fullWidth onClick={onGoNext}>
            {t.confirmIdentity}
          </Button>
        </DisplayCard>
      )}
    </section>
  );
}

export default SearchCustomer;
