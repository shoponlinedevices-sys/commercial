const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const expoRoot = path.dirname(require.resolve('expo/package.json'));
const expoNodeModules = path.resolve(expoRoot, '..');
const virtualStoreDir = path.resolve(expoNodeModules, '..', '..');

config.resolver.unstable_enableSymlinks = true;
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  expoNodeModules,
];
config.watchFolders = [...config.watchFolders, virtualStoreDir];

module.exports = config;
