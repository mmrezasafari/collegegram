export interface Comment{
    id:string,
    postId: string,
    userId: string,
    content: string,
    parentId?: string,
    createdAt: Date
}