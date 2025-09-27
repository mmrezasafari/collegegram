import { UserRow } from './UserRow'
// import { Separator } from '@features/common/commenents/ui/separator'
import { useGetCloseFriends } from '@/features/relationships/hooks/useRelations'
import { Avatar } from '@/features/common/components/ui/avatar'
import { Button } from '@/features/common/components/ui/button'
import clsx from 'clsx'

// type Friend = {
//   id: string
//   name: string
//   followers: string
//   avatar: string
// }

// const friends: Friend[] = [
//   {
//     id: '1',
//     name: 'سمین صحابی',
//     followers: '170 هزار دنبال‌کننده',
//     avatar: '/assets/samin.jpg',
//   },
//   {
//     id: '2',
//     name: 'محسن سرباز',
//     followers: '170 هزار دنبال‌کننده',
//     avatar: '/assets/mohsen.jpg',
//   },
//   {
//     id: '3',
//     name: 'متین دهقان',
//     followers: '170 هزار دنبال‌کننده',
//     avatar: '/assets/matin.jpg',
//   },
// ]

export const CloseFriendsPage = () => {
  const { data: closeFriends } = useGetCloseFriends()
  return (
    <div className="min-h-screen text-white font-sans px-8 py-10">
      {/* <div className="flex items-center justify-end gap-4 mb-10"></div>
      <div className="flex flex-col gap-8 max-w-lg ml-auto">
        { closeFriends?.data? (
        closeFriends?.data.map((closefriend) => (
          <><div key={closefriend.id} /><UserRow key={closefriend.id} user={closefriend.name} /></>
        ))
      ) : (
        </div>
        <div className={clsx("flex flex-col items-center justify-center mt-20")}>
          <Avatar
            size={100}
            src="/assets/closefriends.png"
            alt="Close Friends"
            className="mb-4"
        </div> 
      ) */}
    </div>
  )
}

export default CloseFriendsPage
