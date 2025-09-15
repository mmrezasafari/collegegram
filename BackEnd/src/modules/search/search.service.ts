import { PostService } from "../post/post.service";
import { UserService } from "../user/user.service";
import { SearchUserBySummary } from "./models/searchUsers";

export class SearchService {
  constructor(
    private userService: UserService,
    postService: PostService,
  ) { }
  async searchUsers(
    userId: string,
    offset: number,
    limit: number,
    sort: "ASC" | "DESC",
    search: string | undefined,
    isSummary: boolean
  ) {
    const resultSearch = await this.userService.searchUserInExplore(userId, offset, limit, sort, search ?? null);
    if (isSummary && resultSearch) {
      const response: SearchUserBySummary[] = [];
      for (const element of resultSearch) {
        response.push({
          username: element.username,
          firstName: element.firstName,
          lastName: element.lastName,
          imagePath: element.imagePath
        })
      }
      return response;
    } else {
      return resultSearch;

    }
  }
}