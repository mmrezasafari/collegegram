import { HttpError } from "../../../utility/http-error";
import { User } from "./model/user";
import { hashingPassword } from "../../../utility/bcrypt-password";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IUserRepository } from "./user.repository";


export class UserService {
    constructor(
        private userRepo: IUserRepository
    ) { }
    async getUser(id: string): Promise<User> {
        const user = await this.userRepo.getById(id);
        if (!user) {
            throw new HttpError(404, "کاربر یافت نشد");
        }
        return user;
    }


    async editProfile(id: string, dto: UpdateUserDto) {
        const user = this.getUser(id);
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

    async saveUserImage(file: Express.Multer.File, userId: string) {
        const user = this.getUser(userId);
        const imagePath = `/uploads/${file.filename}`;
        await this.userRepo.saveImage(userId, imagePath);
        return file;
    }

}