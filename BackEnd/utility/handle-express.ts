import { Response } from "express";
import { HttpError } from "./http-error";

export const handleExpress = async<A>(res: Response, fn: () => Promise<A>) => {
  try {
    const data = await fn();
    res.status(200).send(data);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send({ message: error.message });
      return;
    }
    res.status(500).send();
  }
}