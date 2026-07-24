import { buffer } from "node:stream/consumers";
import { imagekit } from "../config/imagekit.js";
import { toFile } from "@imagekit/nodejs";

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
