import { minioGetClient } from "../../config/minio.config";
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
        let imagePath = "";
        if (element.imagePath !== null) {
          imagePath = await minioGetClient.presignedGetObject(
            "posts",
            element.imagePath,
            3600,
            {
              "response-content-disposition": "inline",
              "response-content-type": element.mimeType
            }
          );
        }
        response.push({
          username: element.username,
          firstName: element.firstName,
          lastName: element.lastName,
          mimeType: element.mimeType,
          imagePath
        })

      }
      return response;
    } else if (!resultSearch) {
      return null;
    }
    else {
      const response = []
      for (const element of resultSearch) {
        const imagePath = await minioGetClient.presignedGetObject(
          "posts",
          element.imagePath,
          3600,
          {
            "response-content-disposition": "inline",
            "response-content-type": element.mimeType
          }
        );
        response.push({
          ...element,
          imagePath

        })
      }
      return response;

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