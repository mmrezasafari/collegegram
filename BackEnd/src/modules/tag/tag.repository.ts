import { DataSource, Repository } from "typeorm";
import { TagEntity } from "./tag.entity";
import { Tag } from "./model/tag";
import { PostEntity } from "../post/post.entity";


export interface IHashtagRepository {
    saveHashtag(postId: string, hashtags: string[]):Promise<TagEntity[]  | undefined>
    removePostHashtags(postId: string): Promise<void>
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
}
