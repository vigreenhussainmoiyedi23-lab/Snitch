import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
  name: String,
});
const categoryModel = mongoose.model("category", categorySchema);
export default categoryModel;
