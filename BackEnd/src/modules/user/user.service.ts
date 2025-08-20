import { IUserRepository } from "./user.repository";


export class UserService {
    constructor(
        private userRepo: IUserRepository
    ) { }
    
}