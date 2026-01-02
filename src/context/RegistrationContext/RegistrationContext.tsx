import { createContext } from "react";
import type { TRegistrationContext } from "@/types/register";

export const RegistrationContext = createContext<TRegistrationContext | null>(null);
