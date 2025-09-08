import { useGetPosts } from '../hooks/usePosts'
import { UploadPostWizard } from './UploadPostWizard'

export const PostArea = () => {
  const { data } = useGetPosts()
  const images = data?.data.flatMap((post) => post.images) || []

  console.log(images)

  return images?.length ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 h-auto overflow-y-auto">
      {images?.map((image, i) => (
        <div key={i} className="overflow-hidden rounded-2xl">
          <img
            src={`http://localhost:3000/BackEnd/${image.url}`}
            alt="Image 1"
            className="w-full h-64 object-cover"
          />
        </div>
      ))}
    </div>
  ) : (
    // TODO: seperate post areas me from user
    <div className="h-full flex items-center justify-center border border-geryLight rounded-3xl">
      <div className="flex flex-col text-center gap-4">
        <div className="font-semibold text-sm md:text-base">
          هنوز هیچ پستی توی صفحت نذاشتی!
          <br />
          بجنب تا دیر نشده
        </div>
        <UploadPostWizard />
      </div>
    </div>
  )
}
