import { UserRow } from "./UserRow";
// import { Separator } from '@features/common/commenents/ui/separator'
import { useGetCloseFriends } from "@/features/relationships/hooks/useRelations";
import { Avatar } from "@/features/common/components/ui/avatar";
import clsx from "clsx";

export const CloseFriendsPage = () => {
  const { data: closeFriends } = useGetCloseFriends();
  return (
    <div className="min-h-screen text-white font-sans px-8 py-10">
      <div className="flex items-center justify-end gap-4 mb-10"></div>
      <div className="flex flex-col gap-8 max-w-lg ml-auto">
        {closeFriends?.data ? (
          closeFriends.data.map((closefriend) => (
            <UserRow key={closefriend.id} user={closefriend.name} />
          ))
        ) : (
          <div
            className={clsx("flex flex-col items-center justify-center mt-20")}
          >
            <Avatar
              size={100}
              src="/assets/closefriends.png"
              alt="Close Friends"
              className="mb-4"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CloseFriendsPage;
