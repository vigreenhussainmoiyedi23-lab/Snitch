import mongoose from "mongoose";
const subCategorySchema = new mongoose.Schema({
  name: String,
});
const subCategoryModel = mongoose.model("subCategory", subCategorySchema);
export default subCategoryModel;
