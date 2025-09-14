import { HttpError } from "../../../utility/http-error";
import { PostService } from "../post/post.service";
import { ISaveRepository } from "./saved-post.repository";


export class SaveService {
    constructor(
        private saveRepo: ISaveRepository,
        private postService: PostService
    ) { }

    async savePost(postId:string, userId:string,){
        const post = await this.postService.getPostById(postId)
        const existingSave = await this.saveRepo.isSaved(postId,userId)
        if (existingSave) {
            throw new HttpError(400, "شما این پست را ذخیره دارید");
        }
        await this.saveRepo.save(postId, userId)
        return { message: "پست با موفقیت ذخیره شد" };
    }

    async unSavePost(postId:string, userId:string,){
        const post = await this.postService.getPostById(postId)
        const existingSave = await this.saveRepo.isSaved(postId,userId)
        if (!existingSave) {
            throw new HttpError(400, "شما این پست را ذخیره نکرده اید");
        }
        await this.saveRepo.unSave(postId,userId)
        return { message: "ذخبره پست با موفقیت حذف شد" }

    }

    async getSaveCount(postId: string){
    return await this.saveRepo.countSave(postId);
    }

    async saved(postId:string ,userId:string){
        const existingSave = await this.saveRepo.isSaved(postId,userId)
        return !!existingSave;
    }

    async getSavePage(userId: string, offset: number, limit: number, sort: "ASC" | "DESC") {
        return this.saveRepo.getSavePage(userId, offset, limit, sort);
    }
}
