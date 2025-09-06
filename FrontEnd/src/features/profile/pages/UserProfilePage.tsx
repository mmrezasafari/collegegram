import { Separator } from '@/features/common/components/ui/separator'
import { PostArea } from '@/features/post/components/PostArea'
import { UserProfileOverView } from '../components/UserProfileOverView'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function UserProfilePage() {
  const navigation = useNavigate()

  const onPrev = () => {
    navigation(-1)
  }
  return (
    <div className="h-full flex flex-col md:gap-8 gap-4">
      <ArrowLeft
        className="md:hidden self-end cursor-pointer"
        size="30"
        strokeWidth={3}
        color="#ea5a69"
        onClick={onPrev}
      />
      <UserProfileOverView />
      <Separator className="bg-geryLight" />
      <PostArea />
    </div>
  )
}
