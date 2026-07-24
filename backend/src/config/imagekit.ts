import ImageKit from "@imagekit/nodejs";
import { config } from "./config.js";
export const imagekit = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});
