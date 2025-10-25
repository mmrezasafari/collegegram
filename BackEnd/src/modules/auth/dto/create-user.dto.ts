import z from "zod";

export const createUserDto = z.object({
  username: z.string().check(
    z.minLength(5, "Username must be at least 5 characters long.")
  ),
  password: z.string().nonempty().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  email: z.email().nonempty(),
});
export type CreateUserDto = z.infer<typeof createUserDto>;