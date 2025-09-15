import z, { ZodArray } from "zod";

export const PostDto = z.object({
    caption: z.string().optional(),
    mention: z.string().optional(),
    imageUrls: z.preprocess(val => {
        if (typeof val === "string") return [val];
        return val;
    }, z.string().array().optional())
});

export type PostDto = z.infer<typeof PostDto>;