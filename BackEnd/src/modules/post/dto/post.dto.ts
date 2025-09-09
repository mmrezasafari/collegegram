import z from "zod";

export const PostDto = z.object({
    caption: z.string().optional(),
    mention: z.string().optional(),
});

export type PostDto = z.infer<typeof PostDto>;