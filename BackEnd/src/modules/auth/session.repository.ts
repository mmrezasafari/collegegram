import { DataSource, Repository } from "typeorm";
import { SessionEntity } from "./session.entity";
import { Session } from "./model/session";

export interface ISessionRepository {
  getByUserId(userId: string): Promise<Session | null>,
  create(session: createSession): Promise<Session>
}

export interface createSession {
  userId: string,
  expireDate: Date,
}
export class SessionRepository implements ISessionRepository {
  sessionRepository: Repository<SessionEntity>
  constructor(appDataSource: DataSource) {
    this.sessionRepository = appDataSource.getRepository(SessionEntity)
  }

  async getByUserId(userId: string) {
    return await this.sessionRepository.findOne({
      where: {
        user: { id: userId }
      },
      relations: {
        user: true,
      }
    })
  }

  async create(session: createSession) {
    return await this.sessionRepository.save({
      user: { id: session.userId },
      ...session
    });
  }
}