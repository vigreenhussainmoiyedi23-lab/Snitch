import mongoose from "mongoose";
const brandSchema = new mongoose.Schema({
  name: String,
});
const brandModel = mongoose.model("brand", brandSchema);
export default brandModel;
