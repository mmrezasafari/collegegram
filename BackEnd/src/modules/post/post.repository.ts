import { DataSource, In, Repository } from "typeorm";
import { PostEntity } from "./post.entity";
import { Post } from "./model/post";
import { PostImagesEntity } from "./post-images.entity";
export interface IPostRepository {
  createPost(id: string, imagesUrls: string[], caption: string): Promise<Post | null>;
  getPosts(userId: string): Promise<Post[] | null>;
  getById(postId: string): Promise<Post | null>;
  countPost(userId: string): Promise<number>;
  updatePost(postId: string, userId: string, imageUrls?: string[], caption?: string): Promise<Post | null>
  getFollowingPosts(usersId: string[], offset: number, limit: number, sort: string): Promise<Post[] | null>
}

export class PostRepository implements IPostRepository {
  postRepository: Repository<PostEntity>;
  postImagesRepository: Repository<PostImagesEntity>;

  constructor(appDataSource: DataSource) {
    this.postRepository = appDataSource.getRepository(PostEntity);
    this.postImagesRepository = appDataSource.getRepository(PostImagesEntity);
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

  async updatePost(postId: string, userId: string, imageUrls?: string[], caption?: string) {
    const existingPost: Post | null = await this.postRepository.findOne({
      where: { id: postId, user: { id: userId } },
      relations: ["images"]
    });
    if (!existingPost) return null;

    if (imageUrls && imageUrls.length > 0) {
      await this.postImagesRepository.delete({ post: { id: postId } });
      existingPost.images = imageUrls.map((url) =>
        this.postImagesRepository.create({ url })
      );
    }

    if (caption !== undefined) {
      existingPost.caption = caption;
    }

    return await this.postRepository.save(existingPost)


  }




  async getFollowingPosts(usersId: string[], offset: number, limit: number, sort: "ASC" | "DESC"): Promise<Post[] | null> {
    return await this.postRepository.find({
      where: {
        user: {
          id: In(usersId)
        }
      },
      relations: {
        user: true
      },
      skip: offset,
      take: limit,
      order: {
        createdAt: sort
      }
    })
  }
}
