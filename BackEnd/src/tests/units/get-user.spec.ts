import { CreateUserDto } from "../../modules/auth/dto/create-user.dto";
import { Login } from "../../modules/auth/model/login";
import { User } from "../../modules/user/model/user";
import { IUserRepository } from "../../modules/user/user.repository";
import { UserService } from "../../modules/user/user.service";

class UserMock implements IUserRepository {
  users: User[] = [];
  getById(id: string): Promise<any> {
    return Promise.resolve({ id, username: "test", email: "test@gmail.com" });
  }
  getByEmail(email: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  getByUsername(username: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  getForLogin(usernameOrEmail: string): Promise<Login | null> {
    throw new Error("Method not implemented.");
  }
  create(userDto: CreateUserDto): Promise<User | null> {
    const user = {
      id: "1",
      username: userDto.username,
      email: userDto.email,
    }
    this.users.push(user)
    return Promise.resolve(user);
  }
}
describe("get user", () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService(new UserMock());
  })

  it("should return user by id", async () => {
    const user = await userService.getUser("1");
    expect(user).toEqual({ id: "1", username: "test", email: "test@gmail.com" });
  });
});