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

export default FormControl;