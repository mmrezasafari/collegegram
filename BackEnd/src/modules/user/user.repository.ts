import { Brackets, DataSource, In, Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { User } from "./model/user";
import { Login } from "../auth/model/login";
import { SearchUserByDetails } from "../search/models/searchUsers";
import { ImageMimeType } from "../../../utility/image-mime-type.enum";

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
  getUsersByUsernames(usernames: string[]): Promise<User[] | null>;
  getByEmail(email: string): Promise<User | null>;
  getForLogin(usernameOrEmail: string): Promise<Login | null>;
  create(userDto: CreateUser): Promise<User | null>;
  update(id: string, updateUserDto: UpdateUser): Promise<User | null>;
  saveImage(id: string, imagePath: string, mimeType: ImageMimeType): Promise<void>;
  deleteImage(user: User): Promise<void | null>;
  searchUserInExplore(userId: string, offset: number, limit: number, sort: "ASC" | "DESC", search: string): Promise<SearchUserByDetails[] | null>
  getUsersExplore(userId: string, offset: number, limit: number, sort: "ASC" | "DESC"): Promise<SearchUserByDetails[] | null>

}
export class UserRepository implements IUserRepository {
  userRepository: Repository<UserEntity>;
  constructor(appDataSource: DataSource) {
    this.userRepository = appDataSource.getRepository(UserEntity);
  }

  async getById(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  async getByUsername(username: string) {
    return await this.userRepository.findOneBy({ username });
  }

  async getUsersByUsernames(usernames: string[]) {
    return this.userRepository.find({
      where: { username: In(usernames) },
    });
  }
  async getByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
  async getForLogin(usernameOrEmail: string): Promise<Login | null> {
    return await this.userRepository.findOne({
      where: [
        { email: usernameOrEmail },
        { username: usernameOrEmail }
      ],
      select: {
        id: true,
        username: true,
        password: true,
        email: true
      }
    });
  }
  async create(userDto: CreateUser): Promise<User | null> {
    return await this.userRepository.save(userDto);
  }

  async update(id: string, updateUserDto: UpdateUser): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOne({ where: { id } });
  }

  async saveImage(id: string, imagePath: string, mimeType: ImageMimeType): Promise<void> {
    await this.userRepository.update(id, { imagePath, mimeType });

  }

  async deleteImage(user: User): Promise<void | null> {
    await this.userRepository.update({ id: user.id }, {
      imagePath: null,
      mimeType: null
    } as any);
  }
  async searchUserInExplore(
    userId: string,
    offset: number,
    limit: number,
    sort: "ASC" | "DESC",
    search: string
  ): Promise<SearchUserByDetails[] | null> {
    return await this.userRepository.createQueryBuilder("user")
      .select("user.username", "username")
      .addSelect("user.firstName", "firstName")
      .addSelect("user.lastName", "lastName")
      .addSelect("user.imagePath", "imagePath")
      .addSelect("user.mimeType", "mimeType")
      .where(new Brackets(qb => {
        qb.where('user.username ILike :search', { search: `%${search}%` })
          .orWhere('user.firstName ILike :search', { search: `%${search}%` })
          .orWhere('user.lastName ILike :search', { search: `%${search}%` })
      }))
      .andWhere("user.id != :userId", { userId })
      .addSelect((qb) => {
        return qb.subQuery()
          .select('COUNT(*)')
          .from('follows', 'follow')
          .where('follow.followingId = user.id')
      }, 'followersCount')
      .addSelect((qb) => {
        return qb.subQuery()
          .select("CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END")
          .from("follows", "f")
          .where("f.followerId = :userId")
          .andWhere("f.followingId = user.id");
      }, "isFollowing")
      .orderBy('"followersCount"', sort)
      .addOrderBy("user.createdAt", sort)
      .skip(offset)
      .take(limit)
      .getRawMany()
  }
  async getUsersExplore(
    userId: string,
    offset: number,
    limit: number,
    sort: "ASC" | "DESC"
  ): Promise<SearchUserByDetails[] | null> {
    return await this.userRepository.createQueryBuilder("user")
      .select("user.username", "username")
      .addSelect("user.firstName", "firstName")
      .addSelect("user.lastName", "lastName")
      .addSelect("user.imagePath", "imagePath")
      .addSelect("user.mimeType", "mimeType")
      .andWhere("user.id != :userId", { userId })
      .addSelect((qb) => {
        return qb.subQuery()
          .select('COUNT(*)')
          .from('follows', 'follow')
          .where('follow.followingId = user.id')
      }, 'followersCount')
      .addSelect((qb) => {
        return qb.subQuery()
          .select("CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END")
          .from("follows", "f")
          .where("f.followerId = :userId")
          .andWhere("f.followingId = user.id");
      }, "isFollowing")
      .setParameter("userId", userId)
      .orderBy('"followersCount"', sort)
      .addOrderBy("user.createdAt", sort)
      .skip(offset)
      .take(limit)
      .getRawMany()
  }
}