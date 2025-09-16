import {
  EmailIcon,
  ErrorIcon,
  PasswordIcon,
  UserNameIcon,
} from '@/assets/images/Icons'
import { Button } from '@/features/common/components/ui/button'
import { Input } from '@/features/common/components/ui/input'
import { useInput } from '@/features/common/hooks/useInput'
import {
  emailSchema,
  registerFormSchema,
  passwordSchema,
  rePasswordSchema,
  userNameSchema,
  validateWithYup,
} from '@/utils/validation'
import { useEffect, type ComponentProps } from 'react'
import { useRegister } from '../hooks/useAuth'
import { ValidationError } from 'yup'

interface IProps {
  onSuccess?: () => void
}

export const RegisterForm = ({ onSuccess }: IProps) => {
  const { mutate: registerMutate, isPending, isSuccess } = useRegister()
  const userName = useInput('userName', '', (val) =>
    validateWithYup(userNameSchema, val),
  )
  const email = useInput('email', '', (val) =>
    validateWithYup(emailSchema, val),
  )
  const password = useInput('password', '', (val) =>
    validateWithYup(passwordSchema, val),
  )
  const rePassword = useInput('rePassword', '', (val) =>
    validateWithYup(rePasswordSchema, val, {
      context: { password: password.value },
    }),
  )

  useEffect(() => {
    if (isSuccess) onSuccess?.()
  }, [isSuccess])

  const onFormSubmit: ComponentProps<'form'>['onSubmit'] = (e) => {
    e.preventDefault()

    const values = {
      email: email.value,
      password: password.value,
      userName: userName.value,
      rePassword: rePassword.value,
    }

    try {
      // all things goods
      registerFormSchema.validateSync(values, { abortEarly: false })
      registerMutate({
        username: userName.value,
        email: email.value,
        password: password.value,
      })
    } catch (err) {
      if (err instanceof ValidationError) {
        const errorMap: Record<string, string> = {}
        // create mapError object
        err.inner.forEach((e) => {
          if (e.path) errorMap[e.path] = e.message
        })

        //set errors
        if (errorMap.userName) userName.setError(errorMap.userName)
        if (errorMap.email) email.setError(errorMap.email)
        if (errorMap.password) password.setError(errorMap.password)
        if (errorMap.rePassword) rePassword.setError(errorMap.rePassword)

        // focus the first invalid input
        const firstErrorField = [userName, email, password, rePassword].find(
          (f) => errorMap[f.name],
        )
        firstErrorField?.ref.current?.focus()
      }
    }
  }

  return (
    <form className="w-[335px] flex flex-col gap-8" onSubmit={onFormSubmit}>
      <h3 className="text-sm text-center">
        برای ثبت‌نام کافیه نام کاربری، ایمیل و یک رمز عبور وارد کنید:
      </h3>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <div className="relative w-full max-w-sm">
            <Input
              type="text"
              name={userName.name}
              ref={userName.ref}
              placeholder="نام کاربری"
              className="pr-9"
              value={userName.value}
              onChange={userName.onChange}
              onBlur={userName.onBlur}
              autoComplete="username"
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
              name={email.name}
              ref={email.ref}
              placeholder="ایمیل"
              className="pr-9"
              value={email.value}
              onChange={email.onChange}
              onBlur={email.onBlur}
              autoComplete="on"
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
              name={password.name}
              ref={password.ref}
              placeholder="رمز عبور"
              className="pr-9"
              value={password.value}
              onChange={password.onChange}
              onBlur={password.onBlur}
              autoComplete="on"
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
              name={rePassword.name}
              ref={rePassword.ref}
              placeholder="رمز عبور"
              className="pr-9"
              value={rePassword.value}
              onChange={rePassword.onChange}
              onBlur={rePassword.onBlur}
              autoComplete="on"
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
      <Button className="self-end" type="submit" loading={isPending}>
        ثبت نام
      </Button>
    </form>
  )
}
