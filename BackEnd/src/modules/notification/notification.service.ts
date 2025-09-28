import { NotificationType } from "./notification-type.enum";
import { INotificationRepository } from "./notification.repository";


export class NotificationService {
    constructor(
        private notificationRepo: INotificationRepository,
    ) { }
}