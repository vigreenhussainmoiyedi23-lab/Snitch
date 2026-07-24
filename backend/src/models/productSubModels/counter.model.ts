import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  name: String,
  sequence_value: Number,
});

const counterModel = mongoose.model("counter", counterSchema);
export default counterModel;
