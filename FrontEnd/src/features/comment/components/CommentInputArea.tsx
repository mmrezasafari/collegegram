import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/features/common/components/ui/avatar'
import { Input } from '@/features/common/components/ui/input'
import { SendHorizontal, UserRound, X } from 'lucide-react'
import { usePostComment } from '../hooks/useComments'
import { useInput } from '@/features/common/hooks/useInput'
import { Badge } from '@/features/common/components/ui/badge'
import { cn } from '@/lib/utils'

interface IProps {
  postId: string
  parentId: string | null
  replyUser: string | null
  onCancelReply: () => void
}

export const CommentInputeArea = ({
  postId,
  parentId,
  replyUser,
  onCancelReply,
}: IProps) => {
  const { mutate, isPending } = usePostComment(postId)
  const { value, setValue, onChange, onBlur, name, ref } = useInput(
    'commentInput',
    '',
  )

  const onSetComment = () => {
    if (!value.trim() || isPending) return

    mutate({ content: value, parentId: parentId })
    setValue('')
    onCancelReply()
  }

  return (
    <div className="flex gap-2 items-center">
      <Avatar className="w-[40px] h-[40px]">
        <AvatarImage src="" alt="user" />
        <AvatarFallback className="bg-geryLight">
          <UserRound color="#A5A5A5" strokeWidth={1.5} />
        </AvatarFallback>
      </Avatar>
      <div className="relative w-full">
        {
          <Badge
            className={cn(
              'absolute text-xs rounded-3xl border border-gray-400 text-black bg-light transform transition-transform duration-500 z-0',
              replyUser
                ? '-translate-y-6 opacity-100'
                : 'translate-y-0 opacity-0',
            )}
          >
            <span>در جواب به</span>
            <span>{replyUser}</span>
            <span onClick={() => onCancelReply()}>
              <X className="cursor-pointer" size={13} />
            </span>
          </Badge>
        }
        <Input
          className="relative z-10"
          type="text"
          name={name}
          ref={ref}
          placeholder="نظر خود را بنویسید..."
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onSetComment()
            }
          }}
        />
      </div>
      <SendHorizontal
        className="rotate-180 cursor-pointer"
        size={35}
        color="#ea5a69"
        onClick={onSetComment}
      />
    </div>
  )
}
