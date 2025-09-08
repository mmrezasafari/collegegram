import { Post } from "../post/model/post";
import { UserService } from "../user/user.service";
import { IHashtagRepository } from "./tag.repository";


export class HashtagService {
    constructor(
        private tagRepo: IHashtagRepository,
        private userService: UserService
    ) { }

    async savePostHashtags(hashtags:string[], postId:string){
        const savedHashtags: string[] = [];
        for (const hashtag of hashtags) {
            await this.tagRepo.saveHashtag(hashtag, postId)
            savedHashtags.push(hashtag);
        }
        return savedHashtags;

    }


}