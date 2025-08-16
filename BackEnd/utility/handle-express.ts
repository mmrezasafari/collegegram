import { Response } from "express";
import { HttpError } from "./http-error";
import { ZodError } from "zod";
import { DatabaseError } from "pg";
import { QueryFailedError } from "typeorm";
import { errorResponse, successResponse } from "./response";
import { loginResponseDto, LoginResponseDto } from "../src/modules/auth/dto/login-response.dto";
interface HasToken {
  accessToken?: string;
  refreshToken?: string;
}
export const handleExpress = async<A extends object | null>(res: Response, fn: () => Promise<A>) => {

  try {
    const data = await fn();
    if (data && ("accessToken" in data) && ("refreshToken" in data)) {
      res.status(200)
        .cookie("accessToken", data.accessToken)
        .cookie("refreshToken", data.refreshToken)
        .json(successResponse<A>(undefined, "کاربر با موفقیت وارد شد"));
    } else {
      res.status(200).json(successResponse<A>(data));
    }


  } catch (error) {

    if (error instanceof HttpError) {
      res.status(error.status).json(errorResponse(error.message));
      return;
    }

    else if (error instanceof ZodError) {
      res.status(400).json(errorResponse((String(error.issues))));
    }

    else if (error instanceof QueryFailedError) {

      const pgError = error.driverError as { code?: string };

      if (pgError.code === "23505") {
        res.status(409).json(errorResponse("نام کاربری یا ایمیل تکراری است"));
        return;
      }
    }

    res.status(500).json(errorResponse("خطای سرور"));
  }
}