import { raw, Router } from "express";
import { SearchService } from "../modules/search/search.service";
import { handleExpress } from "../../utility/handle-express";
import zod from "zod";

export const searchRouter = (searchService: SearchService) => {
  const app = Router();

  app.get("/users", (req, res) => {
    const offset = zod.int().parse(Number(req.query.offset));
    const limit = zod.int().parse(Number(req.query.limit));
    const search = zod.string().parse(Number(req.query.search));
    const sort = zod.enum(["ASC", "DESC"]).parse(req.query.sort);
    const isSummary = zod.boolean().parse(req.query.isSummary);
    handleExpress(res, () => searchService.searchUsers(offset, limit, sort, search, isSummary))
  })
  return app;
}