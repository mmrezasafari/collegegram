import z from "zod";

export const updateUserDto = z.object({
    lastName: z.string().optional(),
    firstName: z.string().optional(),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).optional(),
    email: z.email().optional(),
    isPrivate: z.coerce.boolean(),
    bio: z.string().max(200).optional()
});
export type UpdateUserDto = z.infer<typeof updateUserDto>;