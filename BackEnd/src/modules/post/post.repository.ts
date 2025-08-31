import { DataSource, Repository } from "typeorm";
import { PostEntity } from "./post.entity";
import { Post } from "./model/post";
import { UserEntity } from "../user/user.entity";

export interface IPostRepository {
  createPost(id: string, imagesUrls: string[], caption: string): Promise<Post | null>;
  getPosts(userId: string): Promise<Post[] | null>;
}
export class PostRepository implements IPostRepository {
  postRepository: Repository<PostEntity>;
  userRepository: Repository<UserEntity>;
  constructor(appDataSource: DataSource) {
    this.postRepository = appDataSource.getRepository(PostEntity);
    this.userRepository = appDataSource.getRepository(UserEntity);
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
      relations: ["images", "user"],
    });
    // return posts.map(post => ({
    //   id: post.id,
    //   caption: post.caption,
    //   images: post.images.map(img => img.url)
    // }));
  }

}
