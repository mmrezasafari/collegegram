import { useState } from 'react'

export const StepSettings = () => {
  const [allowComments, setAllowComments] = useState(true)
  const [showLikes, setShowLikes] = useState(true)

  return (
    <div className="w-full max-w-[360px] flex flex-col gap-4 text-sm">
      <label className="flex items-center justify-between gap-3">
        <span>اجازه ثبت نظر</span>
        <input
          type="checkbox"
          checked={allowComments}
          onChange={(e) => setAllowComments(e.target.checked)}
          className="h-4 w-4 accent-primary"
        />
      </label>
      <label className="flex items-center justify-between gap-3">
        <span>نمایش تعداد لایک‌ها</span>
        <input
          type="checkbox"
          checked={showLikes}
          onChange={(e) => setShowLikes(e.target.checked)}
          className="h-4 w-4 accent-primary"
        />
      </label>
    </div>
  )
}
