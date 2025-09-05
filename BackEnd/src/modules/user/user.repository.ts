import { DataSource, Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { User } from "./model/user";
import { Login } from "../auth/model/login";

export interface CreateUser {
  username: string,
  password: string,
  email: string
}

export interface UpdateUser {
  lastName?: string,
  firstName?: string,
  password?: string,
  email?: string,
  bio?: string
}

export interface IUserRepository {
  getById(id: string): Promise<User | null>;
  getByUsername(username: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  getForLogin(usernameOrEmail: string): Promise<Login | null>;
  create(userDto: CreateUser): Promise<User | null>;
  update(id: string, updateUserDto: UpdateUser): Promise<User | null>;
  saveImage(id: string, imagePath: string): Promise<void>;
}
export class UserRepository implements IUserRepository {
  userRepository: Repository<UserEntity>;
  constructor(appDataSource: DataSource) {
    this.userRepository = appDataSource.getRepository(UserEntity);
  }

  async getById(id: string) {
    const existingUser = await this.userRepository.findOneBy({ id });
    if (existingUser) {
      const { password, ...user } = existingUser;
      return user;
    }
    return null

  }

  async getByUsername(username: string) {
    const existingUser = await this.userRepository.findOneBy({ username });
    if (existingUser) {
      const { password, ...user } = existingUser;
      return user;
    }
    return null
  }
  async getByEmail(email: string) {
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      const { password, ...user } = existingUser;
      return user;
    }
    return null
  }
  async getForLogin(usernameOrEmail: string): Promise<Login | null> {
    return await this.userRepository.findOne({
      where: [
        { email: usernameOrEmail },
        { username: usernameOrEmail }
      ]
    });
  }
  async create(userDto: CreateUser): Promise<User | null> {
    const userSaved = await this.userRepository.save(userDto);
    const { password, ...user } = userSaved;
    return user;
  }

  async update(id: string, updateUserDto: UpdateUser): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    const updateUser = await this.userRepository.findOne({ where: { id } });
    if (!updateUser) return null;
    const { password, ...user } = updateUser;
    return user;
  }

  async saveImage(id: string, imagePath: string): Promise<void> {
    await this.userRepository.update(id, { imagePath });

  }

}