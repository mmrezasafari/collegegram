import { ILikeRepository } from "./like.repository";


export class LikeService {
    constructor(
        private likeRepo: ILikeRepository
    ) { }
}