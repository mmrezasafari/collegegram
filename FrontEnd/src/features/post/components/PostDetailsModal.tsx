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

interface IProp {
  postId: string
}

export const PostDetailsModal = ({ postId }: IProp) => {
  const { data } = useGetPost(postId)
  const post = data?.data
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(post?.post.images.length)

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
    <div className="flex flex-col md:flex-row gap-8 h-full">
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
            <p>{post?.user.username}</p>
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
          <div className="md:hidden w-full flex justify-start gap-4 px-4">
            <div className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer w-6 h-12">
              <MessageCircle color="#ea5a69" />
              <span>۱۵</span>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer w-6 h-12">
              <Heart color="#ea5a69" />
              <span>{post?.likeCount}</span>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer w-6 h-12">
              <Bookmark color="#ea5a69" />
              <span>{post?.saveCount}</span>
            </div>
          </div>
        </Carousel>
      </div>
      <div className="flex md:flex-[60%] flex-col h-full w-full gap-4 max-md:px-2">
        <div className="max-md:hidden flex justify-between items-center">
          {/* Avatar in desktop */}
          <div className="flex items-center gap-4">
            <Avatar className="w-[48px] h-[48px]">
              <AvatarImage src={post?.user.imagePath} alt="user" />
              <AvatarFallback className="bg-geryLight">
                <UserRound color="#A5A5A5" strokeWidth={1.5} />
              </AvatarFallback>
            </Avatar>
            <p>{post?.user.username}</p>
          </div>
          {/* Eidt btn in desktop ratio */}
          <Button>
            <Pencil />
            <span>ویرایش پست</span>
          </Button>
        </div>
        <div className="text-xs text-gray">
          <span>{post?.post?.createdAt}</span>
        </div>
        <div className="h-[130px] md:h-[190px] overflow-y-auto px-2">
          <p className="text-justify text-sm">{post?.post.caption}</p>
        </div>
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
          <div className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer">
            <Heart color="#ea5a69" />
            <span>{post?.likeCount}</span>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer">
            <Bookmark color="#ea5a69" />
            <span>{post?.saveCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
