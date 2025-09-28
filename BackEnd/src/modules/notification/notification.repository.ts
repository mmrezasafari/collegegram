import { DataSource, Repository } from "typeorm";
import { NotificationEntity } from "./notification.entity";
import { NotificationType } from "./notification-type.enum";


export interface INotificationRepository {
}

export class NotificationRepository implements INotificationRepository {
    notificationRepository: Repository<NotificationEntity>;
    constructor(appDataSource: DataSource) {
        this.notificationRepository = appDataSource.getRepository(NotificationEntity);
    }

}