import { useState } from 'react'
import { useGetPosts } from '../hooks/usePosts'
import { PostDetails } from './PostDetails'
import { DialogAndDrawerWizard } from '@/features/common/components/layout/DialogAndDrawerWizard'
import { useGetUser } from '@/features/common/hooks/users/useGetUser'
import { useGetRelationStatus } from '@/features/relationships/hooks/useRelations'
import { ImageWithFallback } from '@/features/common/components/layout/ImgWithFallBack'
import { Loading } from '@/features/common/components/ui/loading'

export const UserPostArea = () => {
  const { data: user, isPending: userPending } = useGetUser()
  const { data: relationStatus, isPending: relationIsPending } =
    useGetRelationStatus(user?.data.username as string)
  const { data } = useGetPosts()
  const images = data?.data
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [postId, setPostId] = useState('')

  return (
    <>
      {userPending && relationIsPending ? (
        <div className="h-full flex items-center justify-center">
          <Loading />
        </div>
      ) : relationStatus?.data.status === 'PENDING' ? (
        <div className="h-full flex items-center justify-center border border-geryLight rounded-3xl">
          <div className="flex flex-col text-center gap-4">
            <div className="font-bold text-sm md:text-xl text-center px-10">
              منتظر باش تا {user?.data.firstName ?? user?.data.username} درخواست
              دوستی‌ات رو قبول کنه
            </div>
          </div>
        </div>
      ) : user?.data?.isPrivate && !user.data.isFollowing ? (
        <div className="h-full flex items-center justify-center border border-geryLight rounded-3xl">
          <div className="flex flex-col text-center gap-4">
            <div className="font-semibold text-sm md:text-xl text-justify px-2">
              برای دیدن صفحه {user.data.firstName ?? user.data.username} باید
              دنبالش کنی.
            </div>
          </div>
        </div>
      ) : images?.length ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-2 overflow-y-auto">
          {images.map((data, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl w-auto h-[150px] md:h-[305px]"
              onClick={() => {
                setPostModalOpen(true)
                setPostId(data.id)
              }}
            >
              <ImageWithFallback
                src={data.images.length ? data.images[0].url : ''}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center border border-geryLight rounded-3xl">
          <div className="flex flex-col text-center gap-4">
            <div className="font-semibold text-sm md:text-base">
              این کاربر هنوز هیچ پستی بارگذاری نکرده
            </div>
          </div>
        </div>
      )}
      {postModalOpen && (
        <DialogAndDrawerWizard
          open={postModalOpen}
          setOpen={setPostModalOpen}
          className="h-[95%] md:max-w-full md:w-[1250px] md:h-[730px] flex flex-col md:px-12"
        >
          <PostDetails postId={postId} />
        </DialogAndDrawerWizard>
      )}
    </>
  )
}
