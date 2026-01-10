import { useContext } from "react";
import { RegistrationContext } from "./RegistrationContext";

export function useRegistrationContext() {
  const context = useContext(RegistrationContext);

  if (!context) {
    throw new Error(
      "useRegistrationContext must be used within RegistrationContextProvider"
    );
  }

  return context;
}
