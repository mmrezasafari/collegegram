import { PostService } from "../post/post.service";
import { HashtagService } from "../tag/tag.service";
import { UserService } from "../user/user.service";
import { SearchUserBySummary } from "./models/searchUsers";

export class SearchService {
  constructor(
    private userService: UserService,
    private tagService: HashtagService,
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

  async searchTags(
    offset: number,
    limit: number,
    sort: "ASC" | "DESC",
    search: string | undefined,
    isSummary: boolean
  ) {
    const resultSearch = await this.tagService.searchTagInExplore(offset, limit, sort, search ?? null);
    if (isSummary && resultSearch) {
      const uniqueTags = Array.from(
      new Set(
        resultSearch.flatMap(post =>
          post.tags
            .filter(tag => tag.context.includes(search ?? ""))
            .map(tag => tag.context)
        )
      )
    );
    return uniqueTags;
    } else {
      return resultSearch;
    }
  }


}