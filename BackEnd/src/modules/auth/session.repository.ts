import { DataSource, Repository } from "typeorm";
import { SessionEntity } from "./session.entity";
import { Session } from "./model/session";

export interface ISessionRepository {
  getByToken(token: string): Promise<Session | null>,
  create(session: createSession): Promise<Session>
  deleteSession(userId: string): Promise<void>;
}

export interface createSession {
  userId: string,
  expireDate: Date,
}
export class SessionRepository implements ISessionRepository {
  sessionRepository: Repository<SessionEntity>
  constructor(appDataSource: DataSource) {
    this.sessionRepository = appDataSource.getRepository(SessionEntity);
  }

  async getByToken(token: string) {
    return await this.sessionRepository.findOne({
      where: {
        token
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
  async deleteSession(userId: string) {
    await this.sessionRepository.delete({
      user: { id: userId }
    })
  }
}