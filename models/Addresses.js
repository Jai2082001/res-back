const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  townCity: { type: String, required: true },
  district: { type: String, required: true },
  phone: { type: String, required: true },
  zipCode: { type: String, required: true },
  email: { type: String, required: true },
  isDefault: { type: Boolean, default: false }, // Optional: mark as default address
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
