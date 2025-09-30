import { Router } from "express";
import { NotificationService } from "../modules/notification/notification.service";
import { errorResponse } from "../../utility/response";
import { handleExpress } from "../../utility/handle-express";
import zod from "zod";


export const notificationRouter = (notificationService: NotificationService) => {
    const app = Router();

    app.get("/me", (req, res) => {
        const offset = zod.int().nonnegative().parse(Number(req.query.offset));
        const limit = zod.int().nonnegative().parse(Number(req.query.limit));
        const user = req.user;
        if (!user) {
            res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
            return;
        }
        handleExpress(res, () => notificationService.getMyNotifications(user.userId, offset, limit));
    })

    app.get("/friends", (req, res) => {
        const offset = zod.int().nonnegative().parse(Number(req.query.offset));
        const limit = zod.int().nonnegative().parse(Number(req.query.limit));
        const user = req.user;
        if (!user) {
            res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
            return;
        }
        handleExpress(res, () => notificationService.getFriendsNotifications(user.userId, offset, limit));
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