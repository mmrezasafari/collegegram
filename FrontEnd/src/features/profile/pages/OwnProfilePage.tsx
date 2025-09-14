import { Separator } from '@/features/common/components/ui/separator'
import { OwnPostArea } from '@/features/post/components/OwnPostArea'
import { OwnProfileOverView } from '../components/OwnProfileOverView'

export function OwnProfilePage() {
  return (
    <div className="h-full flex flex-col md:gap-8 gap-4">
      <h2 className="md:text-2xl text-xl font-bold">صفحه من</h2>
      <OwnProfileOverView />
      <Separator className="bg-geryLight" />
      <OwnPostArea />
    </div>
  )
}
