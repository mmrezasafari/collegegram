import { DataSource, Repository } from "typeorm";
import { PostEntity } from "./post.entity";
import { Post } from "./model/post";
import { PostImagesEntity } from "./post-images.entity";
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
    const user = await this.userRepository.findOneBy({ id })
    if (user) {
      const post = new PostEntity();
      post.caption = caption;
      post.user = user;
      post.images = imageUrls.map((path) => {
        const img = new PostImagesEntity();
        img.path = path;
        return img;
      });
      const savedPost = await this.postRepository.save(post);
      const postModel: Post = {
        id: savedPost.id,
        caption: savedPost.caption,
        owner: {
          id: savedPost.user.id,
          username: savedPost.user.username,
          email: savedPost.user.email,
        },
        images: savedPost.images.map((img) => img.path),
      };
      return postModel;
    }

    return null;
  }

  async getPosts(userId: string) {
    const posts = await this.postRepository.find({
      where: { user: { id: userId } },
      relations: ["images", "user"],
    });
    return posts.map(post => ({
      id: post.id,
      caption: post.caption,
      images: post.images.map(img => img.path)
    }));
  }

}
