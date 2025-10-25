import {
  ErrorIcon,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from '@/assets/images/Icons'
import { useTheme } from 'next-themes'
import type { ReactNode } from 'react'
import {
  Toaster as Sonner,
  toast,
  type ToasterProps,
  type ExternalToast,
} from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      {...props}
    />
  )
}

const createNotify =
  (className: string, icon: ReactNode) =>
  (message: string, props?: ExternalToast) =>
    toast(message, {
      className,
      icon,
      ...props,
    })

const notify = {
  success: createNotify(
    '!bg-backGroundSuccess !text-textSuccess !rounded-3xl !text-md !px-6 !font-[IranSans]',
    <SuccessIcon />,
  ),
  error: createNotify(
    '!bg-backGroundError !text-textError !rounded-3xl !text-md !px-6 !font-[IranSans]',
    <ErrorIcon />,
  ),
  warning: createNotify(
    '!bg-backGroundWarning !text-textWarning !rounded-3xl !text-md !px-6 !font-[IranSans]',
    <WarningIcon />,
  ),
  info: createNotify(
    '!bg-backGroundInfo !text-textInfo !rounded-3xl !text-md !px-6 !font-[IranSans]',
    <InfoIcon />,
  ),
}
export { Toaster, notify }
