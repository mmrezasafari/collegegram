import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/features/common/components/ui/carousel'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/features/common/components/ui/avatar'
import { useEffect, useState } from 'react'
import { Bookmark, Heart, MessageCircle, Pencil, UserRound } from 'lucide-react'
import { Button } from '@/features/common/components/ui/button'
import { Badge } from '@/features/common/components/ui/badge'
import { useGetPost } from '../hooks/usePosts'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fa'
import { parseCaption } from '@/utils/textDecoration'
import { useToggleSavePost } from '@/features/bookmark/hooks/useBookmark'
import { useToggleLike } from '@/features/like/hooks/useLike'

interface IProp {
  postId: string
}

dayjs.extend(relativeTime)
dayjs.locale('fa')

export const PostDetailsModal = ({ postId }: IProp) => {
  const { data } = useGetPost(postId)
  const post = data?.data
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(post?.post.images.length)
  const { mutate: toggleSavePostMutata } = useToggleSavePost(postId)
  const { mutate: toggleLikeMutate } = useToggleLike(postId)

  const onBookmarkAction = () => {
    if (!post?.saved) {
      toggleSavePostMutata('save')
    } else {
      toggleSavePostMutata('unsave')
    }
  }

  const onLikeAction = () => {
    if (!post?.liked) {
      toggleLikeMutate('like')
    } else {
      toggleLikeMutate('unlike')
    }
  }

  useEffect(() => {
    if (!api) {
      return
    }
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="flex flex-col md:flex-row md:gap-8 h-full">
      <div className="flex-[40%] flex flex-col h-full w-full gap-4">
        <div className="flex justify-between px-4">
          {/* avatar in mobile */}
          <div className="md:hidden flex items-center gap-4">
            <Avatar className="w-[48px] h-[48px]">
              <AvatarImage src={post?.user.imagePath} alt="user" />
              <AvatarFallback className="bg-geryLight">
                <UserRound color="#A5A5A5" strokeWidth={1.5} />
              </AvatarFallback>
            </Avatar>
            {/* fullName in mobile */}
            <p className="font-bold text-secondary">{post?.user.username}</p>
          </div>
          {/* eidt btn in mobile */}
          <Button className="md:hidden min-w-min" variant="link">
            <Pencil />
          </Button>
        </div>
        <Carousel
          setApi={setApi}
          className="md:w-[520px] h-auto static flex justify-center items-center flex-col"
          style={{ direction: 'ltr' }}
        >
          <CarouselContent>
            {post?.post.images.map((image, index) => (
              <CarouselItem key={index}>
                <img
                  className="max-md:h-[350px] max-md:w-full md:rounded-3xl object-cover"
                  src={image.url}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex gap-2">
            <CarouselPrevious
              variant="secondary"
              className="static p-0 rounded-full min-w-fit w-6 h-6 shadow border-geryLight"
            />
            <CarouselNext
              variant="secondary"
              className="static p-0 rounded-full min-w-fit w-6 h-6 shadow border border-geryLight"
            />
          </div>
          <div className="max-md:hidden text-muted-foreground py-2 text-xs">
            تصویر {current} از {count}
          </div>
          {/* post actions(like, bookmark, comment) in mobile */}
          <div className="md:hidden w-full flex justify-end flex-row-reverse gap-4 px-4">
            <div className="flex flex-col gap-2  justify-center items-center text-primary cursor-pointer w-6 h-12">
              <MessageCircle color="#ea5a69" />
              <span>۱۵</span>
            </div>
            <div
              className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer w-6 h-12"
              onClick={onLikeAction}
            >
              <Heart color="#ea5a69" fill={post?.liked ? '#ea5a69' : 'white'} />
              <span>{post?.likeCount}</span>
            </div>
            <div
              className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer w-6 h-12"
              onClick={onBookmarkAction}
            >
              <Bookmark
                color="#ea5a69"
                fill={post?.saved ? '#ea5a69' : 'white'}
              />
              <span>{post?.saveCount}</span>
            </div>
          </div>
        </Carousel>
      </div>
      <div className="flex md:flex-[60%] flex-col h-full w-full gap-4 max-md:px-4">
        <div className="max-md:hidden flex justify-between items-center">
          {/* Avatar in desktop */}
          <div className="flex items-center gap-4">
            <Avatar className="w-[48px] h-[48px]">
              <AvatarImage src={post?.user.imagePath} alt="user" />
              <AvatarFallback className="bg-geryLight">
                <UserRound color="#A5A5A5" strokeWidth={1.5} />
              </AvatarFallback>
            </Avatar>
            {/* fullName in desktop */}
            <p className="font-bold text-secondary">{post?.user.username}</p>
          </div>
          {/* Eidt btn in desktop ratio */}
          <Button>
            <Pencil />
            <span>ویرایش پست</span>
          </Button>
        </div>
        {/* createdAt */}
        <div className="text-xs text-gray-500">
          <span>{dayjs(post?.post.createdAt).fromNow()}</span>
        </div>
        {/* caption of post */}
        <div className="h-[100px] md:h-[190px] overflow-y-auto md:px-2">
          {post?.post.caption ? (
            <div
              className="text-justify text-sm/6"
              dangerouslySetInnerHTML={{
                __html: parseCaption(post?.post.caption),
              }}
            ></div>
          ) : (
            <p>کپشن ندارد</p>
          )}
        </div>
        {/* mentions */}
        <div className="flex gap-2">
          {post?.mentionedUsernames?.length
            ? post.mentionedUsernames.map((user, i) => (
                <div key={i} className="text-light">
                  <Badge className="text-sm" variant="secondary">
                    {user}
                  </Badge>
                </div>
              ))
            : null}
        </div>
        <div className="max-md:hidden flex justify-end gap-4">
          <div className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer">
            <MessageCircle color="#ea5a69" />
            <span>۱۵</span>
          </div>
          <div
            className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer"
            onClick={onLikeAction}
          >
            <Heart color="#ea5a69" fill={post?.liked ? '#ea5a69' : 'white'} />
            <span>{post?.likeCount}</span>
          </div>
          <div
            className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer"
            onClick={onBookmarkAction}
          >
            <Bookmark
              color="#ea5a69"
              fill={post?.saved ? '#ea5a69' : 'white'}
            />
            <span>{post?.saveCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
