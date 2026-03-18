// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Ensure Metro treats .xlsx as an asset file
config.resolver.assetExts.push("xlsx");

module.exports = config;