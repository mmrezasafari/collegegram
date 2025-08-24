import { hashingPassword } from "../../../utility/bcrypt-password";
import { HttpError } from "../../../utility/http-error";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IUserRepository } from "./user.repository";


export class UserService {
    constructor(
        private userRepo: IUserRepository
    ) { }

    async editProfile(id:string, dto:UpdateUserDto){
        const user = await this.userRepo.getById(id);
        if (!user) {
            throw new HttpError(404,"کاربر یافت نشد");
        }
        if (dto.email){
           const existingEmail = await this.userRepo.getByEmail(dto.email);
           if(existingEmail){
            throw new HttpError(409, "ایمیل تکراری است");
        } 
        }
        if (dto.password) {
            dto.password = hashingPassword(dto.password);
        }
        return await this.userRepo.update(id, dto);
    }
    
}