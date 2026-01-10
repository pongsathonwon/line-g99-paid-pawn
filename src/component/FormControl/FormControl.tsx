import React from "react";
import { FormControlContext, useFormControlContext } from "./FormControlContext";
import type { TFormControlContext } from "./formControl.type";
import { cn } from "@/utils";
import {
  formControlVariants,
  formControlLabelVariants,
  formControlInputVariants,
  formControlErrorVariants,
  formControlHelperVariants,
} from "./formControl.variants";

function FormControl({
  children,
  id,
  size = "medium",
  color = "base",
  state = "default",
  className,
}: React.PropsWithChildren<
  Partial<TFormControlContext> & { className?: string }
>) {
  const fallbackId = React.useId();
  const validId = id ?? fallbackId;
  const contextValue = { id: validId, size, color, state };
  return (
    <FormControlContext.Provider value={contextValue}>
      <div className={cn(formControlVariants(), className)}>{children}</div>
    </FormControlContext.Provider>
  );
}

type TFormLabelProps = Omit<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  "htmlFor"
>;

const FormLabel = ({ children, className, ...props }: TFormLabelProps) => {
  const { id, size, color } = useFormControlContext();
  return (
    <label
      {...props}
      className={cn(formControlLabelVariants({ size, color }), className)}
      htmlFor={id}
    >
      {children}
    </label>
  );
};

type TFormInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id">;

const BaseFormInput = (
  { className, ...props }: TFormInputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const { id, size, color, state } = useFormControlContext();
  return (
    <input
      {...props}
      className={cn(formControlInputVariants({ size, color, state }), className)}
      id={id}
      ref={ref}
      aria-invalid={state === "error"}
      aria-describedby={state === "error" ? `${id}-error` : undefined}
    />
  );
};

const FormInput = React.forwardRef<HTMLInputElement, TFormInputProps>(
  BaseFormInput
);

const FormErrorText = ({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) => {
  const { id } = useFormControlContext();
  return (
    <span
      className={cn(formControlErrorVariants(), className)}
      role="alert"
      id={`${id}-error`}
    >
      {children}
    </span>
  );
};

const FormHelperText = ({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) => {
  return (
    <span className={cn(formControlHelperVariants(), className)}>
      {children}
    </span>
  );
};

FormControl.Label = FormLabel;
FormControl.Input = FormInput;
FormControl.Error = FormErrorText;
FormControl.Helper = FormHelperText;

export default FormControl;
