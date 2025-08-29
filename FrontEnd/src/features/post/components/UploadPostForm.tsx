import { useState } from 'react'
import { StepImages } from './steps/StepImages'
import { StepCaption } from './steps/StepCaption'
import { StepSettings } from './steps/StepSettings'
import { Button } from '@/features/common/components/ui/button'
import {
  DrawerClose,
  DrawerFooter,
} from '@/features/common/components/ui/drawer'
import { DialogFooter } from '@/features/common/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMediaQuery } from '@/features/common/hooks/useMediaQuery'
import { CircleCheck, CircleDot } from 'lucide-react'
import { cn } from '@/lib/utils'

type StepKey = 0 | 1 | 2

export const UploadPostForm = () => {
  const [step, setStep] = useState<StepKey>(0)
  const [images, setImages] = useState<string[]>([])
  const [caption, setCaption] = useState('')
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const goNext = () => setStep((s) => (s < 2 ? ((s + 1) as StepKey) : s))
  const goPrev = () => setStep((s) => (s > 0 ? ((s - 1) as StepKey) : s))

  return (
    <div className="min-h-[450px] flex flex-col justify-between items-center">
      {/* Stepper */}
      <div className="flex">
        <div className="flex items-center">
          <div className="flex relative flex-col">
            {step > 0 ? <CircleCheck color="#005f3e" /> : <CircleDot />}
            <span
              className={cn(
                'absolute bottom-[-20px] right-[-1px] text-xs',
                step >= 0 ? 'text-black' : 'text-gray-400',
              )}
            >
              عکس
            </span>
          </div>
          <div
            className={`w-25 h-[3px] flex-1 rounded-full ${step >= 1 ? 'bg-black' : 'bg-geryLight'}`}
          ></div>
        </div>
        <div className="flex items-center">
          <div className="flex relative flex-col">
            {step < 1 ? (
              <CircleDot color="#d8d8d8" />
            ) : step === 1 ? (
              <CircleDot />
            ) : (
              <CircleCheck color="#005f3e" />
            )}
            <span
              className={cn(
                'absolute bottom-[-20px] text-xs',
                step >= 1 ? 'text-black' : 'text-gray-400',
              )}
            >
              متن
            </span>
          </div>
          <div
            className={`w-25 h-[3px] flex-1 rounded-full ${step >= 2 ? 'bg-black' : 'bg-geryLight'}`}
          ></div>
        </div>
        <div className="flex items-center w-fit">
          <div className="flex relative flex-col">
            {step < 2 ? (
              <CircleDot color="#d8d8d8" />
            ) : step === 2 ? (
              <CircleDot />
            ) : (
              <CircleCheck color="#005f3e" />
            )}
            <span
              className={cn(
                'absolute bottom-[-20px] right-[-8px] text-xs',
                step >= 2 ? 'text-black' : 'text-gray-400',
              )}
            >
              تنظیمات
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full min-h-[200px] flex items-start justify-center">
        {step === 0 && (
          <div className="w-full flex flex-col gap-4">
            <p className="text-base">عکس‌های مورد نظرت رو آپلود کن:</p>
            <StepImages images={images} setImages={setImages} />
          </div>
        )}
        {step === 1 && (
          <div className="w-full flex flex-col gap-4">
            <p className="text-center">کپشن مورد نظرت رو بنویس:</p>
            <StepCaption caption={caption} setCaption={setCaption} />
          </div>
        )}
        {step === 2 && <StepSettings />}
      </div>

      {/* Footer actions */}
      <div className="flex w-full justify-end gap-2">
        {isDesktop ? (
          <>
            <DrawerFooter className="flex-row p-0">
              {step === 0 ? (
                <DrawerClose asChild>
                  <Button variant="secondary">پشیمون شدم</Button>
                </DrawerClose>
              ) : (
                <Button variant="secondary" onClick={goPrev}>
                  مرحله قبل
                </Button>
              )}
              <Button onClick={goNext} disabled={step === 2 || !images.length}>
                بعدی
              </Button>
            </DrawerFooter>
          </>
        ) : (
          <DialogFooter className="flex-row p-0">
            {step === 0 ? (
              <DialogClose asChild>
                <Button variant="secondary">پشیمون شدم</Button>
              </DialogClose>
            ) : (
              <Button variant="secondary" onClick={goPrev}>
                مرحله قبل
              </Button>
            )}
            <Button onClick={goNext} disabled={step === 2 || !images.length}>
              بعدی
            </Button>
          </DialogFooter>
        )}
      </div>
    </div>
  )
}
