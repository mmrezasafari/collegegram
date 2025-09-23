import { DataSource, Repository } from "typeorm";
import { CloseFriendEntity } from "./close-friend.entity";


export interface ICloseFriendRepository {

}

export class CloseFriendRepository implements ICloseFriendRepository {
  saveRepository: Repository<CloseFriendEntity>;
  constructor(appDataSource: DataSource) {
    this.saveRepository = appDataSource.getRepository(CloseFriendEntity);
  }
}