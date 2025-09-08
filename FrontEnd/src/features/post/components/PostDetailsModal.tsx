import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/features/common/components/ui/carousel'
import {
  Dialog, DialogHeader, DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/features/common/components/ui/dialog'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/features/common/components/ui/avatar'
import { useEffect, useState } from 'react'
import { Bookmark, Expand, Heart, MessageCircle, Pencil } from 'lucide-react'
import { Button } from '@/features/common/components/ui/button'
import { Badge } from '@/features/common/components/ui/badge'
import { useGetPost } from '../hooks/usePosts'

interface IProp {
  open: boolean
  setOpen: (state: boolean) => void
  postId: string
}

export const PostDetailsModal = ({ open, setOpen, postId }: IProp) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const { data } = useGetPost(postId)

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-full md:w-[1250px] md:h-[730px] flex flex-col md:px-12">
        <DialogHeader>
          <DialogTitle>
            <Expand className="cursor-pointer" color="#ea5a69" />
          </DialogTitle>
          <DialogDescription hidden />
        </DialogHeader>
        <div className="flex gap-8 h-full">
          <div className="flex-[40%] flex flex-col h-full w-full">
            <Carousel setApi={setApi} className="md:w-[520px] h-auto static flex justify-center items-center flex-col" style={{ direction: 'ltr' }}>
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index}>
                    <img className="rounded-3xl" src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F021%2F826%2F848%2Fnon_2x%2Fapi-icon-in-flat-style-software-integration-illustration-on-isolated-background-algorithm-programming-sign-business-concept-vector.jpg&f=1&nofb=1&ipt=98c8c10e817e20fcbc19bd387dbe731f37b65f88b45acd0e15939bde89e7083f' />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className='flex gap-2'>
                <CarouselPrevious variant="secondary" className='static p-0 rounded-full min-w-fit w-6 h-6 shadow border-geryLight' />
                <CarouselNext variant="secondary" className='static p-0 rounded-full min-w-fit w-6 h-6 shadow border border-geryLight' />
              </div>
              <div className="text-muted-foreground py-2 text-xs">
                تصویر {current} از {count}
              </div>
            </Carousel>
          </div>
          <div className="flex flex-[60%] flex-col h-full w-full gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Avatar className="w-[48px] h-[48px]">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p>mahmz</p>
              </div>
              <Button>
                <Pencil />
                <span>ویرایش پست</span>
              </Button>
            </div>
            <div className='text-xs text-gray'>
              <span>2 ماه پیش</span>
            </div>
            <div className='md:h-[190px] overflow-y-auto'>
              <p className="text-justify text-sm">
                ترس یکی از مهمترین عوامل #قدرت است؛ کسی که بتواند در #جامعه سمت
                و سوی ترس را معین کند #قدرت زیادی بر آن جامعه پیدا می‌کند. شاید
                بتوان هم صدا با جورجو آگامبنِ فیلسوف گفت که ما امروزه همیشه در
                یک حالت اضطراری زندگی می‌کنیم
              </p>
            </div>
            <div className="text-light">
              <Badge className="text-sm" variant="secondary">متین دهقان</Badge>
            </div>
            <div className="flex justify-end gap-4">
              <div className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer">
                <MessageCircle color="#ea5a69" />
                <span>۱۵</span>
              </div>
              <div className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer">
                <Heart color="#ea5a69" />
                <span>۱۵</span>
              </div>
              <div className="flex flex-col gap-2 justify-center items-center text-primary cursor-pointer">
                <Bookmark color="#ea5a69" />
                <span>۱۵</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
