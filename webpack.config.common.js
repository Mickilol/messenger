const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle-[hash].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      "fs": false
    },
    alias: {
      handlebars : 'handlebars/dist/handlebars.js',
      api: path.resolve(__dirname, 'src', 'api'),
      components: path.resolve(__dirname, 'src', 'components'),
      core: path.resolve(__dirname, 'src', 'core'),
      pages: path.resolve(__dirname, 'src', 'pages'),
      services: path.resolve(__dirname, 'src', 'services'),
      store: path.resolve(__dirname, 'src', 'store'),
      styles: path.resolve(__dirname, 'src', 'styles'),
      tests: path.resolve(__dirname, 'src', 'tests'),
      utils: path.resolve(__dirname, 'src', 'utils'),
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          'css-loader',
          'sass-loader',
        ],
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style-[hash].css',
    }),
  ],
};