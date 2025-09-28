import { DataSource, Repository } from "typeorm";
import { TagEntity } from "./tag.entity";
import { PostEntity } from "../post/post.entity";
import { SearchTag } from "../search/models/searchTags";
import { Tag } from "./model/tag";


export interface IHashtagRepository {
    saveHashtag(postId: string, hashtags: string[]):Promise<Tag[]  | undefined>;
    removePostHashtags(postId: string): Promise<void>;
    searchTagInExplore(offset: number, limit: number, sort: "ASC" | "DESC", search: string): Promise<SearchTag[]>
    getTagsExplore(offset: number, limit: number, sort: "ASC" | "DESC"): Promise<SearchTag[]>;
}

export class HashtagRepository implements IHashtagRepository {
  tagRepository: Repository<TagEntity>;
  postRepository: Repository<PostEntity>;
  constructor(appDataSource: DataSource) {
    this.tagRepository = appDataSource.getRepository(TagEntity);
    this.postRepository = appDataSource.getRepository(PostEntity);
  }
  
  async saveHashtag(postId: string, hashtags: string[]) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ["tags"],
    });

    if (!post) return;

    const tags = await Promise.all(
      hashtags.map(async (context) => {
        let tag = await this.tagRepository.findOne({ where: { context } });
        if (!tag) {
          tag = this.tagRepository.create({ context });
          tag = await this.tagRepository.save(tag);
        }
        return tag;
      })
    );
    post.tags = tags;
    await this.postRepository.save(post);

    return tags;
  }

  async removePostHashtags(postId: string) {

    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ["tags"],
    });

    if (post) {
      post.tags = [];
      await this.postRepository.save(post);
    }
  }

  async searchTagInExplore(
    offset: number,
    limit: number,
    sort: "ASC" | "DESC",
    search: string
  ) {
    const postsWithTag = await this.postRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.images", "images")
      .leftJoinAndSelect("post.tags", "tags")
      .leftJoinAndSelect("post.user", "user")
      .where("tags.context LIKE :keyword", { keyword: `%${search}%` })

      .addOrderBy("post.createdAt", sort)
      .skip(offset)
      .take(limit)
      .getMany();

    return postsWithTag;
  }


  async getTagsExplore(
    offset: number,
    limit: number,
    sort: "ASC" | "DESC"
  ) {
    const posts = await this.postRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.images", "images")
      .leftJoinAndSelect("post.tags", "tags")
      .leftJoinAndSelect("post.user", "user")
      .addOrderBy("post.createdAt", sort)
      .skip(offset)
      .take(limit)
      .getMany();

    return posts
  }

}
