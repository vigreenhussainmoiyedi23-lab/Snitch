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
    mrp: { type: Number, default: 0, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: Number,
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
variantSchema.pre("save", function () {
  if (this.isModified("mrp") || this.isModified("discount")) {
    this.finalPrice = (this.mrp || 0) * (1 - (this.discount || 0) / 100);
  }
});
const variantModel = mongoose.model("variant", variantSchema);
export default variantModel;
