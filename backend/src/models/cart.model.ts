import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true,
  },
  cartItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      isVariant: {
        type: Boolean,
        default: false,
      },
      variant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "variant",
      },
    },
  ],


});

const cartModel = mongoose.model("cart", cartSchema);
export default cartModel;
