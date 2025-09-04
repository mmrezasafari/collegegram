import { HttpError } from "../../../utility/http-error";
import { Post } from "./model/post";
import { IPostRepository } from "./post.repository";



export class PostService {
    constructor(
        private postRepo: IPostRepository
    ) { }

    async getPostById(postId: string):Promise<Post>{
        const post = await this.postRepo.getById(postId)
        if(!post){
            throw new HttpError (404, "پست یافت نشد");
        }
        return post;
    }
}