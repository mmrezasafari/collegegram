import { Textarea } from '@/features/common/components/ui/textarea'

interface IProps {
  mention: string
  setMention: (_users: string) => void
}

export const StepSettings = ({ mention, setMention }: IProps) => {
  return (
    <div className="w-full max-w-[360px] flex flex-col gap-4 text-sm">
      <div className="w-full flex flex-col items-stretch gap-3">
        <div className="flex items-center gap-2 text-sm justify-center">
          <span>اینجا می‌تونی دوستانت رو منشن کنی:</span>
        </div>
        <Textarea
          className="w-full h-30 outline-none placeholder:text-right"
          style={{ direction: 'ltr' }}
          value={mention}
          onChange={(e) => setMention(e.target.value)}
          placeholder="دوستات رو با فاصله از هم منشن کن"
        />
      </div>
    </div>
  )
}
