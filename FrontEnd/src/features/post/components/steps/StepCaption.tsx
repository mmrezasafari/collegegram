import { useState, type Dispatch, type SetStateAction } from 'react'
import { Textarea } from '@/features/common/components/ui/textarea'

export const StepCaption = ({
  caption,
  setCaption,
}: {
  caption: string
  setCaption: Dispatch<SetStateAction<string>>
}) => {
  const [open, setOpen] = useState(false)

  const addEmoji = (emoji: string) => {
    setCaption(caption + emoji)
    setOpen(false)
  }

  return (
    <div className="w-full flex flex-col items-stretch gap-3">
      <div className="flex items-center gap-2 text-sm">
        <span>کپشن</span>
      </div>
      <Textarea
        className="w-full h-30 outline-none"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="کپشن مورد نظرت رو بنویس..."
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-xs text-muted-foreground underline cursor-pointer"
        >
          {open ? 'بستن ایموجی' : 'افزودن ایموجی'}
        </button>
      </div>
      {open && (
        <div className="max-h-20 grid grid-cols-8 gap-2 text-xl bg-light rounded-md shadow-sm p-4 overflow-x-auto">
          {[
            '😀',
            '😂',
            '🥰',
            '😍',
            '😎',
            '🤩',
            '😭',
            '😴',
            '🙌',
            '👏',
            '👍',
            '🖕',
            '🧠',
            '🔥',
            '💯',
            '🎉',
            '✨',
            '💩',
            '💡',
            '🌊',
          ].map((e) => (
            <button
              key={e}
              type="button"
              className="hover:scale-110 transition cursor-pointer"
              onClick={() => addEmoji(e)}
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
