import { EmailIcon, PasswordIcon } from '@/assets/images/Icons'
import { Button } from '@/features/common/components/ui/button'
import {
  DialogClose,
  DialogFooter,
} from '@/features/common/components/ui/dialog'
import {
  DrawerClose,
  DrawerFooter,
} from '@/features/common/components/ui/drawer'
import { Input } from '@/features/common/components/ui/input'
import { Label } from '@/features/common/components/ui/label'
import { Switch } from '@/features/common/components/ui/switch'
import { Textarea } from '@/features/common/components/ui/textarea'
import { useInput } from '@/features/common/hooks/useInput'
import { useMediaQuery } from '@/features/common/hooks/useMediaQuery'
import {
  emailSchema,
  passwordSchema,
  rePasswordSchema,
  validateWithYup,
} from '@/utils/validation'
import { Camera, CircleX, Plus, RefreshCw } from 'lucide-react'
import { UserIcon } from '@/assets/images/Icons'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'

export const EditProfileForm = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const name = useInput('name', 'Mohammad')
  const lName = useInput('lname', 'Hadi')
  const email = useInput('email', 'Mohammad@gmail.com', (val) =>
    validateWithYup(emailSchema, val),
  )
  const password = useInput('password', 'password', (val) =>
    validateWithYup(passwordSchema, val),
  )
  const rePassword = useInput('repassword', 'password', (val) =>
    validateWithYup(rePasswordSchema, val, {
      context: { password: password.value },
    }),
  )
  const isPrivate = useInput<boolean>('isPrivate', false)
  const bio = useInput<string, HTMLTextAreaElement>('bio', 'fds')

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col w-[320px] items-center justify-center gap-12">
        <div className="flex flex-col justify-center items-center gap-4">
          {/* Avatar uploader */}
          <div className="relative">
            {/* Clickable circle */}
            <button
              type="button"
              onClick={openFilePicker}
              className="w-[100px] h-[100px] rounded-full border-2 outline-none border-secondary overflow-hidden bg-muted flex items-center justify-center cursor-pointer focus:outline-none"
              aria-label={
                previewUrl ? 'تغییر تصویر پروفایل' : 'انتخاب تصویر پروفایل'
              }
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="پیش‌نمایش تصویر پروفایل"
                  className="w-full h-full object-cover hover:object-contain"
                />
              ) : (
                <div className="relative flex items-center justify-center">
                  <Camera className="w-10 h-10 text-orange-500" />
                  <Plus className="w-4 h-4 text-orange-500 absolute -right-2 -top-2" />
                </div>
              )}
            </button>

            {/* Overlay edit icon when image exists */}
            {previewUrl && (
              <div className="absolute right-1/2 translate-x-1/2 bottom-[-10px] flex gap-1">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={openFilePicker}
                  className="min-w-none w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
                  aria-label="ویرایش تصویر"
                >
                  <RefreshCw className="w-4 h-4 text-secondary" />
                </Button>
                <Button
                  className="min-w-none w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
                  variant="secondary"
                  type="button"
                  onClick={() =>
                    setPreviewUrl((prev) => {
                      fileInputRef.current!.value = ''
                      if (prev) URL.revokeObjectURL(prev)
                      return null
                    })
                  }
                >
                  <CircleX className="w-4 h-4 text-secondary" />
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <p>تصویر پروفایل</p>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col w-full">
            <div className="relative w-full max-w-sm">
              <Input
                type="text"
                placeholder="نام"
                className="pr-9"
                onChange={name.onChange}
                ref={name.ref}
                value={name.value}
              />
              <div className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
                <UserIcon />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="relative w-full max-w-sm">
              <Input
                type="text"
                placeholder="نام خانوادگی"
                className="pr-9"
                value={lName.value}
                onChange={lName.onChange}
              />
              <div className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
                <UserIcon />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="relative w-full max-w-sm">
              <Input
                type="email"
                placeholder="ایمیل"
                className="pr-9"
                value={email.value}
                onChange={email.onChange}
                aria-invalid={!!email.error}
              />
              <div className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
                <EmailIcon />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="relative w-full max-w-sm">
              <Input
                type="password"
                placeholder="رمز عبور"
                className="pr-9"
                value={password.value}
                onChange={password.onChange}
                aria-invalid={!!password.error}
              />
              <div className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
                <PasswordIcon />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="relative w-full max-w-sm">
              <Input
                type="password"
                placeholder="تکرار رمز عبور"
                className="pr-9"
                value={rePassword.value}
                onChange={rePassword.onChange}
                aria-invalid={!!rePassword.error}
              />
              <div className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
                <PasswordIcon />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Switch
              id="beAPrivate"
              checked={isPrivate.value}
              onCheckedChange={(checked) => isPrivate.setValue(checked)}
            />
            <Label htmlFor="beAPrivate">پیچ خصوصی باشه</Label>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <Label className="text-md" htmlFor="bioMessage">
              بایو
            </Label>
            <Textarea
              className="max-h-20"
              id="bioMessage"
              value={bio.value}
              onChange={bio.onChange}
            />
          </div>
        </div>
        <div className="flex w-full justify-end gap-2">
          {isDesktop ? (
            <DialogFooter className="flex-row p-0">
              <DialogClose asChild>
                <Button variant="secondary">پشیمون شدم</Button>
              </DialogClose>
              <Button variant="default">ثبت تغییرات</Button>
            </DialogFooter>
          ) : (
            <DrawerFooter className="flex-row p-0">
              <DrawerClose asChild>
                <Button variant="secondary">پشیمون شدم</Button>
              </DrawerClose>
              <Button variant="default">ثبت تغییرات</Button>
            </DrawerFooter>
          )}
        </div>
      </div>
    </div>
  )
}
