import mongoose from "mongoose";
import slugify from "slugify";
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: String,
    shortDescription: String,

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      index: true,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      index: true,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      immutable: true, // Cannot be changed after creation
      index: true,
    },
    barcode: String,
    tags: [String],

    images: [
      {
        fileId: String,
        url: String,
        thumbnailUrl: String,
      },
    ],
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "variant",
      },
    ],

    attributes: {
      type: Map,
      of: String,
      default: {},
    },

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

    costPrice: Number,

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
    },

    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
      index: true,
    },

    visibility: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },

    shipping: {
      weight: Number,
      length: Number,
      width: Number,
      height: Number,
    },

    analytics: {
      views: {
        type: Number,
        default: 0,
      },

      purchases: {
        type: Number,
        default: 0,
      },

      wishlistCount: {
        type: Number,
        default: 0,
      },

      cartCount: {
        type: Number,
        default: 0,
      },
    },

    rating: {
      average: {
        type: Number,
        default: 0,
      },

      count: {
        type: Number,
        default: 0,
      },
    },

    ai: {
      generatedDescription: String,
      generatedTags: [String],
      embeddingsUpdatedAt: Date,
    },

    // allowBackorder: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  {
    timestamps: true,
  },
);
productSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title) + "-" + Date.now().toString().slice(-5);
  }
  if (this.isModified("mrp") || this.isModified("discount")) {
    this.finalPrice = this.mrp * (1 - this.discount / 100);
  }
});
const productModel = mongoose.model("Product", productSchema);
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });
export default productModel;
