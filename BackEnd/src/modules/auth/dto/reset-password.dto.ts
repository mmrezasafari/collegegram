import z from "zod";

export const resetPasswordDto = z.object({
  newPassword: z.string().nonempty().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  token: z.uuid().nonempty(),
  usernameOrEmail: z.coerce.string().nonempty(),
});
export type ResetPasswordDto = z.infer<typeof resetPasswordDto>;