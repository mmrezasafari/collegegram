import { AppDataSource } from "./data-scource";
import { UserEntity } from "./modules/user/entity/user.entity";

/////////////////////////???????????????????????????????????????

export const seedUser = async () => {
    const userRepo = AppDataSource.getRepository(UserEntity);

    const count = await userRepo.count();
////////kojaha await bayad bezarim nemifamam!!
    if(count === 0 ){
        await userRepo.save([
            {username:"Admin", email:"Admin@gmail.com", password:"Admin"}
        ])
    }
}