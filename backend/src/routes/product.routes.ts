import { Router } from "express";
import upload from "../config/multer.js";
import { CreateProductHandler } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.get("/", (req, res) => {
  res.send("Product Route");
});
productRouter.post("/", upload.array("images"),CreateProductHandler);
productRouter.put("/", (req, res) => {});
productRouter.patch("/", (req, res) => {});
productRouter.delete("/", (req, res) => {});

export default productRouter;
