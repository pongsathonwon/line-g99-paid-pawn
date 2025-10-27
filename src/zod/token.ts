import * as z from "zod";

export const LocalTokenSchema = z.object({
    // updage prase to z.jwt()
    value: z.string(),
    exp: z.number()
})
