import { Repository } from "typeorm/repository/Repository"
import { AppDataSource } from "../../data-scource"
import { UserEntity } from "../user/entity/user.entity"
import {User} from "../user/model/User"


export class UserRepo {
    private users : Repository<UserEntity> 
    constructor() {
        this.users = AppDataSource.getRepository(UserEntity)
    }
    async addUser(user: User): Promise<User | null> {
        await this.users.save(user);
        return user
    }
    async findByUsername(username: string, password: string): Promise<User | null> {
        const user = await this.users.findOneBy({
        username: username,
        password: password,
    });
    return user
    }

    async findByEmail(email: string, password: string): Promise<User | null> {
        const user = await this.users.findOneBy({
        email: email,
        password: password,
    });
    return user
    }


}