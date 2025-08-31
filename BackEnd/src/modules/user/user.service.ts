import { HttpError } from "../../../utility/http-error";
import { User } from "./model/user";
import { hashingPassword } from "../../../utility/bcrypt-password";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IUserRepository } from "./user.repository";
import { IPostRepository } from "../post/post.repository";
export class UserService {
    constructor(
        private userRepo: IUserRepository,
        private postRepo: IPostRepository
    ) { }
    async getUser(id: string): Promise<User> {
        const user = await this.userRepo.getById(id);
        if (!user) {
            throw new HttpError(404, "کاربر یافت نشد");
        }
        return user;
    }

    async editProfile(id: string, dto: UpdateUserDto) {
        const user = await this.getUser(id);
        if (dto.email) {
            const existingEmail = await this.userRepo.getByEmail(dto.email);
            if (existingEmail) {
                throw new HttpError(409, "ایمیل تکراری است");
            }
        }
        if (dto.password) {
            dto.password = hashingPassword(dto.password);
        }
        return await this.userRepo.update(id, dto);
    }

    async saveProfileImage(file: Express.Multer.File, userId: string) {
        const user = await this.getUser(userId);
        const imagePath = `/uploads/${file.filename}`;
        await this.userRepo.saveImage(userId, imagePath);
        return file;
    }
    async getPosts(userId: string) {
        const user = this.getUser(userId);
        return await this.postRepo.getPosts(userId)
    }

    async savePost(files: Express.Multer.File[], caption: string, userId: string) {
        const imagePaths: string[] = files.map(file => file.path);
        const post = await this.postRepo.createPost(userId, imagePaths, caption);
        return post;
    }

}