import { HttpError } from "../../../utility/http-error";
import { User } from "./model/user";
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

}