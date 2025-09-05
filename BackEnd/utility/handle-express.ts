import { Response } from "express";
import { HttpError } from "./http-error";
import { ZodError } from "zod";
import { errorResponse, successResponse } from "./response";

export const handleExpress = async<A extends object | null>(res: Response, fn: () => Promise<A> | A) => {

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
    console.log(error)
    res.status(500).json(errorResponse("خطای سرور"));
  }
}