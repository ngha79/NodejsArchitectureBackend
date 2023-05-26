"use strict";

const mongoose = require("mongoose"); // Erase if already required
const slugify = require("slugify");
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      requried: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_slug: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
    },
    product_shop: {
      type: String,
      required: true,
    },
    product_attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    product_ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be above 1.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variation: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublish: { type: Boolean, default: false, index: true, select: false },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

// Middleware model
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});
productSchema.index({ product_name: "text", product_description: "text" });
// End middleware model

const clothingSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      requried: true,
    },
    size: String,
    material: String,
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  { timestamps: true, collection: "clothes" }
);

const electronicSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      requried: true,
    },
    size: String,
    material: String,
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  { timestamps: true, collection: "electronics" }
);

const furnitureSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      requried: true,
    },
    size: String,
    material: String,
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  { timestamps: true, collection: "furnitures" }
);

//Export the model
module.exports = {
  product: mongoose.model(DOCUMENT_NAME, productSchema),
  clothing: mongoose.model("Clothing", clothingSchema),
  electronic: mongoose.model("Electronics", electronicSchema),
  furniture: mongoose.model("Furnitures", furnitureSchema),
};
