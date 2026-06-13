const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for pnpm symlinks
config.resolver.blockList = [
  // Block pnpm virtual filesystem
  /.*\.pnpm\/.*/,
];

config.resolver.sourceExts = [...config.resolver.sourceExts, 'tsx', 'ts', 'jsx'];

module.exports = config;
