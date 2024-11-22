// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type:String  },
  stockQuantity: { type: Number, required: true },
  sku: { type: String, required: true, unique: true },
  ingredients: { type: String },
  nutritionalInfo: { type: String },
  expirationDate: { type: Date },
  imageUrl: { type: String },
  isVegan: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false }
});

module.exports = mongoose.model('Product', productSchema);
