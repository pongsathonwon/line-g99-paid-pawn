import React, { useId } from "react"
import { FormControlContext, useFormControlContext } from "./FormControlContext"
import type { TFormControlContext } from "./formControl.type"


const defaultProps : Omit<TFormControlContext, 'id'> = {
    size : "medium",
    color: "base"
}

function FormControl({children, id, ...props}: React.PropsWithChildren<Partial<TFormControlContext>>){
  const fallbackId = useId();
  const validId = id ?? fallbackId
  const contextValue = ({...defaultProps, id: validId, ...props}) 
  return <FormControlContext.Provider value={contextValue}>
    <div className="flex flex-col">
      {children}
    </div>
  </FormControlContext.Provider>
}

type TFormLabelProps = Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'>

const FormLabel = ({children, className,...props} : TFormLabelProps) => {
  const {id} = useFormControlContext()
  return <label {...props} htmlFor={`label-${id}`} >{children}</label>
}
type TFormInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'>

const BaseFormInput = ({className, ...props} : TFormInputProps, ref : React.ForwardedRef<HTMLInputElement>) => {
  const {id} = useFormControlContext()
  return <input {...props} id={id} ref={ref} />
}

const FormInput = React.forwardRef<HTMLInputElement, TFormInputProps>(BaseFormInput)

const FormErrorText = ({children}: React.PropsWithChildren) => {
  const {} = useFormControlContext()
  return <span>{children}</span>
}

FormControl.Label = FormLabel;
FormControl.Input = FormInput;
FormControl.Error = FormErrorText;

export default FormControl;