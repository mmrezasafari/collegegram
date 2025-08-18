import {
  EmailIcon,
  ErrorIcon,
  PasswordIcon,
  UserNameIcon,
} from '@/assets/images/Icons'
import { Button } from '@/features/common/components/ui/button'
import { Input } from '@/features/common/components/ui/Input'
import { useInput } from '@/features/common/hooks/useInput'
import {
  emailSchema,
  passwordSchema,
  userNameSchema,
  validateWithYup,
} from '@/utils/validation'

export const RegisterForm = () => {
  const userName = useInput('', (val) => validateWithYup(userNameSchema, val))
  const email = useInput('', (val) => validateWithYup(emailSchema, val))
  const password = useInput('', (val) => validateWithYup(passwordSchema, val))
  const rePassword = useInput('', (val) => {
    if (!val) {
      return 'وارد کردن تکرار رمزعبور اجباری است'
    } else {
      return val === password.value
        ? null
        : 'مقدار تکرار رمز‌عبور باید با رمزعبور برابر باشد'
    }
  })

  return (
    <div className="w-[335px] flex flex-col gap-8">
      <h3 className="text-sm text-center">
        برای ثبت‌نام کافیه نام کاربری، ایمیل و یک رمز عبور وارد کنید:
      </h3>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <div className="relative w-full max-w-sm">
            <Input
              type="text"
              placeholder="نام کاربری"
              className="pr-9"
              value={userName.value}
              onChange={userName.onChange}
              onBlur={userName.onBlur}
              aria-invalid={userName.error ? true : false}
            />
            <div className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
              <UserNameIcon />
            </div>
          </div>
          {userName.error && (
            <div className="flex text-textError text-xs gap-2 mt-2 px-2 text-justify">
              <ErrorIcon />
              {userName.error}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <div className="relative w-full max-w-sm">
            <Input
              type="email"
              placeholder="ایمیل"
              className="pr-9"
              value={email.value}
              onChange={email.onChange}
              onBlur={email.onBlur}
              aria-invalid={email.error ? true : false}
            />
            <div className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
              <EmailIcon />
            </div>
          </div>
          {email.error && (
            <div className="flex text-textError text-xs gap-2 mt-2 px-2 text-justify">
              <ErrorIcon />
              {email.error}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <div className="relative w-full max-w-sm">
            <Input
              type="password"
              placeholder="رمز عبور"
              className="pr-9"
              value={password.value}
              onChange={password.onChange}
              onBlur={password.onBlur}
              aria-invalid={password.error ? true : false}
            />
            <div className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
              <PasswordIcon />
            </div>
          </div>
          {password.error && (
            <div className="flex text-textError text-xs gap-2 mt-2 px-2 text-justify">
              <ErrorIcon />
              {password.error}
            </div>
          )}
        </div>
        <div className="felx flex-col">
          <div className="relative w-full max-w-sm">
            <Input
              type="password"
              placeholder="رمز عبور"
              className="pr-9"
              value={rePassword.value}
              onChange={rePassword.onChange}
              onBlur={rePassword.onBlur}
              aria-invalid={rePassword.error ? true : false}
            />
            <div className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
              <PasswordIcon />
            </div>
          </div>
          {rePassword.error && (
            <div className="flex text-textError text-xs gap-2 mt-2 px-2 text-justify">
              <ErrorIcon />
              {rePassword.error}
            </div>
          )}
        </div>
      </div>
      <Button className="self-end">ثبت نام</Button>
    </div>
  )
}
