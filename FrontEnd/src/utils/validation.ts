import * as yup from 'yup'
import { ValidationError } from 'yup'

export const emailSchema = yup
  .string()
  .email('فرمت ایمیل صحیح نمی‌باشد')
  .required('وارد کردن ایمیل اجباری است')

export const passwordSchema = yup
  .string()
  .matches(/[A-Z]/, 'رمز عبور حداقل حاوی یک حرف بزرگ باشد')
  .matches(/[a-z]/, 'رمز عبور حداقل حاوی یک حرف کوچک باشد')
  .matches(/[^a-zA-Z0-9]/, 'رمز عبور حداقل حاوی یک کاراکتر خاص باشد')
  .min(8, 'رمز عبور حداقل باید ۸ کاراکتر باشد')
  .required('وارد کردن رمزعبور اجباری است')

export const userNameSchema = yup
  .string()
  .min(5, 'نام‌کاربری حداقل باید ۵ کاراکتر باشد')
  .required('وارد کردن نام‌کاربری اجباری است')

export const rePasswordSchema = yup
  .string()
  .required('وارد کردن رمزعبور اجباری است')
  .oneOf([yup.ref('$password')], 'رمز عبور و تکرار آن باید یکسان باشند')

export const registerFormSchema = yup.object({
  password: passwordSchema,
  userName: userNameSchema,
  rePassword: yup
    .string()
    .required('وارد کردن تکرار رمزعبور اجباری است')
    .oneOf([yup.ref('password')], 'رمز عبور و تکرار آن باید یکسان باشند'),
  email: emailSchema,
})

export const loginFormSchema = yup.object({
  usernameOrEmail: emailSchema,
  password: passwordSchema
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
