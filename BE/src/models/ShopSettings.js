const mongoose = require('mongoose');

const shopSettingsSchema = new mongoose.Schema(
  {
    shopName: { type: String, default: '' },
    hotline: { type: String, default: '' },
    address: { type: String, default: '' },
    googleMapsUrl: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShopSettings', shopSettingsSchema);
