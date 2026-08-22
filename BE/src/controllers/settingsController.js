const ShopSettings = require("../models/ShopSettings");
const asyncHandler = require("../middleware/asyncHandler");

const DEFAULT_SETTINGS = {
  shopName: "Ngô Như Cake Studio",
  hotline: "0981398552",
  address: "158/1A Đường 22 Tháng 4, Phường An Phú, TP. Hồ Chí Minh",
  googleMapsUrl: "https://maps.app.goo.gl/4GrYjvELXJRQT9sU7",
  facebookUrl: "https://www.facebook.com/share/1HFgrNTTZU/?mibextid=wwXIfr",
  notificationEmails: [],
};

const getSettings = asyncHandler(async function (req, res) {
  let settings = await ShopSettings.findOne();
  if (!settings) {
    settings = await ShopSettings.create(DEFAULT_SETTINGS);
  }
  res.json(settings);
});

const updateSettings = asyncHandler(async function (req, res) {
  const { shopName, hotline, address, googleMapsUrl, facebookUrl, notificationEmails } = req.body;

  let settings = await ShopSettings.findOne();
  if (!settings) {
    settings = new ShopSettings(DEFAULT_SETTINGS);
  }

  if (shopName !== undefined) settings.shopName = shopName;
  if (hotline !== undefined) settings.hotline = hotline;
  if (address !== undefined) settings.address = address;
  if (googleMapsUrl !== undefined) settings.googleMapsUrl = googleMapsUrl;
  if (facebookUrl !== undefined) settings.facebookUrl = facebookUrl;
  if (notificationEmails !== undefined) {
    settings.notificationEmails = Array.isArray(notificationEmails)
      ? notificationEmails.map((e) => e.trim()).filter(Boolean)
      : [];
  }

  await settings.save();
  res.json(settings);
});

module.exports = { getSettings, updateSettings };
