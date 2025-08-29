import { useState } from 'react'
import { Smile } from 'lucide-react'

export const StepCaption = ({
	caption,
	setCaption,
}: {
	caption: string
	setCaption: (val: string) => void
}) => {
	const [open, setOpen] = useState(false)

	const addEmoji = (emoji: string) => {
		setCaption(caption + emoji)
		setOpen(false)
	}

	return (
		<div className="w-full max-w-[360px] flex flex-col items-stretch gap-3">
			<div className="flex items-center gap-2 text-sm">
				<Smile className="w-5 h-5" />
				<span>کپشن</span>
			</div>
			<textarea
				value={caption}
				onChange={(e) => setCaption(e.target.value)}
				rows={5}
				placeholder="کپشن مورد نظرت رو بنویس..."
				className="w-full rounded-xl border bg-white p-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-ring"
			/>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={() => setOpen((v) => !v)}
					className="text-xs text-muted-foreground underline"
				>
					{open ? 'بستن ایموجی' : 'افزودن ایموجی'}
				</button>
			</div>
			{open && (
				<div className="grid grid-cols-8 gap-2 text-xl">
					{['😀','😂','🥰','😍','😎','🤩','🙌','👏','👍','🔥','💯','🎉','✨','💡','🧠','😴'].map((e) => (
						<button key={e} type="button" className="hover:scale-110 transition" onClick={() => addEmoji(e)}>
							{e}
						</button>
					))}
				</div>
			)}
		</div>
	)
}


