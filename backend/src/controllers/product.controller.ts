import { uploadImage } from "../services/product.service.js";
import asyncHandler from "../utils/AsyncHandler.js";

export const CreateProductHandler = asyncHandler(async (req, res) => {
    const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0)
    return res.status(400).json({ message: "No image uploaded" });
  const responses = await Promise.all(
    files.map((file) =>
      uploadImage({
        buffer: file.buffer,
        fileName: file.originalname,
        folder: "products",
      }),
    ),
  );

  res.send(responses);
});
