const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const outputPath = path.join(__dirname, '/dist');

module.exports = env => ({
  mode: env.mode,
  devtool: env.mode === 'development' ? 'inline-source-map' : undefined,
  context: path.resolve(__dirname, './src'),
  entry: {
    'website-js-toolbox': './index.ts',
  },
  output: {
    path: outputPath,
    filename: '[name].min.js',
    publicPath: '/dist/',
    sourceMapFilename: '[name].map',
    library: 'websiteJsToolbox',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    modules: [path.join(__dirname, 'src'), 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            experimentalWatchApi: true,
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
      chunkFilename: '[name].min.css',
    }),
  ],
  externals: {
    notyf: 'notyf',
    sweetalert2: 'sweetalert2',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        // vendor chunk
        vendor: {
          // sync + async chunks
          chunks: 'all',
          // import file path containing node_modules
          test: /node_modules/,
        },
      },
    },
  },
});
