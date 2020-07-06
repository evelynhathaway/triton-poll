const path = require("path");


module.exports = {
	mode: process.env.NODE_ENV || "production",
	entry: "./src/client/App.jsx",
	output: {
		path: path.resolve(__dirname, "public"),
		filename: "bundle.js",
	},
	resolve: {
		extensions: [".js", ".jsx"],
	},
	module: {
		rules: [
			{
				test: /\.m?jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							[
								"@babel/preset-react",
								{
									development: process.env.NODE_ENV === "development",
								},
							],
							[
								"@babel/preset-env",
								{
									targets: "> 0.25%, not dead",
								},
							],
						],
						plugins: [
							"@babel/plugin-proposal-class-properties",
							"@babel/plugin-proposal-optional-chaining",
							"transform-node-env-inline",
						],
					},
				},
			},
		],
	},
};
