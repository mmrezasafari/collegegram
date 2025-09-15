import { Post } from "../post/model/post";
import { UserService } from "../user/user.service";
import { IHashtagRepository } from "./tag.repository";


export class HashtagService {
    constructor(
        private tagRepo: IHashtagRepository,
        private userService: UserService
    ) { }

    async savePostHashtags(postId: string, hashtags: string[]) {
        return await this.tagRepo.saveHashtag(postId, hashtags)

    }

    async removePostHashtags(postId: string) {
        await this.tagRepo.removePostHashtags(postId);
    }


}