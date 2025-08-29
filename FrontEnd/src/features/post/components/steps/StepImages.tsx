import { useRef } from 'react'
import { Plus, X } from 'lucide-react'

export const StepImages = ({
	images,
	setImages,
}: {
	images: string[]
	setImages: (updater: (prev: string[]) => string[] | string[]) => void
}) => {
	const inputRef = useRef<HTMLInputElement | null>(null)

	const onPick = () => inputRef.current?.click()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || [])
		if (files.length === 0) return
		const urls = files.map((f) => URL.createObjectURL(f))
		setImages((prev) => [...prev, ...urls])
	}

	const removeAt = (idx: number) => {
		setImages((prev) => {
			const next = [...prev]
			const [removed] = next.splice(idx, 1)
			if (removed) URL.revokeObjectURL(removed)
			return next
		})
	}

	return (
		<div className="w-full max-w-[360px] md:max-w-[420px] flex flex-col items-center gap-4">
			{/* Grid of images + add tile */}
			<div className="grid grid-cols-3 gap-4">
				{images.map((src, idx) => (
					<div key={src} className="relative w-24 md:w-28 aspect-square rounded-2xl overflow-hidden">
						<img src={src} className="w-full h-full object-cover" />
						<button
							onClick={() => removeAt(idx)}
							type="button"
							className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow"
							aria-label="حذف"
						>
							<X className="w-4 h-4" />
						</button>
					</div>
				))}
				<button
					onClick={onPick}
					type="button"
					className="w-24 md:w-28 aspect-square rounded-2xl border-2 border-orange-400 bg-transparent flex items-center justify-center"
					aria-label="افزودن عکس"
				>
					<Plus className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />
				</button>
			</div>

			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				multiple
				onChange={handleChange}
				className="hidden"
			/>

			{/* Empty state note for mobile */}
			{images.length === 0 && (
				<p className="text-xs text-muted-foreground">حداکثر چند عکس انتخاب کن</p>
			)}
		</div>
	)
}


