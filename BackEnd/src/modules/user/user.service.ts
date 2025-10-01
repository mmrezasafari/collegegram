import { HttpError } from "../../../utility/http-error";
import { User } from "./model/user";
import { hashingPassword } from "../../../utility/bcrypt-password";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IUserRepository } from "./user.repository";
import { minioClient } from "../../config/minio.config";
import { ImageMimeType } from "../../../utility/image-mime-type.enum";
import { IFollowService } from "../follow/follow.service";
export class UserService {
    private followService!: IFollowService;
    constructor(
        private userRepo: IUserRepository,
    ) { }
    async setFollowService(followService: IFollowService) {
        this.followService = followService;
    }
    async getUser(id: string): Promise<User> {
        const user = await this.userRepo.getById(id);
        if (!user) {
            throw new HttpError(404, "کاربر یافت نشد");
        }
        return user;
    }

    async getUserByUsername(username: string): Promise<User> {
        const user = await this.userRepo.getByUsername(username);
        if (!user) {
            throw new HttpError(404, "کاربر یافت نشد");
        }
        return user;
    }

    async getUsersByUsernames(usernames: string[]) {
        return await this.userRepo.getUsersByUsernames(usernames);
    }

    async editProfile(id: string, dto: UpdateUserDto) {
        if (dto.email) {
            const existingEmail = await this.userRepo.getByEmail(dto.email);
            if (existingEmail && existingEmail.id !== id) {
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
        if (!file) {
            if (user.imagePath) {
                const lastSlashIndex = user.imagePath.lastIndexOf("/");
                const questionMarkIndex = user.imagePath.indexOf("?", lastSlashIndex);
                let fileName: string;
                if (questionMarkIndex === -1) {
                    // اگر ? نبود، کل رشته بعد از / میگیریم
                    fileName = user.imagePath.slice(lastSlashIndex + 1);
                } else {
                    // اگر ? بود، فقط تا قبلش
                    fileName = user.imagePath.slice(lastSlashIndex + 1, questionMarkIndex);
                }
                await minioClient.removeObject("profile-image", fileName);
            }
            await this.userRepo.deleteImage(user);

            return;
        }
        const name = file.originalname.split(".");
        const extension = name[name.length - 1];
        const objectName = `${Date.now()}-${user.username}`;
        await minioClient.putObject("profile-image", `${objectName}.${extension}`, file.buffer, file.size, {
            "Content-Type": file.mimetype,
            "Content-Disposition": "inline",
        });
        await this.userRepo.saveImage(userId, `${objectName}.${extension}`, file.mimetype as ImageMimeType);
        return;
    }
    async searchUserInExplore(userId: string, offset: number, limit: number, sort: "ASC" | "DESC", search: string | null) {
        if (!search) {
            return await this.userRepo.getUsersExplore(userId, offset, limit, sort);
        }
        return await this.userRepo.searchUserInExplore(userId, offset, limit, sort, search);
    }

    async canAccessResource(userId: string, resourceOwnerId: string): Promise<boolean> {
        if (userId === resourceOwnerId) {
            return true; // کاربر می‌تواند به منابع خودش دسترسی داشته باشد
        }
        const resourceOwner = await this.userRepo.getById(resourceOwnerId);
        if (!resourceOwner) {
            throw new HttpError(404, "کاربر یافت نشد");
        }
        if (!resourceOwner.isPrivate) {
            return true; // اگر حساب کاربری خصوصی نیست، همه می‌توانند دسترسی داشته باشند
        }
        const isFollowing = await this.followService.isFollowing(userId, resourceOwnerId);
        return isFollowing; // اگر دنبال‌کننده است، می‌تواند دسترسی داشته باشد
    }

}