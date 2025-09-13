import { HttpError } from "../../../utility/http-error";
import { User } from "./model/user";
import { hashingPassword } from "../../../utility/bcrypt-password";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IUserRepository } from "./user.repository";
export class UserService {
    constructor(
        private userRepo: IUserRepository,
    ) { }
    async getUser(id: string): Promise<User> {
        const user = await this.userRepo.getById(id);
        if (!user) {
            throw new HttpError(404, "کاربر یافت نشد");
        }
        return { ...user, imagePath: process.env.BACKEND_HOST || "http://localhost:3000" + user.imagePath };
    }

    async getUserByUsername(username: string): Promise<User> {
        const user = await this.userRepo.getByUsername(username);
        if (!user) {
            throw new HttpError(404, "کاربر یافت نشد");
        }
        return { ...user, imagePath: process.env.BACKEND_HOST || "http://localhost:3000" + user.imagePath };

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
        await this.getUser(userId);
        const imagePath = `/public/uploads/${file.filename}`;
        await this.userRepo.saveImage(userId, imagePath);
        return file;
    }


}