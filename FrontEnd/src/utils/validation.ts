import * as yup from 'yup'
import { ValidationError } from 'yup'

export const emailSchema = yup.string().email('فرمت ایمیل صحیح نمی‌باشد')

export const passwordSchema = yup
  .string()
  .min(8, 'رمز عبور حداقل باید ۸ کاراکتر باشد')
  .matches(/[A-Z]/, 'رمز عبور حداقل حاوی یک حرف بزرگ باشد')
  .matches(/[a-z]/, 'رمز عبور حداقل حاوی یک حرف کوچک باشد')
  .matches(/[^a-zA-Z0-9]/, 'رمز عبور حداقل حاوی یک کاراکتر خاص باشد')

export const userNameSchema = yup
  .string()
  .min(5, 'نام‌کاربری حداقل باید ۵ کاراکتر باشد')

export const rePasswordSchema = yup
  .string()
  .oneOf([yup.ref('$password')], 'رمز عبور و تکرار آن باید یکسان باشند')

export const registerFormSchema = yup.object({
  password: passwordSchema.concat(
    yup.string().required('وارد کردن رمزعبور اجباری است'),
  ),
  userName: userNameSchema.concat(
    yup.string().required('وارد کردن نام‌کاربری اجباری است'),
  ),
  rePassword: yup
    .string()
    .required('وارد کردن تکرار رمزعبور اجباری است')
    .oneOf([yup.ref('password')], 'رمز عبور و تکرار آن باید یکسان باشند'),
  email: emailSchema.concat(
    yup.string().required('وارد کردن ایمیل اجباری است'),
  ),
})

export const loginFormSchema = yup.object({
  usernameOrEmail: yup.string().required('وارد کردن ایمیل اجباری است'),
  password: passwordSchema.concat(
    yup.string().required('وارد کردن رمزعبور اجباری است'),
  ),
})

export const profileEditInfo = yup.object({
  firstName: yup.string().required('وارد کردن  نام اجباری است'),
  lastName: yup.string().required('وارد کردن نام خانوادگی اجباری است'),
  email: emailSchema.concat(
    yup.string().required('وارد کردن ایمیل اجباری است'),
  ),
})

export const profileEditPassword = yup.object({
  password: passwordSchema,
  rePassword: yup
    .string()
    .required('وارد کردن تکرار رمزعبور اجباری است')
    .oneOf([yup.ref('password')], 'رمز عبور و تکرار آن باید یکسان باشند'),
})

export function validateWithYup<T>(
  schema: yup.Schema<T>,
  value: unknown,
  options?: { context?: Record<string, unknown> },
): string | null {
  try {
    schema.validateSync(value, { abortEarly: true, ...options })
    return null
  } catch (err) {
    if (err instanceof ValidationError) {
      return err.message
    }
    return 'Invalid value'
  }
}
