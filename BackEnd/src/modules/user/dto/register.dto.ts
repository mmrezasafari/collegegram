import { z } from "zod";

export const registerDto = z.object({
  username: z.string().nonempty(),
  email: z.email(),
  password: z.string().nonempty(),
});
export type registerDto = z.infer<typeof registerDto>;