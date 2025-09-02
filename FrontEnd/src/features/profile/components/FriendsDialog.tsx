import { Button } from '@/features/common/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/features/common/components/ui/dialog'
import { ScrollArea } from '@/features/common/components/ui/scroll-area'
import { FriendsRow } from './FriendsRow'
import { useState } from 'react'
import { data } from 'react-router-dom'

export default function FriendsDialog() {
  const [dialogData, setDialogData] = useState(null)
  const [open, setOpen] = useState(false)

  const dialogheader = ''
  const handleButtonClick = (data) => {
    setDialogData(data)
    setOpen(true)
  }

  const friendsdata = [
    { name: 'mohammad', friendscount: 10, image: '' },
    { name: 'hadi', friendscount: 20, image: '' },
    { name: 'ali', friendscount: 30, image: '' },
    { name: 'akbar', friendscount: 40, image: '' },
  ]

  return (
    <>
      <div className="w-full p-4 justify-center">
        <Dialog>
          <DialogTrigger>
            <Button
              onClick={() => handleButtonClick('دنبال کننده‌ها')}
              variant="link"
            >
              دنبال کننده‌
            </Button>
          </DialogTrigger>
          <DialogTrigger>
            <Button
              onClick={() => handleButtonClick('دنبال شونده‌ها')}
              variant="link"
            >
              دنبال شونده‌
            </Button>
          </DialogTrigger>
          <DialogContent
            className=" max-h-[80vh]"
            showCloseButton={false}
            aria-describedby="description"
          >
            <div className="flex justify-around">
              {/* TODO: Data should be passed from di */}
              <DialogHeader className="flex md:text-2xl text-xl font-bold p-2">
                {dialogData}
              </DialogHeader>
            </div>
            <div className="flex p-4">
              <ScrollArea className="h-[400px] w-full rounded-md p-4 shadow-md">
                <div className="flex flex-col items-start justify-end w-full mb-2">
                  {/*  */}
                  {friendsdata.map((friend) => (
                    <FriendsRow
                      key={friend.name}
                      name={friend.name}
                      friendscount={friend.friendscount}
                      image={friend.image}
                    />
                  ))}
                  {/*  */}
                </div>
              </ScrollArea>
            </div>
            <DialogFooter className="pl-4">
              <DialogClose asChild>
                <Button className="" type="button">
                  بستن
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
