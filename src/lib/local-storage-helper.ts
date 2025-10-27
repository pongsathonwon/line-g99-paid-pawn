import type { ZodSafeParseResult } from "zod";
import type { TLocalStorageSavedValue, TLocalStorageSetup, TMaybe } from "../types/base.type";
import { LocalTokenSchema } from "../zod/token";

const baseSetToLocal = ({ key, duration }: TLocalStorageSetup) => <T>(
    value: T) => {
    const exp = (new Date()).getTime() + duration
    const formattedValue = { value, exp }
    const stringValue = JSON.stringify(formattedValue)
    localStorage.setItem(key, stringValue)
};

const baseGetLocal = (key: string) => <T>(safeParser: (v: unknown) => ZodSafeParseResult<TLocalStorageSavedValue<T>>) => (): TMaybe<T> => {
    const strValue = localStorage.getItem(key)
    if (!strValue) return null
    const raw = JSON.parse(strValue)
    const temp = safeParser(raw)
    if (!temp.success) return null
    const praseData = temp.data
    const currentUnix = (new Date()).getTime()
    if (praseData.exp <= currentUnix) return null
    return praseData.value
}

const baseRemoveLocal = (key: string) => () => localStorage.removeItem(key)

const MINUTE_FACTOR = 1000 * 60
const HOUR_FACTOR = 60 * MINUTE_FACTOR

const JWT_KEY = "G99_PAWN_TOKEN"
export const saveToken = (token: string) => baseSetToLocal({ key: JWT_KEY, duration: HOUR_FACTOR })(token)
export const getToken = baseGetLocal(JWT_KEY)(LocalTokenSchema.safeParse)
export const deleteToken = baseRemoveLocal(JWT_KEY)