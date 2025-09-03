import { DataSource, Repository } from "typeorm";
import { LikeEntity } from "./like.entity";


export interface ILikeRepository {
}

export class LikeRepository implements ILikeRepository {
  likeRepository: Repository<LikeEntity>;
  constructor(appDataSource: DataSource) {
    this.likeRepository = appDataSource.getRepository(LikeEntity);
  }
}
