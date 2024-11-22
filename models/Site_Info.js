// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
  },
    Logo: {
    type: String,
  },
  BannerImages: [{type: String}],
  ProductDisplays: [{type: String}]
});

module.exports = mongoose.model('Site_Info', userSchema);
