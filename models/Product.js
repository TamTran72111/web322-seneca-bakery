const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  taxable: {
    type: Boolean,
    required: true
  }
});

const Product = new mongoose.model("Product", ProductSchema);

module.exports = Product;
