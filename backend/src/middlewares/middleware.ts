import { Request, Response } from "express";

export const middleware = (req: Request, res: Response): void => {
  res.send("Hello World!");
  console.log("Response sent");
};
