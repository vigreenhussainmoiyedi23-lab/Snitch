import mongoose from "mongoose";
const subCategorySchema = new mongoose.Schema({
  name: String,
  category:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  }
});
const subCategoryModel = mongoose.model("subCategory", subCategorySchema);
export default subCategoryModel;
