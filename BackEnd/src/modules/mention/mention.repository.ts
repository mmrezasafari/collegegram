import { DataSource, DeleteResult, Repository } from "typeorm";
import { MentionEntity } from "./mention.entity";
import { Mention } from "./models/mention";
import { Post } from "../post/model/post";
import { MentionedPost } from "./models/mentionedPost";


export interface IMentionRepository {
    saveMention(userId: string, postId: string):Promise<Mention | null>;
    getUsernames(postId: string): Promise<string[]>;
    deleteMentionsByPostId(postId: string): Promise<DeleteResult>;
    getMentionPage(userId: string, offset: number, limit: number, sort: "ASC" | "DESC"): Promise<MentionedPost[] | null>
}

export class MentionRepository implements IMentionRepository {
  mentionRepository: Repository<MentionEntity>;
  constructor(appDataSource: DataSource) {
    this.mentionRepository = appDataSource.getRepository(MentionEntity);
  }
  
  async saveMention(userId: string, postId: string){
    return await this.mentionRepository.save({
        postId,
        userId
    })
  }

  async getUsernames(postId: string): Promise<string[]> {
    const rows = await this.mentionRepository
      .createQueryBuilder("mention")
      .innerJoin("mention.user", "user")
      .select("user.username", "username")
      .where("mention.postId = :postId", { postId })
      .getRawMany();

    return rows.map(r => r.username);
  }

  async deleteMentionsByPostId(postId: string) {
    return await this.mentionRepository.delete({ postId });
  }

  async getMentionPage(userId: string, offset: number, limit: number, sort: "ASC" | "DESC") {
    const [mentions, total] = await this.mentionRepository.createQueryBuilder("mention")
      .leftJoinAndSelect("mention.post", "post")
      .leftJoinAndSelect("post.images", "images")
      .where("mention.userId = :userId", { userId })
      .orderBy("post.createdAt", sort)
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const posts = mentions.map((m) => ({
      id: m.post.id,
      caption: m.post.caption,
      images: m.post.images.map((img) => ({
        id: img.id,
        url: img.url,
      })),
    }));

    return posts;
  }

}