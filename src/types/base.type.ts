export type TMaybe<T> = T | null

export type TLocalStorageSetup = {
    key: string
    duration: number // number in ms
}

export type TLocalStorageSavedValue<T> = {
    value: T
    exp: number // unix exp
}