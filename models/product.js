const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String,
      }
    ],
    SKU: {
      type: String,
    },
    rating: {
      type: Number,
    },
    publisher: {
      type: String,
    },
    category: {
      type: String,
    }
  }
)

module.exports = mongoose.model("Product", productSchema)