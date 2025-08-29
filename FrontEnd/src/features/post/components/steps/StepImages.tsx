import {
  useRef,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { Camera, Plus, X } from 'lucide-react'

export const StepImages = ({
  images,
  setImages,
}: {
  images: string[]
  setImages: Dispatch<SetStateAction<string[]>>
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const onPick = () => inputRef.current?.click()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    const urls = files.map((f) => URL.createObjectURL(f))
    setImages((prev) => [...prev, ...urls])
  }

  const removeAt = (idx: number) => {
    setImages((prev) => {
      const next = [...prev]
      const [removed] = next.splice(idx, 1)
      if (inputRef.current) inputRef.current!.value = ''
      if (removed) URL.revokeObjectURL(removed)
      return next
    })
  }

  return (
    <div className="w-full max-w-[360px] md:max-w-[420px] flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 max-h-[250px] gap-4 overflow-y-auto overflow-x-hidden snap-y py-2">
        <button
          onClick={onPick}
          type="button"
          className="w-24 md:w-28 aspect-square rounded-full border-2 border-orange-400 bg-transparent flex items-center justify-center cursor-copy"
          aria-label="افزودن عکس"
        >
          <div className="relative flex items-center justify-center">
            <Camera className="w-10 h-10 text-orange-500" />
            <Plus className="w-4 h-4 text-orange-500 absolute -right-2 -top-2" />
          </div>
        </button>
        {images.map((src, idx) => (
          <div
            key={src}
            className="relative w-20 md:w-24 aspect-square overflow-hidden"
          >
            <img
              src={src}
              className="w-full h-full object-cover rounded-3xl hover:object-contain transition-all"
            />
            <button
              onClick={() => removeAt(idx)}
              type="button"
              className="absolute left-0 top-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center cursor-pointer"
              aria-label="حذف"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
