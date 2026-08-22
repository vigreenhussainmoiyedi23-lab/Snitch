import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    paymentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"payment",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    totalAmountPaid:{
        type:Number,
        required:true
    },
    productsPurchased:[{
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
    }],
    status: {
        type: String,
        default: "placed",
        enum:["placed","shipping","delivered","cancelled","refunded"]
    },
},{timestamps:true})

const orderModel=mongoose.model("order",orderSchema)

export default orderModel