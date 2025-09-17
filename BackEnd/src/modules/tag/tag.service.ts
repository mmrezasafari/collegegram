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

    async searchTagInExplore(offset: number, limit: number, sort: "ASC" | "DESC", search: string | null) {
        if (!search) {
            return await this.tagRepo.getTagsExplore(offset, limit, sort);
        }
        return await this.tagRepo.searchTagInExplore(offset, limit, sort, search);
    }


}