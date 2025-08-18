import { EmailIcon, ErrorIcon, PasswordIcon } from '@/assets/images/Icons'
import { Button } from '@/features/common/components/ui/button'
import { Checkbox } from '@/features/common/components/ui/checkbox'
import { Input } from '@/features/common/components/ui/Input'
import { Label } from '@/features/common/components/ui/label'
import { useInput } from '@/features/common/hooks/useInput'

export const LoginForm = () => {
  const email = useInput('')
  const password = useInput('')

  return (
    <div className="w-[335px] flex flex-col gap-8">
      <h3 className="text-sm text-justify">
        به کالج‌گرام خوش آمدید. برای ورود کافیه نام کاربری/ایمیل و رمز عبور
        خود‌تون رو وارد کنید:
      </h3>
      <div className="flex flex-col gap-6">
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
        <div className="flex items-center gap-4">
          <Checkbox id="rememberMe" />
          <Label htmlFor="rememberMe">مرا به خاطر بسپار</Label>
        </div>
      </div>
      <Button className="self-end">ورود</Button>
    </div>
  )
}
