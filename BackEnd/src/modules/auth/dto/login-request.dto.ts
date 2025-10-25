import z from "zod";

export const loginRequestDto = z.object({
  usernameOrEmail: z.string().nonempty(),
  password: z.string().nonempty()
})
export type LoginRequestDto = z.infer<typeof loginRequestDto>;