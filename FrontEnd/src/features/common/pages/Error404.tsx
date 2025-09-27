import { Button } from '@/features/common/components/ui/button'
import TopCloud from '@/assets/images/TopCloude.jpeg'
import RedCloud from '@/assets/images/RedCloude.jpeg'
import OrangeCloud from '@/assets/images/OrangeCloude.jpeg'

export function Error404() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
      {/* Top blob */}
      <img
        src={TopCloud}
        alt="top cloud"
        className="absolute top-0 left-0 w-full h-48 object-cover z-0 h-auto"
        draggable={false}
      />
      {/* Bottom blobs */}
      <img
        src={RedCloud}
        alt="red cloud"
        className="absolute bottom-16 left-24 w-56 h-24 object-contain z-0"
        draggable={false}
      />
      <img
        src={OrangeCloud}
        alt="orange cloud"
        className="absolute bottom-24 right-32 w-72 h-24 object-contain z-0"
        draggable={false}
      />
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center mt-32">
        <h1 className="text-4xl font-extrabold mb-6 text-center">
          وای اینجا چه خبره؟!
        </h1>
        <h2 className="text-xl font-bold mb-2 text-center">
          ظاهرا یک مشکلی وجود داره!
        </h2>
        <p className="text-base mb-1 text-center">
          ما داریم تلاش می‌کنیم که برطرفش کنیم.
        </p>
        <p className="text-base mb-8 text-center">
          لطفا چند دقیقه دیگه دوباره تلاش کن.
        </p>
        <Button
          variant="destructive"
          className="bg-[#F37B8C] text-white border-none rounded-full px-12 py-2 text-s font-bold cursor-pointer"
          onClick={() => window.history.back()}
        >
          بازگشت به صفحه قبلی
        </Button>
      </div>
    </div>
  )
}
