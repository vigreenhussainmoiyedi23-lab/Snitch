import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    shortDescription: String,

    description: String,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },

    sku: {
      type: String,
      unique: true,
      sparse: true,
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

    variants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "variant",
    }],

    attributes: {
      type: Map,
      of: String,
      default: {},
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    comparePrice: Number,

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

    allowBackorder: {
      type: Boolean,
      default: false,
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

    moderation: {
      approved: {
        type: Boolean,
        default: true,
      },

      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      rejectedReason: String,
    },

    publishedAt: Date,

    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);
const productModel = mongoose.model("Product", productSchema);
export default productModel;
