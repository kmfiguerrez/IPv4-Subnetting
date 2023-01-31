const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "production",
    entry: path.resolve(__dirname, "src/js/main.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "app.bundle.min.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "IPv4 Subnetting",
            filename: "index.html",
            template: "src/template.html"
        })
    ]

}