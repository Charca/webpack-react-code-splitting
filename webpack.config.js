const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const apps = ["dashboard", "settings", "teams", "users"];

module.exports = (env) => {
  const plugins = env.development
    ? apps.map(
        (app) =>
          new HtmlWebpackPlugin({
            chunks: [app],
            filename: path.join(__dirname, "dist", app, "index.html"),
            template: path.join(__dirname, "src", "index.html"),
          })
      )
    : [];

  if (env.analyze) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return {
    mode: env.production ? "production" : "development",
    context: path.resolve(__dirname, "src", "apps"),
    entry: apps.reduce((acc, app) => {
      acc[app] = `./${app}/index.js`;
      return acc;
    }, {}),
    output: {
      filename: `[name].[contenthash].js`,
      chunkFilename: `[name].chunk.[contenthash].js`,
      path: path.join(__dirname, "dist"),
      clean: true,
    },
    devServer: {
      port: 3000,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    resolve: {
      extensions: ["", ".js", ".jsx"],
    },
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxAsyncRequests: 100,
        maxInitialRequests: 100,
        minSize: 2000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: function (module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];

              return `npm.${packageName.replace("@", "")}`;
            },
          },
        },
      },
    },
    plugins,
  };
};
