import z from "zod";

export const loginResponseDto = z.object({

  accessToken: z.string().nonempty(),
  refreshToken: z.string().nonempty()
})
export type LoginResponseDto = z.infer<typeof loginResponseDto>