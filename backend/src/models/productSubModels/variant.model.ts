import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    // Matches the selected options (e.g., { "color": "Red", "size": "XL" })
    attributes: {
      type: Map,
      of: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    barcode: String,
    mrp: {
      type: Number,
      required: true,
    },
    finalPrice: {
      type: Number,
    },
    discount: {
      type: Number,
      default: 0, // percentage
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: [
      {
        fileId: String,
        url: String,
        thumbnailUrl: String,
      },
    ],
  },
  { timestamps: true },
);

// Calculate final price for the variant on save
variantSchema.pre("save", function () {
  if (this.isModified("mrp") || this.isModified("discount")) {
    this.finalPrice = this.mrp * (1 - this.discount / 100);
  }
});

const variantModel = mongoose.model("variant", variantSchema);
export default variantModel;
