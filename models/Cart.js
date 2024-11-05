// models/Cart.js
const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Reference to User model
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        ref: 'Product' // Reference to Product model
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      }
    }
  ],
  totalQuantity: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
