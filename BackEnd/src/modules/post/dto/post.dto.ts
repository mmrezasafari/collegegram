import z, { ZodArray } from "zod";

export const PostDto = z.object({
    caption: z.string().optional(),
    mention: z.string().optional(),
    urls: z.string().array().optional(),
});

export type PostDto = z.infer<typeof PostDto>;