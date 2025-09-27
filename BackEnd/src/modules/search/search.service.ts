import { minioGetClient } from "../../config/minio.config";
import { CloseFriendService } from "../closeFriend/close-friend.service";
import { PostService } from "../post/post.service";
import { HashtagService } from "../tag/tag.service";
import { UserService } from "../user/user.service";
import { SearchUserBySummary } from "./models/searchUsers";

export class SearchService {
  constructor(
    private userService: UserService,
    private tagService: HashtagService,
    private closeFriendService: CloseFriendService,
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
        let imagePath = null;
        if (element.imagePath) {
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
          ...element,
          imagePath

        })
      }
      return response;

    }
  }

  async searchTags(
    userId: string,
    offset: number,
    limit: number,
    sort: "ASC" | "DESC",
    search: string | undefined,
    isSummary: boolean
  ) {
    const resultSearch = await this.tagService.searchTagInExplore(offset, limit, sort, search ?? null);
    if (!resultSearch) return [];

    const visiblePosts = [];
    for (const post of resultSearch) {
      const isCloseFriend = await this.closeFriendService.isCloseFriend(userId, post.user!.id);
      if (post.onlyCloseFriends && !isCloseFriend) {
        continue;
      }
      visiblePosts.push({
        id: post.id,
        caption: post.caption,
        onlyCloseFriends: post.onlyCloseFriends,
        images: post.images,
        createdAt: post.createdAt,
        tags: post.tags,
      });
    }

    if (isSummary) {
      const uniqueTags = Array.from(
        new Set(
          visiblePosts.flatMap((post) =>
            post.tags
              .filter((tag) => tag.context.includes(search ?? ""))
              .map((tag) => tag.context)
          )
        )
      );
      return uniqueTags;
    } else {
      return visiblePosts;
    }
  }


}