import { DataSource, Repository } from "typeorm";
import { PasswordTokenEntity } from "./password-token.entity";
import { PasswordToken } from "./model/password-token";


export interface IPasswordTokenRepository {
  getByToken(token: string): Promise<PasswordToken | null>,
  create(passwordToken: createPasswordToken): Promise<PasswordToken>
  deleteToken(userId: string): Promise<void>;
}

export interface createPasswordToken {
  userId: string,
  expireDate: Date,
}
export class PasswordTokenRepository implements IPasswordTokenRepository {
  passwordTokenRepository: Repository<PasswordTokenEntity>
  constructor(appDataSource: DataSource) {
    this.passwordTokenRepository = appDataSource.getRepository(PasswordTokenEntity);
  }
  async getByToken(token: string): Promise<PasswordToken | null> {
    return await this.passwordTokenRepository.findOne({
      where: {
        token
      },
      relations: {
        user: true
      }
    })
  }

  async create(passwordToken: createPasswordToken): Promise<PasswordToken> {
    const token = await this.passwordTokenRepository.findOne({
      where: {
        user: { id: passwordToken.userId }
      },
      relations: {
        user: true
      }
    })

    if (token) {
      await this.deleteToken(token.token);
    }
    return await this.passwordTokenRepository.save({
      user: { id: passwordToken.userId },
      expireDate: passwordToken.expireDate
    });
  }
  async deleteToken(token: string): Promise<void> {
    await this.passwordTokenRepository.delete({
      token
    })
  }
}