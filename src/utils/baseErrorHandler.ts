export const baseErrorHandler = (err: unknown) => {
    if (err instanceof Error) {
        return `${err.name} : ${err.message}`
    }
    return `unknown error : ${err}`
}