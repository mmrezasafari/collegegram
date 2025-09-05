import { DataSource, Repository } from "typeorm";
import { PostEntity } from "./post.entity";
import { Post } from "./model/post";
export interface IPostRepository {
  createPost(id: string, imagesUrls: string[], caption: string): Promise<Post | null>;
  getPosts(userId: string): Promise<Post[] | null>;
  getById(postId: string): Promise<Post | null>;
  countPost(userId: string): Promise<number>;
}

export class PostRepository implements IPostRepository {
  postRepository: Repository<PostEntity>;
  constructor(appDataSource: DataSource) {
    this.postRepository = appDataSource.getRepository(PostEntity);
  }

  async createPost(id: string, imageUrls: string[], caption: string) {
    const savedPost = await this.postRepository.save({
      caption,
      user: {
        id,
      },
      images: imageUrls.map(url => ({
        url
      }))
    });
    return savedPost;
  }

  async getPosts(userId: string) {
    return await this.postRepository.find({
      where: { user: { id: userId } },
      relations: ["images"],
      order: {
        createdAt: "DESC"
      }
    });
  }

  async getById(postId: string) {
    return await this.postRepository.findOneBy({ id: postId });
  }

  async countPost(userId: string): Promise<number> {
    return await this.postRepository.count({
      where: {
        user: {
          id: userId,
        }
      }
    })
  }

}
