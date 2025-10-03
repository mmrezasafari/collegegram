import { EmailIcon, ErrorIcon, PasswordIcon } from '@/assets/images/Icons'
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
  profileEditInfo,
  profileEditPassword,
  rePasswordSchema,
  userNameSchema,
  validateWithYup,
} from '@/utils/validation'
import { Camera, CircleX, Plus, RefreshCw } from 'lucide-react'
import { UserIcon } from '@/assets/images/Icons'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { IRegisteredUser } from '@/types/user'
import { ValidationError } from 'yup'
import { useEditProfile } from '../hooks/useProfile'

export const EditProfileForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { mutate: formMutate } = useEditProfile()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [avatar, setAvatar] = useState<File | null>(null)
  const user = queryClient.getQueryData<IRegisteredUser>(['me'])?.data
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [userAvatar, setUserAvatar] = useState<string | undefined>(
    user?.imagePath,
  )
  const firstName = useInput(
    'name',
    user && user.firstName ? user.firstName : '',
    (val) => validateWithYup(userNameSchema, val),
  )
  const lastName = useInput('lname', user && user.lastName ? user.lastName : '')
  const email = useInput('email', user && user.email ? user.email : '', (val) =>
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
  const bio = useInput<string, HTMLTextAreaElement>(
    'bio',
    user && user.bio ? user.bio : '',
  )
  const isPrivate = useInput<boolean>(
    'isPrivate',
    user && user.isPrivate ? user.isPrivate : false,
  )

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const changedValues = useMemo(() => {
    if (!user) return {}

    const diff: Record<string, string | boolean> = {}

    if (firstName.value !== user.firstName) diff.firstName = firstName.value
    if (lastName.value !== user.lastName) diff.lastName = lastName.value
    if (email.value !== user.email) diff.email = email.value
    if (bio.value !== user.bio) diff.bio = bio.value
    if (password.value) diff.password = password.value
    if (previewUrl || !userAvatar) diff.userAvatar = previewUrl || ''
    if (isPrivate.value !== user.isPrivate) diff.isPrivate = isPrivate.value

    return diff
  }, [
    firstName.value,
    lastName.value,
    email.value,
    bio.value,
    password.value,
    isPrivate.value,
    previewUrl,
    userAvatar,
    user,
  ])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatar(file)
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
  }

  const onFormSubmit: ComponentProps<'form'>['onSubmit'] = (e) => {
    e.preventDefault()
    if (Object.keys(changedValues).length === 0 && !avatar) return

    const infoValuesForValidate = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      isPrivate: isPrivate.value,
    }

    const passwordValuesForValidate = {
      password: password.value,
      rePassword: rePassword.value,
    }

    try {
      profileEditInfo.validateSync(infoValuesForValidate, { abortEarly: false })
      if (password.value || rePassword.value) {
        profileEditPassword.validateSync(passwordValuesForValidate, {
          abortEarly: false,
        })
      }
      formMutate(
        { values: changedValues, avatar },
        { onSuccess: () => onSuccess?.() },
      )
    } catch (err) {
      if (err instanceof ValidationError) {
        const errorMap: Record<string, string> = {}
        // create mapError object
        err.inner.forEach((e) => {
          if (e.path) errorMap[e.path] = e.message
        })

        //set errors
        if (errorMap.firstName) firstName.setError(errorMap.firstName)
        if (errorMap.lastName) lastName.setError(errorMap.lastName)
        if (errorMap.email) email.setError(errorMap.email)
        if (errorMap.password) password.setError(errorMap.password)
        if (errorMap.rePassword) rePassword.setError(errorMap.rePassword)
      }
    }
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
              {previewUrl || userAvatar ? (
                <img
                  src={previewUrl || userAvatar}
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
            {(previewUrl || userAvatar) && (
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
                  onClick={() => {
                    if (userAvatar) {
                      setUserAvatar(undefined)
                      setAvatar(null)
                    }
                    setPreviewUrl((prev) => {
                      fileInputRef.current!.value = ''
                      if (prev) URL.revokeObjectURL(prev)
                      return null
                    })
                  }}
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
        <form onSubmit={onFormSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col w-full">
            <div className="relative w-full max-w-sm">
              <Input
                type="text"
                placeholder="نام"
                className="pr-9"
                ref={firstName.ref}
                value={firstName.value}
                onChange={firstName.onChange}
                aria-invalid={!!firstName.error}
              />
              <div className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
                <UserIcon />
              </div>
            </div>
            {firstName.error && (
              <div className="flex text-textError text-xs gap-2 mt-2 px-2 text-justify">
                <ErrorIcon />
                {firstName.error}
              </div>
            )}
          </div>
          <div className="flex flex-col w-full">
            <div className="relative w-full max-w-sm">
              <Input
                type="text"
                placeholder="نام خانوادگی"
                className="pr-9"
                ref={lastName.ref}
                value={lastName.value}
                onChange={lastName.onChange}
                aria-invalid={!!lastName.error}
              />
              <div className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
                <UserIcon />
              </div>
            </div>
            {lastName.error && (
              <div className="flex text-textError text-xs gap-2 mt-2 px-2 text-justify">
                <ErrorIcon />
                {lastName.error}
              </div>
            )}
          </div>
          <div className="flex flex-col w-full">
            <div className="relative w-full max-w-sm">
              <Input
                type="email"
                placeholder="ایمیل"
                className="pr-9"
                ref={email.ref}
                value={email.value}
                onChange={email.onChange}
                aria-invalid={!!email.error}
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
          <div className="flex flex-col w-full">
            <div className="relative w-full max-w-sm">
              <Input
                type="password"
                placeholder="رمز عبور"
                className="pr-9"
                ref={password.ref}
                onChange={password.onChange}
                onBlur={password.onBlur}
                aria-invalid={!!password.error}
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
          <div className="flex flex-col w-full">
            <div className="relative w-full max-w-sm">
              <Input
                type="password"
                placeholder="تکرار رمز عبور"
                className="pr-9"
                ref={rePassword.ref}
                onChange={rePassword.onChange}
                onBlur={rePassword.onBlur}
                aria-invalid={!!rePassword.error}
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
              name={bio.name}
              value={bio.value}
              onChange={bio.onChange}
            />
          </div>
          <div className="flex w-full justify-end gap-2 mt-4">
            {isDesktop ? (
              <DialogFooter className="flex-row p-0">
                <DialogClose asChild>
                  <Button variant="secondary">پشیمون شدم</Button>
                </DialogClose>
                <Button
                  variant="default"
                  type="submit"
                  disabled={Object.keys(changedValues).length === 0}
                >
                  ثبت تغییرات
                </Button>
              </DialogFooter>
            ) : (
              <DrawerFooter className="flex-row p-0">
                <DrawerClose asChild>
                  <Button variant="secondary">پشیمون شدم</Button>
                </DrawerClose>
                <Button
                  variant="default"
                  type="submit"
                  disabled={Object.keys(changedValues).length === 0}
                >
                  ثبت تغییرات
                </Button>
              </DrawerFooter>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
