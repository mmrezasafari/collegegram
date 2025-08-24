import { comparePassword, hashingPassword } from "../../../utility/bcrypt-password";
import { HttpError } from "../../../utility/http-error";
import { CreateUserDto } from "./dto/create-user.dto";
import { IUserRepository } from "../user/user.repository";
import { LoginRequestDto } from "./dto/login-request.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { encryptJWT } from "../../../utility/jwt_utils";
import { ISessionRepository } from "./session.repository";

export class AuthService {
  constructor(
    private userRepo: IUserRepository,
    private sessionRepo: ISessionRepository

  ) { }

  async register(dto: CreateUserDto) {
    const user ={
            username: dto.username,
            email : dto.email,
            password: dto.password,
        }
        const existingUser = await this.userRepo.getByUsername(dto.username);
        if(existingUser){
            throw new HttpError(409, "نام کاربری یا ایمیل تکراری است");
        }
        const existingEmail = await this.userRepo.getByEmail(dto.email);
        if(existingEmail){
            throw new HttpError(409, "نام کاربری یا ایمیل تکراری است");
        }
    dto.password = hashingPassword(dto.password);
    return await this.userRepo.create(dto)
  }

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userRepo.getForLogin(dto.usernameOrEmail);
    if (!user) {
      throw new HttpError(400, "نام کاربری یا ایمیل اشتباه است");
    }
    if (comparePassword(dto.password, user.password)) {

      const AccToken = encryptJWT(user, process.env.JWT_SECRET ?? "", "15m");

      const expireDate = new Date(new Date().getDay() + 30);
      const session = await this.sessionRepo.create({
        userId: user.id,
        expireDate,
      })
      return {
        accessToken: AccToken,
        refreshToken: session.authCode
      };
    } else {
      throw new HttpError(400, "رمز عبور اشتباه است")
    }
  }
}