import { IPostRepository } from "./post.repository";



export class PostService {
    constructor(
        private postRepo: IPostRepository
    ) { }
}