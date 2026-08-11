import {
  type ErrorRequestHandler,
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from "express";
import AppError from "../utils/AppError.js";
import multer from "multer";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export const handleMulterError = (
  uploadMiddleware: RequestHandler
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({
            success: false,
            message: "File too large. Maximum file size is 5MB.",
          });
        }

        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (err) {
        return next(err);
      }

      next();
    });
  };
};

export default errorHandler;