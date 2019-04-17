const path = require("path");

module.exports = {
    mode: process.env.NODE_ENV || "production",
    entry: "./src/client/App.js",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [
                                "@babel/preset-react",
                                {
                                    development: process.env.NODE_ENV === "development",
                                }
                            ],
                            [
                                "@babel/preset-env",
                                {
                                    targets: "> 0.25%, not dead"
                                }
                            ]
                        ],
                        plugins: [
                            "@babel/plugin-proposal-class-properties",
                            "transform-node-env-inline"
                        ]
                    }
                }
            }
        ]
    }
};
