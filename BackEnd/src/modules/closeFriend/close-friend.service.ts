import { HttpError } from "../../../utility/http-error";
import { FollowService } from "../follow/follow.service";
import { UserService } from "../user/user.service";
import { ICloseFriendRepository } from "./close-friend.repository";


export class CloseFriendService {
    constructor(
        private closeFriendRepo: ICloseFriendRepository,
        private userService: UserService,
        private followService: FollowService
    ) { }

    async addCloseFriend(userId: string, username: string) {
        const friendUser = await this.userService.getUserByUsername(username);
        const followUsers = await this.followService.getFollows(userId);

        const isFollowRelation = followUsers.some(u => u.username === friendUser.username);
        if (!isFollowRelation) {
            throw new HttpError(403, "شما فقط می‌توانید کاربری را که فالوور یا فالوینگ شماست به دوستان نزدیک اضافه کنید");
        }

        const alreadyCloseFriend = await this.closeFriendRepo.existsCloseFriend(userId, friendUser.id);
        if (alreadyCloseFriend) {
            throw new HttpError(400, "این کاربر در لیست دوستان نزدیک شما وجود دارد");
        }

        await this.closeFriendRepo.addCloseFriend(userId, friendUser.id);
        return { message: "کاربر با موفقیت به لیست دوستان نزدیک اضافه شد" };
    }

    async removeCloseFriend(userId: string, username: string) {
        const friendUser = await this.userService.getUserByUsername(username);
        const alreadyCloseFriend = await this.closeFriendRepo.existsCloseFriend(userId, friendUser.id);
        if (!alreadyCloseFriend) {
            throw new HttpError(400, "این کاربر در لیست دوستان نزدیک شما وجود ندارد");
        }

        await this.closeFriendRepo.removeCloseFriend(userId, friendUser.id);
        return { message: "کاربر با موفقیت از لیست دوستان نزدیک حذف شد" };
    }


    async getCloseFriends(userId: string) {
        const closeFriends = await this.closeFriendRepo.getCloseFriends(userId);
        const response = [];
        for (const closeFriend of closeFriends) {
            const followerCount = await this.followService.countFollow(closeFriend.friendId, "followers");
            response.push({
                id: closeFriend.friendId,
                username: closeFriend.friend.username,
                firstName: closeFriend.friend.firstName,
                lastName: closeFriend.friend.lastName,
                imageUrl: closeFriend.friend.imagePath,
                followerCount,
            })
        }
        return response;
    }

}