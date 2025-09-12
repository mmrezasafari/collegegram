export interface Comment{
    postId: string,
    userId: string,
    content: string,
    parentId?: string
}