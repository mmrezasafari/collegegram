import bcrypt from "bcrypt";

export const hashingPassword = (password: string) => {
  return bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS || "10"))
}
export const comparePassword = (password: string, dbPassword: string) => {
  return bcrypt.compareSync(password, dbPassword);
}