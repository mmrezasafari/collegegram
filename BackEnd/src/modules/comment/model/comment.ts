import { Post } from "../../post/model/post"

export interface Comment {
    id: string,
    postId: string,
    userId: string,
    content: string,
    parentId?: string,
    post?: Post,
    createdAt: Date
}