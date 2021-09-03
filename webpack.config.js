const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const apps = ["dashboard", "settings", "teams", "users"];

module.exports = {
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
  plugins: apps.map(
    (app) =>
      new HtmlWebpackPlugin({
        chunks: [app],
        filename: path.join(__dirname, "dist", app, "index.html"),
        template: path.join(__dirname, "src", "index.html"),
      })
  ),
};
