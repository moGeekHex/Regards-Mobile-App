const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Modify resolver to support SVG files
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg');
defaultConfig.resolver.sourceExts.push('svg');

// Use `react-native-svg-transformer` for SVG files
defaultConfig.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

module.exports = mergeConfig(defaultConfig, {});