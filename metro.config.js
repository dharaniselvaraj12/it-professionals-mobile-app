const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure compatibility with web
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
