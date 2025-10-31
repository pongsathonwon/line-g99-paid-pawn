import React, { useId } from "react"
import { FormControlContext, useFormControlContext } from "./FormControlContext"
import type { TFormControlContext } from "./formControl.type"


function FormControl({children, id, size = "medium", color = "base"}: React.PropsWithChildren<Partial<TFormControlContext>>){
  const fallbackId = useId();
  const validId = id ?? fallbackId
  const contextValue = ({id: validId, size, color}) 
  return <FormControlContext.Provider value={contextValue}>
    <div className="flex flex-col w-60">
      {children}
    </div>
  </FormControlContext.Provider>
}

type TFormLabelProps = Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'>

const FormLabel = ({children, className = '',...props} : TFormLabelProps) => {
  const {id, lableClass} = useFormControlContext()
  return <label {...props} className={`${lableClass} ${className}`} htmlFor={id} >{children}</label>
}
type TFormInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'>

const BaseFormInput = ({className = '', ...props} : TFormInputProps, ref : React.ForwardedRef<HTMLInputElement>) => {
  const {id, inputClass} = useFormControlContext()
  return <input {...props} className={`${inputClass} ${className}`} id={id} ref={ref} />
}

const FormInput = React.forwardRef<HTMLInputElement, TFormInputProps>(BaseFormInput)

const FormErrorText = ({children}: React.PropsWithChildren) => {
  const {id} = useFormControlContext()
  return <span className="mb-1.5 text-sm text-red-600" role="alert" id={`${id}-error`}>{children}</span>
}

FormControl.Label = FormLabel;
FormControl.Input = FormInput;
FormControl.Error = FormErrorText;

export default FormControl;