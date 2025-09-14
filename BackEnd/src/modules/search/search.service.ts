import { PostService } from "../post/post.service";
import { UserService } from "../user/user.service";

export class SearchService {
  constructor(
    userService: UserService,
    postService: PostService,
  ) { }
  async searchUsers(
    offset: number,
    limit: number,
    sort: "ASC" | "DESC",
    search: string,
    isSummary: boolean
  ) {
    return search;
  }
}