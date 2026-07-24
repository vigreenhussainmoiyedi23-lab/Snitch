import mongoose from "mongoose";
const variantSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      immutable: true, // Cannot be changed after creation
      index: true,
    },
    price: Number,
    comparePrice: Number,
    stock: Number,
    barcode: String,

    attributes: {
      type: Map,
      of: String,
      default: {},
    },

    images: [
      {
        fileId: String,
        url: String,
        thumbnailUrl: String,
      },
    ],
  },
  { _id: false },
);
const variantModel = mongoose.model("variant", variantSchema);
export default variantModel;
