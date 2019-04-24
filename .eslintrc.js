const extend = require("eslint-plugin-evelyn/lib/extend");


module.exports = {
	"plugins": [
		"evelyn"
	],
	"extends": [
		"plugin:evelyn/default"
	],
	rules: {
		"indent": [
			"error",
			4
		]
	},
	"overrides": [
		// All src files use node and source configs
		extend(
			"node",
			"source",
			{
				"files": [
					"src/server/**/*.js",
				]
			}
		),
		extend(
			"jsx",
			"browser",
			{
				"files": [
					"src/client/**/*.js",
				],
				"parser": "babel-eslint"
			}
		)
	]
};
