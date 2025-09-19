import { DataSource, DeleteResult, In, Repository } from "typeorm";
import { PostEntity } from "./post.entity";
import { Post } from "./model/post";
import { PostImagesEntity } from "./post-images.entity";
import { PostImage } from "./model/post-image";
export interface IPostRepository {
  createPost(id: string, imagesUrls: Partial<PostImage>[], caption: string): Promise<Post | null>;
  getPosts(userId: string): Promise<Post[] | null>;
  getById(postId: string): Promise<PostEntity | null>;
  countPost(userId: string): Promise<number>;
  updatePost(postId: string, userId: string, imageUrls?: Partial<PostImage>[], caption?: string): Promise<Post | null>
  getFollowingPosts(usersId: string[], offset: number, limit: number, sort: string): Promise<Post[] | null>;
  removeImage(url: string): Promise<DeleteResult | null>;
}

export class PostRepository implements IPostRepository {
  postRepository: Repository<PostEntity>;
  postImagesRepository: Repository<PostImagesEntity>;

  constructor(appDataSource: DataSource) {
    this.postRepository = appDataSource.getRepository(PostEntity);
    this.postImagesRepository = appDataSource.getRepository(PostImagesEntity);
  }

  async createPost(id: string, imageUrls: PostImage[], caption: string) {
    const savedPost = await this.postRepository.save({
      caption,
      user: {
        id,
      },
      images: imageUrls.map((image) => ({
        url: image.url,
        mimeType: image.mimeType,
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
    return await this.postRepository.findOne({
      where: { id: postId },
      relations: ["user"],
    });
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

  async updatePost(postId: string, userId: string, imageUrls?: PostImage[], caption?: string) {
    const existingPost: Post | null = await this.getById(postId);
    if (!existingPost) return null;
    const postImage: PostImage[] = [];
    if (imageUrls && imageUrls.length > 0) {
      imageUrls.map((image) =>
        postImage.push(this.postImagesRepository.create({
          url: image.url,
          mimeType: image.mimeType,
          post: {
            id: existingPost.id
          },
        }))
      );
      existingPost.images = postImage.concat(existingPost.images);
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
  async removeImage(url: string) {
    return await this.postImagesRepository.delete({
      url
    })
  }
}
