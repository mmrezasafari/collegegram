import type { INotification } from '@/types/notification'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/features/common/components/ui/avatar'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Button } from '@/features/common/components/ui/button'
import { useGetRelationStatus } from '@/features/relationships/hooks/useRelations'
import {
  useFollowAction,
  useRespond,
  useUnfollowAction,
} from '@/features/relationships/hooks/useRelationsActions'
import clsx from 'clsx'

dayjs.extend(relativeTime)
dayjs.locale('fa')

interface IProps {
  notification: INotification
}

export const NotificationItem = ({ notification }: IProps) => {
  const { actor, type, createdAt, post } = notification
  const { data: status } = useGetRelationStatus(actor.username, {
    enabled: type === 'FOLLOW' || type === 'FOLLOW_REQUEST',
  })

  const { mutate: unFollowMutation } = useUnfollowAction(actor?.username)
  const { mutate: followMutation } = useFollowAction(actor?.username)
  const { mutate: respondMutation } = useRespond(actor?.username ?? '')

  const handleFollow = () => {
    followMutation()
  }

  const handleUnFollow = () => {
    unFollowMutation()
  }

  const handleRespond = (accept: boolean) => {
    respondMutation({ accept: accept })
  }

  const renderText = () => {
    switch (type) {
      case 'LIKE':
        return (
          <div className="flex flex-row-reverse gap-4 items-center">
            <Avatar className="w-16 h-16">
              <AvatarImage className="object-cover" src={post?.images[0].url} />
              <AvatarFallback className="border border-gray-400 bg-geryLight">
                {actor?.firstName ? actor?.firstName[0] : actor?.username[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-end gap-1">
              <p className="text-base font-medium">
                {actor?.firstName
                  ? `${actor?.firstName} ${actor?.lastName} `
                  : `@${actor?.username} `}
                <span>این عکس و لایک کرده</span>
              </p>
              <p className="text-xs text-gray-600" dir="rtl">
                {dayjs(createdAt).fromNow()}
              </p>
            </div>
          </div>
        )
      case 'COMMENT':
        return (
          <div className="flex flex-row-reverse gap-4 items-center">
            <Avatar className="w-16 h-16">
              <AvatarImage className="object-cover" src={post?.images[0].url} />
              <AvatarFallback className="border border-gray-400 bg-geryLight">
                {actor?.firstName ? actor?.firstName[0] : actor?.username[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-end gap-1">
              <p className="text-base font-medium">
                {actor?.firstName
                  ? `${actor?.firstName} ${actor?.lastName} `
                  : `@${actor?.username} `}
                <span>درباره عکس نظر داد</span>
              </p>
              <p className="text-xs text-gray-600" dir="rtl">
                {dayjs(createdAt).fromNow()}
              </p>
            </div>
          </div>
        )
      case 'TAG':
        return (
          <div className="flex flex-row-reverse gap-4 items-center">
            <Avatar className="w-16 h-16">
              <AvatarImage src={post?.images[0].url} />
              <AvatarFallback className="border border-gray-400 bg-geryLight">
                {actor?.firstName ? actor?.firstName[0] : actor?.username[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-end gap-1">
              <p className="text-base font-medium">
                {actor?.firstName
                  ? `${actor?.firstName} ${actor?.lastName} `
                  : `@${actor?.username} `}
                <span>توی این عکس تگت کرده</span>
              </p>
              <p className="text-xs text-gray-600" dir="rtl">
                {dayjs(createdAt).fromNow()}
              </p>
            </div>
          </div>
        )
      case 'FOLLOW':
        return (
          <div className="flex flex-row-reverse justify-center gap-20 items-center">
            <div className="flex flex-row-reverse justify-center gap-4 items-center">
              <Avatar className="w-16 h-16">
                <AvatarImage className="object-cover" src={actor?.imagePath} />
                <AvatarFallback className="border border-gray-400 bg-geryLight">
                  {actor?.firstName ? actor?.firstName[0] : actor?.username[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-end gap-1">
                <p className="text-base font-medium">
                  {actor?.firstName
                    ? `${actor?.firstName} ${actor?.lastName} `
                    : `@${actor?.username} `}{' '}
                  <span>دنبالت کرد</span>
                </p>
                <p className="text-xs text-gray-600" dir="rtl">
                  {dayjs(createdAt).fromNow()}
                </p>
              </div>
            </div>
            <div className="flex">
              {actor?.isFollowing && status?.data.status === 'ACCEPTED' ? (
                <Button
                  className="flex w-full"
                  variant="outline"
                  onClick={handleUnFollow}
                >
                  <span>دنبال نکردن</span>
                </Button>
              ) : (actor?.isFollowing && status?.data.status) === 'PENDING' ? (
                <Button
                  className="flex w-full"
                  variant="default"
                  onClick={handleUnFollow}
                >
                  <span>لغو در‌خواست</span>
                </Button>
              ) : (
                <Button
                  className="flex w-full"
                  variant="default"
                  onClick={handleFollow}
                >
                  <span>دنبال کردن</span>
                </Button>
              )}
            </div>
          </div>
        )
      case 'FOLLOW_REQUEST':
        return (
          <div className="flex flex-row-reverse gap-20 items-center">
            <div className="flex flex-row-reverse gap-4 items-center">
              <div className="flex flex-row-reverse justify-center gap-4 items-center">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    className="object-cover"
                    src={actor?.imagePath}
                  />
                  <AvatarFallback className="border border-gray-400 bg-geryLight">
                    {actor?.firstName
                      ? actor?.firstName[0]
                      : actor?.username[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-base font-medium">
                  {actor?.firstName
                    ? `${actor?.firstName} ${actor?.lastName} `
                    : `@${actor?.username} `}{' '}
                  <span>متین دهقان درخواست دوستی داده </span>
                </p>
                <p className="text-xs text-gray-600" dir="rtl">
                  {dayjs(createdAt).fromNow()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {!actor.isFollowing ? (
                <>
                  <Button
                    className="flex"
                    variant="default"
                    onClick={() => handleRespond(true)}
                  >
                    <span>قبول درخواست</span>
                  </Button>
                  <Button
                    className="flex"
                    variant="outline"
                    onClick={() => handleRespond(false)}
                  >
                    <span>لغو</span>
                  </Button>
                </>
              ) : (
                <span className="bg-backgroundSuccess rounded-4xl text-xs p-2">
                  درخواست قبول شد
                </span>
              )}
            </div>
          </div>
        )
    }
  }

  return (
    <div
      className={clsx(
        'flex justify-end w-full rounded-4xl',
        !notification.isRead && 'bg-[#E9E4FF]',
      )}
    >
      {renderText()}
    </div>
  )
}
