import { AxiosError } from "axios";

/**
 * g99-online POST /login answers 401 { requiresRegistration: true } for a
 * LINE uid that is not linked to a customer (PawnOnlineApi.Login). Any other
 * failure (408, 400, 500, network) is an error, not "go and register".
 */
export const isNotRegistered = (error: unknown) =>
  error instanceof AxiosError &&
  error.response?.status === 401 &&
  (error.response.data as { requiresRegistration?: unknown } | undefined)
    ?.requiresRegistration === true;
