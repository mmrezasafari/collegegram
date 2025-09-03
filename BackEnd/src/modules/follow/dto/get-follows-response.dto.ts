import z from "zod";

export const getFollowsResponseDto = z.object({
  id: z.uuid(),
  username: z.string(),
  imageUrl: z.url().optional(),
  followerCount: z.number()
});
export type GetFollowsResponseDto = z.infer<typeof getFollowsResponseDto>