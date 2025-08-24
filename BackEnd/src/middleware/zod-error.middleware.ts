import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { errorResponse } from "../../utility/response";

export const zodErrorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof ZodError) {
    if (error.issues[0].message === "Invalid UUID") {
      res.status(400).json(errorResponse("شناسه کاربر معتبر نیست"));
      return;
    }

    if (error.issues[0].path[0] === "password") {
      res.status(400).json(errorResponse("رمز عبور ایمن نیس"));
      return;
    }

    else if (error.issues[0].path[0] === "username") {
      res.status(400).json(errorResponse("نام‌کاربری باید حداقل ۵ کارکتر داشته باشد"));
      return;
    }

    else if (error.issues[0].path[0] === "email") {
      res.status(400).json(errorResponse("ایمیل معتبر نیست"));
      return;
    }

    res.status(400).json(errorResponse(String(error.issues)));
    return;
  }

  res.status(500).json(errorResponse("خطای سرور"));
  return;
}