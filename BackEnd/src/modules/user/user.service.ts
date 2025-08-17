import validator from "validator";
import { UserRepo } from './uers.repository'
import { registerDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto';
import { HttpError } from "../../../utility/http-error";
import { User } from "./model/User";

export class UserService{
    
    constructor(private userRepo: UserRepo) {
    }

    login({ usernameOrEmail, password }: LoginDto): Promise<User | null>{
        if(validator.isEmail(usernameOrEmail)){
            const user = this.userRepo.findByEmail(usernameOrEmail, password);
            if(user === null){
                throw new HttpError(401, "Invalid username or password");
            }
            //////////?????????????????????????????/
            // else{
    
            // const jwt = require('jsonwebtoken');
            // const secretKey = 'abcde12345';
    
            // const token = jwt.sign({
            // username : user.username,
            // email:user.email,
            // }, secretKey, { expiresIn: '1h' });
    
            // res.status(200).cookie("access_token", token).send({massage:"logged in succesfuly"});
            // return;
            // }
            else{
                return user;
            }
        
            }
            else{
                const user = this.userRepo.findByEmail(usernameOrEmail, password);
                if(user === null){
                  throw new HttpError(401, "Invalid username or password");
                }
                // else{
        
                // const jwt = require('jsonwebtoken');
                // const secretKey = 'abcde12345';
        
                // const token = jwt.sign({
                // username : user.username,
                // email:user.email,
                // }, secretKey, { expiresIn: '1h' });
        
                // res.status(200).cookie("access_token", token).send({massage:"logged in succesfuly"});
                // return;
                // }
                else{
                    return user;
                }
        
            }
        
        

    }

    async register(dto: registerDto):Promise<User | null> {
        return await this.userRepo.addUser(dto);
        
        // check if user is already registered // TODO
        // give id: v4() to new user // TODO
    }
}