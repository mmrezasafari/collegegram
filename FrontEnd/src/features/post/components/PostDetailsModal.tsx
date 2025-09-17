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
import { DialogAndDrawerWizard } from '@/features/common/components/layout/DialogAndDrawerWizard'
import { UploadPostForm } from './UploadPostForm'
import { Link } from 'react-router-dom'
import { baseUrl } from '@/utils/baseUrl'
import { useGetUserName } from '@/features/common/hooks/users/useGetUserName'

interface IProp {
  postId: string
}

dayjs.extend(relativeTime)
dayjs.locale('fa')

export const PostDetailsModal = ({ postId }: IProp) => {
  const { data } = useGetPost(postId)
  const post = data?.data
  const [api, setApi] = useState<CarouselApi>()
  const userName = useGetUserName()
  const [current, setCurrent] = useState(0)
  const [_count, setCount] = useState(post?.post.images.length)
  const { mutate: toggleSavePostMutata, isPending: savePending } =
    useToggleSavePost(postId)
  const { mutate: toggleLikeMutate, isPending: likePending } =
    useToggleLike(postId)
  const [editPostModalOpen, setEditPostModalOpen] = useState(false)

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
    <>
      <div className="flex flex-col md:flex-row md:gap-8 h-full">
        <div className="flex-[40%] flex flex-col h-full w-full gap-4">
          <div className="md:hidden flex justify-between px-4">
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
            {userName === post?.user.username && (
              <Button
                className="md:hidden min-w-min"
                variant="link"
                onClick={() => setEditPostModalOpen(true)}
              >
                <Pencil />
              </Button>
            )}
          </div>
          <Carousel
            setApi={setApi}
            className="w-full md:w-[520px] md:h-full static flex justify-center items-center flex-col !pl-0"
            style={{ direction: 'ltr' }}
          >
            <CarouselContent className="w-full md:w-[520px]">
              {post?.post.images.map((image, index) => (
                <CarouselItem
                  className="w-full flex justify-center items-center"
                  key={index}
                >
                  <img
                    className="h-[375px] md:rounded-3xl md:w-[500px] md:h-[550px] object-contain"
                    src={baseUrl(image.url)}
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
              تصویر {post?.post.images.length} از {current}
            </div>
            {/* post actions(like, bookmark, comment) in mobile */}
            <div className="md:hidden w-full flex justify-end flex-row-reverse gap-4 px-4">
              <div className="flex flex-col gap-2  justify-center items-center text-primary cursor-pointer w-6 h-12">
                <MessageCircle color="#ea5a69" />
                <span>۱۵</span>
              </div>
              <button
                className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer w-6 h-12"
                onClick={onLikeAction}
                disabled={likePending}
              >
                <Heart
                  color="#ea5a69"
                  fill={post?.liked ? '#ea5a69' : 'transparent'}
                />
                <span>{post?.likeCount}</span>
              </button>
              <button
                className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer w-6 h-12"
                onClick={onBookmarkAction}
                disabled={savePending}
              >
                <Bookmark
                  color="#ea5a69"
                  fill={post?.saved ? '#ea5a69' : 'transparent'}
                />
                <span>{post?.saveCount}</span>
              </button>
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
            <Button onClick={() => setEditPostModalOpen(true)}>
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
                  <Link to={`/profile/${user}`}>
                    <Badge
                      className="text-sm hover:scale-103 transition-all"
                      variant="secondary"
                    >
                      {user}
                    </Badge>
                  </Link>
                </div>
              ))
              : null}
          </div>
          <div className="max-md:hidden flex justify-end gap-4">
            <button
              className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer"
              disabled={true}
            >
              <MessageCircle color="#ea5a69" />
              <span>۱۵</span>
            </button>
            <button
              className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer"
              onClick={onLikeAction}
              disabled={likePending}
            >
              <Heart
                color="#ea5a69"
                fill={post?.liked ? '#ea5a69' : 'transparent'}
              />
              <span>{post?.likeCount}</span>
            </button>
            <button
              className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer"
              onClick={onBookmarkAction}
              disabled={savePending}
            >
              <Bookmark
                color="#ea5a69"
                fill={post?.saved ? '#ea5a69' : 'transparent'}
              />
              <span>{post?.saveCount}</span>
            </button>
          </div>
        </div>
      </div>
      {editPostModalOpen && (
        <DialogAndDrawerWizard
          open={editPostModalOpen}
          setOpen={setEditPostModalOpen}
          className="h-fit flex flex-col"
        >
          <UploadPostForm
            initialData={data}
            postId={postId}
            mode="edit"
            onSuccess={() => setEditPostModalOpen(false)}
          />
        </DialogAndDrawerWizard>
      )}
    </>
  )
}
