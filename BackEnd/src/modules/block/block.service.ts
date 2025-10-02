import { HttpError } from "../../../utility/http-error";
import { FollowService } from "../follow/follow.service";
import { UserService } from "../user/user.service";
import { IBlockRepository } from "./block.repository";
import { CommentService } from "../comment/comment.service";
import { blockOutput } from "./models/block-output";

export interface IBlockservice{
    blockUser(userId: string, username: string):Promise<{ message: string }>;
    unblockUser(userId: string, username: string):Promise<{ message: string }>;
    isBlocked(userId:string, blockedUserId:string):Promise<boolean>;
    getBlockList(userId: string):Promise<blockOutput[]>;
}
export class BlockService implements IBlockservice {
    constructor(
        private blockRepo: IBlockRepository,
        private userService: UserService,
        private followService: FollowService,
        private commentService:CommentService
    ) { }

    async blockUser(userId: string, username: string) {
        const blockUser = await this.userService.getUserByUsername(username);
        const alreadyBlocked = await this.blockRepo.blocked(userId, blockUser.id)
        if (alreadyBlocked) {
            throw new HttpError(400, "شما این کاربر را قبلا بلاک کرده اید");
        }
        
        await this.blockRepo.block(userId, blockUser.id)
        const isFollow = await this.followService.isFollowing(userId, blockUser.id)
        if(isFollow){
            await this.followService.unfollowUser(userId, username)
        }
        const isFollower = await this.followService.isFollowing(blockUser.id, userId)
        const user = await this.userService.getUser(userId)
        if(isFollower){
            await this.followService.unfollowUser(blockUser.id, user.username)
        }
        await this.commentService.deleteUserCommentsFromUserPosts(blockUser.id, userId)
        return { message: "کاربر با موفقیت بلاک شد" };
    }

    async unblockUser(userId: string, username: string) {
        const blockUser = await this.userService.getUserByUsername(username);
        const alreadyBlocked = await this.blockRepo.blocked(userId, blockUser.id)
        if (!alreadyBlocked) {
            throw new HttpError(400, "شما این کاربر را بلاک نکرده اید");
        }

        await this.blockRepo.unblock(userId, blockUser.id);
        return { message: "کاربر با موفقیت از بلاک دراومد " };
    }

    async isBlocked(userId:string, blockedUserId:string){
        const blocked = await this.blockRepo.blocked(userId, blockedUserId)
        return blocked ? true : false;
    }
    
    async getBlockList(userId: string) {
    const blockedUsers = await this.blockRepo.getBlockedUsers(userId);
    const response:blockOutput[] = [];
    for (const blockUser of blockedUsers) {
        const followerCount = await this.followService.countFollow(blockUser.id, "followers");
        response.push({
            id: blockUser.id,
            username: blockUser.username,
            firstName: blockUser.firstName,
            lastName: blockUser.lastName,
            imageUrl: blockUser.imagePath,
            followerCount: followerCount
        })
    }
    return response;
    }

}