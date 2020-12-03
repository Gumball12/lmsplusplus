const { resolve: resolvePath } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');
const Zipper = require('zip-webpack-plugin');
const Remover = require('remove-files-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    contentScript: './src/contentScript.js',
    'browser/js/index': './src/browser/js/index.js',
  },
  output: {
    path: resolvePath(__dirname, 'build'),
    filename: '[name].js'
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          context: 'src',
          from: 'browser/**/*',
          globOptions: {
            ignore: ['**/*.js'],
          },
        },
        {
          context: 'src',
          from: 'images/*.png',
        },
        {
          context: 'src',
          from: 'manifest.json',
        },
      ],
    }),
    new WebpackObfuscator({
      rotateStringArray: true,
    }),
    new Zipper({
      filename: 'lmsplusplus.zip',
    }),
    new Remover({
      before: {
        root: './build',
      },
      after: {
        root: './build',
        include: [
          'browser',
          'images',
          'contentScript.js',
          'manifest.json',
        ],
      },
    }),
  ],
};
