import { comparePassword, hashingPassword } from "../../../utility/bcrypt-password";
import { HttpError } from "../../../utility/http-error";
import { CreateUserDto } from "./dto/create-user.dto";
import { IUserRepository } from "../user/user.repository";
import { LoginRequestDto } from "./dto/login-request.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { encryptJWT } from "../../../utility/jwt_utils";
import { ISessionRepository } from "./session.repository";
import { MailService } from "./mail.service";
import { IPasswordTokenRepository } from "./password-token.repository";
import { ResetPasswordDto } from "./dto/reset-password.dto";

export class AuthService {
  constructor(
    private userRepo: IUserRepository,
    private sessionRepo: ISessionRepository,
    private mailService: MailService,
    private passwordTokenRepo: IPasswordTokenRepository,

  ) { }

  async register(dto: CreateUserDto) {
    const user = {
      username: dto.username,
      email: dto.email,
      password: dto.password,
    }
    const existingUser = await this.userRepo.getByUsername(dto.username);
    if (existingUser) {
      throw new HttpError(409, "نام کاربری یا ایمیل تکراری است");
    }
    const existingEmail = await this.userRepo.getByEmail(dto.email);
    if (existingEmail) {
      throw new HttpError(409, "نام کاربری یا ایمیل تکراری است");
    }
    dto.password = hashingPassword(dto.password);
    const userFinal = await this.userRepo.create(dto)
    await this.mailService.sendMail(user.email, "خوش آمدید",
      `
      عزیز ${userFinal?.username}
      ثبت نام شما با موفقیت انجام شد.خوش آمدید
      \n
      ${process.env.FRONTEND_HOST}
      `)
    return userFinal
  }

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userRepo.getForLogin(dto.usernameOrEmail);
    if (user && comparePassword(dto.password, user.password)) {

      const accToken = encryptJWT(user.id, user.username, process.env.JWT_SECRET ?? "", "15m");
      const session = await this.createSession(user.id);

      return {
        accessToken: accToken,
        refreshToken: session.token
      };
    } else {
      throw new HttpError(400, "اطلاعات وارد شده اشتباه است")
    }
  }

  async getSessionByToken(token: string) {
    if (!token) {
      return null;
    }
    return await this.sessionRepo.getByToken(token);
  }

  async createSession(userId: string) {
    const expireDate = new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days

    const session = await this.sessionRepo.create({
      userId: userId,
      expireDate,
    })
    return session;
  }

  async logout(userId: string) {
    await this.sessionRepo.deleteSession(userId);
    return;
  }
  async forgetPassword(usernameOrEmail: string) {
    const user = await this.userRepo.getForLogin(usernameOrEmail);
    if (!user) {
      throw new HttpError(400, "اطلاعات وارد شده اشتباه است");
    }
    const resetPassword = await this.passwordTokenRepo.create({
      userId: user.id,
      expireDate: new Date(new Date().getTime() + (1 * 30 * 60 * 1000))
    })
    await this.mailService.sendMail(user.email, "فراموشی رمز عبور",
      `
      عزیز ${user?.username}
      درخواست تغییر رمز عبور دریافت شد.برای تغییر رمز عبور روی لینک زیر کلیک کنید
      \n
      ${process.env.FRONTEND_HOST}/forget-password/${resetPassword.token}
      `
    )
  }
  async checkToken(token: string, usernameOrEmail: string) {
    const resetPassword = await this.passwordTokenRepo.getByToken(token);
    if (!resetPassword ||
      !resetPassword.user ||
      (resetPassword.user.username !== usernameOrEmail && resetPassword.user.email !== usernameOrEmail)) {
      throw new HttpError(400, "اطلاعات وارد شده نامعتبر است");
    }
    if (resetPassword.expireDate < new Date()) {
      throw new HttpError(400, "توکن منقضی شده است");
    }
    return {
      message: "توکن معتبر است"
    };
  }
  async resetPassword(dto: ResetPasswordDto) {
    await this.checkToken(dto.token, dto.usernameOrEmail);
    const passwordToken = await this.passwordTokenRepo.getByToken(dto.token);
    if (!passwordToken) {
      throw new HttpError(400, "اطلاعات وارد شده نامعتبر است");
    }
    const user = await this.userRepo.update(passwordToken.user.id, {
      password: hashingPassword(dto.newPassword)
    });
    await this.passwordTokenRepo.deleteToken(passwordToken.token);
    return user;
  }
}