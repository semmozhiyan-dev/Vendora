"use strict";

const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"]
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: [1, "Quantity must be at least 1"]
    }
  },
  { _id: false }
);

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
      index: true
    },
    items: {
      type: [CartItemSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Ensure unique cart per user at the database level as well
CartSchema.index({ user: 1 }, { unique: true });

// Export model (avoid recompilation errors in watch/hot-reload setups)
module.exports = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
