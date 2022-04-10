const path = require("path"); //
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const devMode = process.env.NODE_ENV == "development";
const prodMode = !devMode;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  };
  if (prodMode) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }
  return config;
};

const filename = (ext) => (devMode ? `[name].${ext}` : `[name].[hash].${ext}`);
const babelOptions = (preset) => {
  const opts = {
    presets: ["@babel/preset-env"],
    plugins: [],
  };

  if (preset) {
    opts.presets.push(preset);
  }

  return opts;
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    main: ["@babel/polyfill", "./index.js", "./js/fetch.js"],
  }, 
  output: {
    filename: filename("js"), 
    path: path.resolve(__dirname, "dist"), 
  },
  resolve: {
 
    alias: {
      "@models": path.resolve(__dirname, "src/models"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimization: optimization(),
  devServer: {
    port: 5000,
    open: true,
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: "./index.html",
      inject: "body",
      minify: {
        collapseWhitespace: prodMode,
      },
    }),

    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css",
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, "src/assets/images/faviconName.png"),
    //       to: path.resolve(__dirname, "dist"),
    //     },
    //   ],
    // }),
  ],
  module: {
    rules: [

      {
        test: /\.s[ac]ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },

      {
        test: /\.(png|jpg|gif|svg)$/,
        type: "asset/resource",
      },

      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: "asset/resource",
      },

      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions(),
        },
      },
    ],
  },
};
