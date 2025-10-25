import { raw, Router } from "express";
import { SearchService } from "../modules/search/search.service";
import { handleExpress } from "../../utility/handle-express";
import zod from "zod";
import { errorResponse } from "../../utility/response";

export const searchRouter = (searchService: SearchService) => {
  const app = Router();

  app.get("/users", (req, res) => {
    const offset = zod.int().nonnegative().parse(Number(req.query.offset));
    const limit = zod.int().nonnegative().parse(Number(req.query.limit));
    const search = zod.string().optional().parse(req.query.search);
    const sort = zod.enum(["ASC", "DESC"]).default("DESC").parse(req.query.sort);
    const isSummary = zod.coerce.boolean().parse(req.query.isSummary === "true");
    const user = req.user;
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => searchService.searchUsers(user.userId, offset, limit, sort, search, isSummary))
  })

  app.get("/tags", (req, res) => {
    const offset = zod.int().nonnegative().parse(Number(req.query.offset));
    const limit = zod.int().nonnegative().parse(Number(req.query.limit));
    const search = zod.string().optional().parse(req.query.search);
    const sort = zod.enum(["ASC", "DESC"]).default("DESC").parse(req.query.sort);
    const isSummary = zod.coerce.boolean().parse(req.query.isSummary === "true");
    const user = req.user;
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => searchService.searchTags(user.userId, offset, limit, sort, search, isSummary))
  })
  return app;
}