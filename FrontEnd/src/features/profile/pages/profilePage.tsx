import { Separator } from '@/features/common/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { UserRound } from 'lucide-react'
import * as React from 'react'
import { EditProfileWizard } from '../components/EditProfileWizard'
import { UploadPostWizard } from '@/features/post/components/UploadPostWizard'

export function ProfilePage(): React.ReactElement {
  return (
    <div className="h-full flex flex-col md:gap-8 gap-4">
      <h2 className="md:text-2xl text-xl font-bold">صفحه من</h2>
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
        <div className="flex flex-col md:flex-col w-full justify-center items-center md:gap-8 gap-4">
          <div className="flex w-full items-center md:gap-8 gap-4">
            <Avatar className="md:w-[147px] md:h-[147px] w-[65px] h-[65px] border border-geryLight flex justify-center items-center rounded-full bg-geryVeryLight">
              <AvatarImage className="w-full h-full" alt="avatar" />
              <AvatarFallback className="w-[45px] md:w-[100px] h-auto">
                <UserRound
                  className="w-full h-full object-cover"
                  color="#A5A5A5A5"
                  fill="#A5A5A5A5"
                  strokeWidth={0}
                />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <p className="md:text-2xl text-xl font-bold">مهشید منز</p>
                <p className="md:text-base text-sm font-normal">@mahmz</p>
              </div>
              <p className="hidden md:block text-base text-gray-400 text-justify">
                Lover, not a fighter, spreading ✌️all over the 🌎
              </p>
            </div>
          </div>
          <p className="md:hidden w-full text-sm text-gray-400 text-justify">
            Lover, not a fighter, spreading ✌️all over the 🌎
          </p>
        </div>
        <EditProfileWizard />
      </div>
      <Separator className="bg-geryLight" />
      {/* Empty posts panel */}
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
    </div>
  )
}
