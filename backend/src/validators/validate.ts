import { validationResult } from "express-validator";
import { type RequestHandler } from "express";

export const validate: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      message: errors!.array()[0]!.msg,
    });
    return;
  }

  next();
};
