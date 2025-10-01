import { Switch } from '@/features/common/components/ui/switch'
import { Textarea } from '@/features/common/components/ui/textarea'
import { Label } from '@radix-ui/react-label'

interface IProps {
  mention: string
  setMention: (_users: string) => void
  onlyCloseFriends: boolean
  setForCloseFriends: (_state: boolean) => void
}

export const StepSettings = ({
  mention,
  setMention,
  onlyCloseFriends,
  setForCloseFriends,
}: IProps) => {
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
          placeholder="دوستات رو با @ منشن کن"
        />
        <div className="flex gap-2 mt-2">
          <Switch
            id="beAPrivate"
            checked={onlyCloseFriends}
            onCheckedChange={(checked) => setForCloseFriends(checked)}
          />
          <Label htmlFor="beAPrivate">پیچ خصوصی باشه</Label>
        </div>
      </div>
    </div>
  )
}
