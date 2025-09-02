import { EmailIcon, ErrorIcon, PasswordIcon } from '@/assets/images/Icons'
import { Button } from '@/features/common/components/ui/button'
import { Checkbox } from '@/features/common/components/ui/checkbox'
import { Input } from '@/features/common/components/ui/input'
import { Label } from '@/features/common/components/ui/label'
import { useInput } from '@/features/common/hooks/useInput'
import {
  emailSchema,
  loginFormSchema,
  passwordSchema,
  validateWithYup,
} from '@/utils/validation'
import { useEffect, useState, type ComponentProps } from 'react'
import { useLogin } from '../hooks/useAuth'
import { ValidationError } from 'yup'
import { useNavigate } from 'react-router-dom'

export const LoginForm = () => {
  const {
    data: loginData,
    mutate: loginMutation,
    isPending: loginIsPending,
  } = useLogin()
  const navigate = useNavigate()
  const email = useInput('email', '', (val) =>
    validateWithYup(emailSchema, val),
  )
  const password = useInput('password', '', (val) =>
    validateWithYup(passwordSchema, val),
  )
  const [rememberMe, setRememberMe] = useState(false)

  const onRememberMeClick: ComponentProps<'button'>['onClick'] = () => {
    setRememberMe((value) => !value)
  }

  useEffect(() => {
    if (loginData?.success) {
      navigate('/profile')
    }
  }, [loginData?.success, navigate])

  const onFormSubmit: ComponentProps<'form'>['onSubmit'] = (e) => {
    e.preventDefault()

    const formValues = {
      usernameOrEmail: email.value,
      password: password.value,
    }

    try {
      loginFormSchema.validateSync(formValues, { abortEarly: false })
      loginMutation({
        ...formValues,
      })
    } catch (err) {
      if (err instanceof ValidationError) {
        const errorMap: Record<string, string> = {}
        // create mapError object
        err.inner.forEach((e) => {
          if (e.path) errorMap[e.path] = e.message
        })

        //set errors
        if (errorMap.usernameOrEmail) email.setError(errorMap.usernameOrEmail)
        if (errorMap.password) password.setError(errorMap.password)
      }
    }
  }

  return (
    <div className="w-[335px] flex flex-col gap-8">
      <h3 className="text-sm text-justify">
        به کالج‌گرام خوش آمدید. برای ورود کافیه نام کاربری/ایمیل و رمز عبور
        خود‌تون رو وارد کنید:
      </h3>
      <form className="flex flex-col gap-6" onSubmit={onFormSubmit}>
        <div className="flex flex-col">
          <div className="relative w-full max-w-sm">
            <Input
              name={email.name}
              ref={email.ref}
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
              name={password.name}
              ref={password.ref}
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
        <div className="flex items-center gap-4">
          <Checkbox
            id="rememberMe"
            onClick={onRememberMeClick}
            checked={rememberMe}
          />
          <Label htmlFor="rememberMe">مرا به خاطر بسپار</Label>
        </div>
        <Button className="self-end" type="submit" loading={loginIsPending}>
          ورود
        </Button>
      </form>
    </div>
  )
}
