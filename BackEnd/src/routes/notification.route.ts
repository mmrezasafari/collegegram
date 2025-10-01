import { Router } from "express";
import { NotificationService } from "../modules/notification/notification.service";
import { errorResponse } from "../../utility/response";
import { handleExpress } from "../../utility/handle-express";
import zod from "zod";
import { GetNotificationService } from "../modules/notification/get-notification.service";


export const notificationRouter = (notificationService: NotificationService, getNotificationService: GetNotificationService) => {
    const app = Router();

    app.get("/me", (req, res) => {
        const offset = zod.int().nonnegative().parse(Number(req.query.offset));
        const limit = zod.int().nonnegative().parse(Number(req.query.limit));
        const user = req.user;
        if (!user) {
            res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
            return;
        }
        handleExpress(res, () => getNotificationService.getMyNotifications(user.userId, offset, limit));
    })

     app.get("/friends", (req, res) => {
        const offset = zod.int().nonnegative().parse(Number(req.query.offset));
        const limit = zod.int().nonnegative().parse(Number(req.query.limit));
        const user = req.user;
        if (!user) {
            res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
            return;
        }
        handleExpress(res, () => getNotificationService.getFriendsNotifications(user.userId, offset, limit));
    })
    
    app.get("/unread-count", (req, res) => {
        const user = req.user;
        if (!user) {
            res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
            return;
        }
        handleExpress(res, () => notificationService.getUnreadCount(user.userId));
    })
    
    return app;
}