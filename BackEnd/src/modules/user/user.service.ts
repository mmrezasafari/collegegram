import { HttpError } from "../../../utility/http-error";
import { IUserRepository } from "./user.repository";


export class UserService {
    constructor(
        private userRepo: IUserRepository
    ) { }
    async getUser(id: string) {
        const user = await this.userRepo.getById(id);
        if (!user) {
            throw new HttpError(404, "کاربر یافت نشد");
        }
        return user;
    }

}