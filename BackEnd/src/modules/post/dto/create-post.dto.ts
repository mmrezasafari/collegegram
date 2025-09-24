import { z } from "zod";

export const createPostDto = z.object({
  caption: z.string().optional(),
  mention: z.string().optional(),
  onlyCloseFriends: z.coerce.boolean().optional().default(false),
});

export type createPostDto = z.infer<typeof createPostDto>;
