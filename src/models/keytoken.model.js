"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "KeyToken";
const COLLECTION_NAME = "KeyTokens";

// Declare the Schema of the Mongo model
const keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      requried: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokenUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
