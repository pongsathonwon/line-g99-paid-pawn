import { useState, type ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { REGISTER_API } from "@/api/endpoint/register";
import { useRegistrationContext } from "@/context/RegistrationContext";
import { Button } from "@/component/Button";
import type { TSearchUserMethod } from "@/types/register";
import FormControl from "@/component/FormControl/FormControl";
import SearchThaiCustomer from "../RegisterSubform/SearchCustomer";

type TSearchFormData = {
  searchMethod: TSearchUserMethod;
  searchValue: string;
};

export function SearchUserStep() {
  const { setFormData, setCurrentStep, formData } = useRegistrationContext();
  const [searchMethod, setSearchMethod] = useState<TSearchUserMethod>(
    formData.searchMethod || "cardId"
  );

  const handleChangeSearchCriteria = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    const validValue = value as TSearchUserMethod;
    if (!validValue) return;
    setSearchMethod(validValue);
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<TSearchFormData>({
    mode: "onChange",
    defaultValues: {
      searchMethod: formData.searchMethod || "cardId",
      searchValue: formData.searchValue || "",
    },
  });

  const searchMutation = useMutation({
    mutationFn: ({ searchMethod, searchValue }: TSearchFormData) => {
      return REGISTER_API.searchUser({ [searchMethod]: searchValue });
    },
    onSuccess: (userData) => {
      // Save user data and move to OTP step
      setFormData({
        userData,
        searchMethod,
        searchValue: "",
      });
      setCurrentStep("otp");
    },
    onError: (error: any) => {
      setError("searchValue", {
        type: "manual",
        message:
          error.message || "User not found. Please check your information.",
      });
    },
  });

  const onSubmit = (data: TSearchFormData) => {
    searchMutation.mutate(data);
  };

  const getPlaceholder = () => {
    switch (searchMethod) {
      case "idCard":
        return "1234567890123";
      case "mobileNumber":
        return "0812345678";
      case "custCode":
        return "CUST001";
      default:
        return "";
    }
  };

  const getLabel = () => {
    switch (searchMethod) {
      case "idCard":
        return "ID Card / Passport Number";
      case "mobileNumber":
        return "Mobile Number";
      case "custCode":
        return "Customer Code";
      default:
        return "";
    }
  };

  const getValidationPattern = () => {
    switch (searchMethod) {
      case "idCard":
        return {
          value: /^[A-Z0-9]{7,13}$/i,
          message: "Please enter a valid ID card or passport number",
        };
      case "mobileNumber":
        return {
          value: /^0\d{9}$/,
          message: "Please enter a valid 10-digit mobile number",
        };
      case "custCode":
        return {
          value: /^[A-Z0-9]+$/i,
          message: "Please enter a valid customer code",
        };
      default:
        return undefined;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">ค้นหาสมาชิก</h2>
        {/* <p className="mt-2 text-sm text-gray-600">
          Search for your existing profile using one of the following methods
        </p> */}
      </div>
      <SearchThaiCustomer searchMethod="idCard" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Search Method Selection */}
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="searchMethod"
                value="cardId"
                checked={searchMethod === "idCard"}
                onChange={handleChangeSearchCriteria}
                className="w-4 h-4 text-brand-red focus:ring-brand-red"
              />
              <span className="ml-3 text-sm font-medium text-gray-900">
                ID Card / Passport Number
              </span>
            </label>

            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="searchMethod"
                value="mobileNumber"
                checked={searchMethod === "mobileNumber"}
                onChange={handleChangeSearchCriteria}
                className="w-4 h-4 text-brand-red focus:ring-brand-red"
              />
              <span className="ml-3 text-sm font-medium text-gray-900">
                Mobile Number
              </span>
            </label>

            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="searchMethod"
                value="custCode"
                checked={searchMethod === "custCode"}
                onChange={handleChangeSearchCriteria}
                className="w-4 h-4 text-brand-red focus:ring-brand-red"
              />
              <span className="ml-3 text-sm font-medium text-gray-900">
                Customer Code
              </span>
            </label>
          </div>
        </div>

        {/* Search Input */}
        <FormControl id="searchValue" size="medium" color="base">
          <FormControl.Label>{getLabel()}</FormControl.Label>
          <Controller
            name="searchValue"
            control={control}
            rules={{
              required: "This field is required",
              pattern: getValidationPattern(),
            }}
            render={({ field }) => (
              <FormControl.Input
                {...field}
                type="text"
                placeholder={getPlaceholder()}
                disabled={searchMutation.isPending}
              />
            )}
          />
          {errors.searchValue && (
            <FormControl.Error>{errors.searchValue.message}</FormControl.Error>
          )}
        </FormControl>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="submit"
            color="primary"
            size="lg"
            fullWidth
            disabled={!isValid || searchMutation.isPending}
          >
            {searchMutation.isPending ? "กำลังค้นหา..." : "ค้นหา"}
          </Button>
        </div>

        {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> If you cannot find your profile, please
            contact our staff for assistance.
          </p>
        </div> */}
      </form>
    </div>
  );
}
