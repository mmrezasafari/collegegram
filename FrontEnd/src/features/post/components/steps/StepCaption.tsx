import { highlightHastags } from '@/utils/textDecoration'
import { useRef, useState, type Dispatch, type SetStateAction } from 'react'

export const StepCaption = ({
  caption,
  setCaption,
}: {
  caption: string
  setCaption: Dispatch<SetStateAction<string>>
}) => {
  const [open, setOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const addEmoji = (emoji: string) => {
    setCaption(caption + emoji)
    setOpen(false)
  }

  const handleScroll = () => {
    if (overlayRef.current && textareaRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  return (
    <div className="w-full flex flex-col items-stretch gap-3">
      <div className="flex items-center gap-2 text-sm">
        <span>کپشن</span>
      </div>
      <div className="relative w-full">
        <div
          ref={overlayRef}
          className="
          absolute top-0 left-0 w-full
          p-2 h-[150px] overflow-auto
          whitespace-pre-wrap
          break-words
          bg-light
          font-sans text-base leading-normal"
          dangerouslySetInnerHTML={{ __html: highlightHastags(caption) }}
        />
        <textarea
          ref={textareaRef}
          className="
          relative w-full p-2
          h-[150px]
          bg-transparent
          rounded resize-none
          font-sans text-base leading-normal
          placeholder:text-gray
          border border-gray-400
          caret-black
          text-[#ffffff00]
          "
          value={caption}
          onScroll={handleScroll}
          placeholder="کپشن مورد نظرت رو بنویس..."
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>
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
