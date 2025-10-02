interface SearchMessageProps {
  message: string
}

export const SearchMessage = ({ message }: SearchMessageProps) => {
  return (
    <div className="w-full flex justify-center py-6">
      <p className="text-gray-700 font-bold text-lg text-center" dir="rtl">
        {message}
      </p>
    </div>
  )
}
