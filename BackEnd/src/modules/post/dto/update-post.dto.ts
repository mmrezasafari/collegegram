import z, { ZodArray } from "zod";

export const updatePostDto = z.object({
    caption: z.string().optional(),
    mention: z.string().optional(),
    onlyCloseFriends: z.preprocess((val) => {
        if (val === "" || val === null || val === undefined) {
            return undefined;
        }
        if (val === "true" || val === true) return true;
        if (val === "false" || val === false) return false;
        return undefined;
    }, z.boolean().optional()),
    imageUrls: z.preprocess(val => {
        if (typeof val === "string") return [val];
        return val;
    }, z.string().array().optional())
});

export type updatePostDto = z.infer<typeof updatePostDto>;