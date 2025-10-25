import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { errorResponse } from "../../utility/response";
import { MulterError } from "multer";

export const errorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof ZodError) {
    if (error.issues[0].message === "Invalid UUID") {
      res.status(400).json(errorResponse("شناسه معتبر نیست"));
      return;
    }

    if (error.issues[0].path[0] === "password" || error.issues[0].path[0] === "newPassword") {
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

  if (error instanceof MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json(errorResponse("حجم فایل بیش از حد مجاز است"));

      case "LIMIT_FILE_COUNT":
        return res.status(400).json(errorResponse("تعداد فایل‌های آپلود شده بیش از حد مجاز است"));

      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json(errorResponse("تعداد فایل‌های آپلود شده بیش از حد مجاز است"));
      case "LIMIT_FIELD_VALUE":
        return res.status(400).json(errorResponse("فرمت فایل پشتیبانی نمی‌شود"));

      default:
        return res.status(400).json(errorResponse(error.message));
    }
  }

  console.log(error)
  res.status(500).json(errorResponse("خطای سرور"));
  return;
}