import { buffer } from "node:stream/consumers";
import { imagekit } from "../config/imagekit.js";
import { toFile } from "@imagekit/nodejs";
import AppError from "../utils/AppError.js";

export const uploadImage = async (data: {
  buffer: Buffer;
  fileName: string;
  folder: string;
}) => {
  const res = await imagekit.files.upload({
    file: await toFile(Buffer.from(data.buffer), "file"),
    fileName: data.fileName,
    folder: data.folder,
  });

  return res;
};
export const isAdmin = (user: any) => {
  if (user.role !== "admin")
    throw new AppError("You are not authorized to perform this action", 401);
};
