import * as yup from 'yup'
import { ValidationError } from 'yup'

export const emailSchema = yup
  .string()
  .email('فرمت ایمیل صحیح نمی‌باشد')
  .required('وارد کردن ایمیل اجباری است')

export const passwordSchema = yup
  .string()
  .required('وارد کردن رمزعبور اجباری است')
  .min(8, 'رمز عبور حداقل باید ۸ کاراکتر باشد')
  .matches(/[A-Z]/, 'رمز عبور حداقل حاوی یک حرف بزرگ باشد')
  .matches(/[a-z]/, 'رمز عبور حداقل حاوی یک حرف کوچک باشد')
  .matches(/[^a-zA-Z0-9]/, 'رمز عبور حداقل حاوی یک کاراکتر خاص باشد')

export const userNameSchema = yup
  .string()
  .required('وارد کردن نام‌کاربری اجباری است')
  .min(8, 'نام‌کاربری حداقل باید ۵ کاراکتر باشد')

export const rePasswordSchema = yup
  .string()
  .required('وارد کردن رمزعبور اجباری است')
  .oneOf([yup.ref('password')], 'must theSame')

export function validateWithYup<T>(
  schema: yup.Schema<T>,
  value: T,
): string | null {
  try {
    schema.validateSync(value)
    return null
  } catch (err) {
    if (err instanceof ValidationError) {
      return err.message
    }
    return 'Invalid value'
  }
}
